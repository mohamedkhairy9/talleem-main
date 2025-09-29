import React from 'react';

export default function Loader() {
    return (
        <div className="flex fixed top-0 left-0 right-0 bottom-0 z-50 bg-black/50 justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-primary"></div>
        </div>
    );
}
