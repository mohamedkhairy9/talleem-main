import React from 'react';

export default function useExportExample({mutate, filename = 'example.xlsx'}) {
    const handleExportExample = () => {
        mutate(undefined, {
            onSuccess: response => {
                // Create a blob from the response data
                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                // Create a URL for the blob
                const url = window.URL.createObjectURL(blob);

                // Create a temporary anchor element and trigger download
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

                // Cleanup
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        });
    };

    return { handleExportExample };
}
