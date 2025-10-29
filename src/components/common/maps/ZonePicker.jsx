// ZonePicker.jsx
import React, { useState, useCallback, useRef } from 'react';
import {
    GoogleMap,
    useJsApiLoader,
    Polygon,
    Marker,
    Autocomplete,
    DrawingManager
} from '@react-google-maps/api';
import useLocale from '../../../utils/hooks/global/useLocale';
import useGoogleMapsLoader from './useGoogleMapsLoader';

const containerStyle = {
    width: '100%',
    height: '300px'
};

const defaultCenter = {
    lat: 30.0444,
    lng: 31.2357
};

export default function ZonePicker({
    onZoneComplete,
    initialZone = null,
    disabled = false,
    reset
}) {
    const polygonRef = useRef(null);
    const { t } = useLocale();
    const [zone, setZone] = useState(initialZone || []);
    const [isComplete, setIsComplete] = useState(false);
    const [autocomplete, setAutocomplete] = useState(null);
    const searchInputRef = useRef(null);
    const mapRef = useRef(null);

    const { isLoaded } = useGoogleMapsLoader();

    const onMapClick = useCallback(
        e => {
            if (isComplete || disabled) return;

            const newPoint = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };

            setZone(prev => [...prev, newPoint]);
        },
        [isComplete]
    );

    const onLoadAutocomplete = useCallback(autocompleteInstance => {
        setAutocomplete(autocompleteInstance);
    }, []);

    const onPlaceChanged = useCallback(() => {
        if (!autocomplete) return;

        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            console.log('No location available for this place');
            return;
        }

        // Center the map on the searched location
        const newCenter = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };

        if (mapRef.current) {
            mapRef.current.panTo(newCenter);
            mapRef.current.setZoom(15);
        }
    }, [autocomplete]);

    const completeZone = useCallback(() => {
        if (zone.length >= 3) {
            setIsComplete(true);
            onZoneComplete(zone);
        }
    }, [zone, onZoneComplete]);

    const resetZone = useCallback(() => {
        setZone([]);
        setIsComplete(false);
        reset();

        if (polygonRef.current) {
            polygonRef.current.setMap(null);
            polygonRef.current = null;
        }
    }, []);

    const onLoadMap = useCallback(map => {
        mapRef.current = map;
    }, []);

    const handleOverlayComplete = useCallback(
        e => {
            // eslint-disable-next-line no-undef
            if (e.type === google.maps.drawing.OverlayType.POLYGON) {
                // Remove previously drawn polygon from map
                if (polygonRef.current) {
                    polygonRef.current.setMap(null);
                }

                const newPolygon = e.overlay;
                polygonRef.current = newPolygon;

                // Make polygon editable
                newPolygon.setEditable(true);

                // Extract path
                const path = newPolygon.getPath().getArray();
                const coordinates = path.map(latlng => ({
                    lat: latlng.lat(),
                    lng: latlng.lng()
                }));

                // Update zone and mark complete
                setZone(coordinates);
                setIsComplete(true);

                // Fire onZoneComplete callback
                onZoneComplete(coordinates);

                // Optional: handle polygon click
                newPolygon.addListener('click', () => {
                    alert('Polygon clicked!');
                });

                console.log('Polygon coordinates:', coordinates);
                if (disabled) {
                    resetZone();
                    setZone(initialZone);
                }
            }
        },
        [onZoneComplete]
    );

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div className="zone-picker">
            {!disabled && (
                <div className="flex justify-between items-center mb-4">
                    <p>{t('note-zone-pick')}</p>

                    <div className="controls flex gap-2">
                        <button
                            type="button"
                            onClick={resetZone}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            {t('reset.title')}
                        </button>
                    </div>
                </div>
            )}

            {!disabled && (
                <div className="search-container mb-4">
                    <Autocomplete
                        onLoad={onLoadAutocomplete}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            type="text"
                            placeholder={t('zone-search')}
                            ref={searchInputRef}
                            className="outline-none rounded-lg border border-gray-300 w-full p-2"
                        />
                    </Autocomplete>
                </div>
            )}

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={zone.length > 0 ? zone[0] : defaultCenter}
                zoom={10}
                onClick={onMapClick}
                onLoad={onLoadMap}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    clickableIcons: false,
                    fullscreenControl: true
                }}
            >
                {/* Show markers for each point */}
                {zone.map((point, index) => (
                    <Marker
                        key={index}
                        position={point}
                        label={(index + 1).toString()}
                    />
                ))}

                {!isComplete && (
                    <DrawingManager
                        options={{
                            drawingControl: false
                        }}
                        // eslint-disable-next-line no-undef
                        drawingMode={google.maps.drawing.OverlayType.POLYGON}
                        onOverlayComplete={handleOverlayComplete}
                    />
                )}

                {/* Show polygon when we have at least 3 points */}
                {zone.length >= 3 && (
                    <Polygon
                        paths={zone}
                        options={{
                            fillColor: '#FF0000',
                            fillOpacity: 0.35,
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            clickable: false,
                            draggable: false,
                            editable: false,
                            geodesic: false,
                            zIndex: 1
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    );
}
