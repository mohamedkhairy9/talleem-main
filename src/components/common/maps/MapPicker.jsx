'use client';

import React, { useCallback, useRef, useState } from 'react';
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    Autocomplete
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

export default function MapPicker({
    onLocationSelect,
    oldLocation = null,
    disabled = false
}) {
    const { t } = useLocale();
    const [marker, setMarker] = useState(oldLocation || null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const searchInputRef = useRef(null);

    const { isLoaded } = useGoogleMapsLoader();

    const onMapClick = useCallback(
        e => {
            if (disabled) return;
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarker({ lat, lng });
            
            // Reverse geocode to get address
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const address = results[0].formatted_address;
                    setSearchValue(address);
                    onLocationSelect({ lat, lng, address });
                } else {
                    setSearchValue('');
                    onLocationSelect({ lat, lng, address: '' });
                }
            });
        },
        [onLocationSelect, disabled]
    );

    const onLoad = useCallback(autocompleteInstance => {
        setAutocomplete(autocompleteInstance);
    }, []);

    const onPlaceChanged = useCallback(() => {
        if (disabled || !autocomplete) return;

        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            console.log('No location available for this place');
            return;
        }
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || '';
        setMarker({ lat, lng });
        setSearchValue(address);
        onLocationSelect({ lat, lng, address });
    }, [autocomplete, onLocationSelect, disabled]);

    if (!isLoaded) return <div>Loading Map...</div>;

    const zoom = marker ? (disabled ? 15 : 12) : 6;

    return (
        <div className="map-picker-container">
            {!disabled && (
                <div
                    className="search-container"
                    style={{ marginBottom: '10px' }}
                >
                    <Autocomplete
                        onLoad={onLoad}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            className="outline-none rounded-lg border border-gray-300 w-full p-2"
                            ref={searchInputRef}
                            type="text"
                            placeholder={t('zone-search')}
                            disabled={disabled}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </Autocomplete>
                </div>
            )}

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={marker || defaultCenter}
                zoom={zoom}
                onClick={onMapClick}
                options={{
                    draggable: true,
                    zoomControl: true,
                    scrollwheel: true,
                    disableDoubleClickZoom: disabled,
                    gestureHandling: 'auto'
                }}
            >
                {marker && <Marker position={marker} />}
            </GoogleMap>
        </div>
    );
}
