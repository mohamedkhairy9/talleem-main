'use client';
// useGoogleMapsLoader.js
import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places', 'drawing']; // superset of all used libs

export default function useGoogleMapsLoader() {
    return useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBSojBslZCujSCQb8tNB5sxRWXwa6aO_Ec',
        libraries
    });
}
