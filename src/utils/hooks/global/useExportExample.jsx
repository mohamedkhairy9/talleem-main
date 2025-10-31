import React from 'react';

export default function useExportExample({
    mutate,
    filename = 'example.xlsx'
}) {
    const handleExportExample = () => {
        mutate(undefined, {
            onSuccess: response => {
                // Support both axios instances that return full response or response.data directly
                const blobLike =
                    response instanceof Blob ? response : response?.data;
                const blob =
                    blobLike instanceof Blob
                        ? blobLike
                        : new Blob([blobLike], {
                              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                          });

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        });
    };

    return { handleExportExample };
}
