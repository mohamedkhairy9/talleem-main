import React, { useState, useRef, useEffect } from 'react';
import useLocale from '@/utils/hooks/global/useLocale';
import { HiX, HiCloudUpload } from 'react-icons/hi';

export default function FileInputRFH({
    error,
    label,
    placeholder,
    name,
    register,
    disabled,
    accept,
    multiple = false,
    defaultValue = [],
    setValue,
    required = false,
    hint
}) {
    const { t } = useLocale();
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);
    const registered = register(name);

    // Initialize with default values - separate File objects from URL objects
    useEffect(() => {
        if (defaultValue && defaultValue.length > 0) {
            const initialFiles = [];
            const initialPreviews = [];

            defaultValue.forEach(item => {
                // Check if it's a File object
                if (item instanceof File) {
                    initialFiles.push(item);
                    // Create preview for File
                    if (item.type.startsWith('image/')) {
                        initialPreviews.push({
                            file: item,
                            preview: URL.createObjectURL(item),
                            type: 'image'
                        });
                    } else {
                        initialPreviews.push({
                            file: item,
                            preview: null,
                            type: 'file',
                            name: item.name,
                            size: item.size
                        });
                    }
                }
                // Check if it's a file object with URL (from API)
                else if (item && typeof item === 'object' && item.url) {
                    initialPreviews.push({
                        file: null, // Not a File object, just a reference
                        preview: item.url,
                        type: item.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                            ? 'image'
                            : 'file',
                        name: item.name,
                        size: item.size,
                        url: item.url,
                        isExisting: true // Flag to indicate this is an existing file
                    });
                }
                // Check if it's a URL string (from API)
                else if (typeof item === 'string' && (item.startsWith('http://') || item.startsWith('https://'))) {
                    const fileName = item.split('/').pop() || 'file';
                    initialPreviews.push({
                        file: null, // Not a File object, just a reference
                        preview: item,
                        type: item.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                            ? 'image'
                            : 'file',
                        name: fileName,
                        size: null,
                        url: item,
                        isExisting: true // Flag to indicate this is an existing file
                    });
                }
            });

            setFiles(initialFiles);
            setPreviews(initialPreviews);
        }
    }, [defaultValue]);

    const handleFileChange = e => {
        const selectedFiles = Array.from(e.target.files || []);

        if (selectedFiles.length === 0) return;

        // If not multiple, replace all files. If multiple, add new ones that aren't already in the list
        const newFiles = multiple
            ? [
                  ...files,
                  ...selectedFiles.filter(
                      newFile =>
                          !files.some(
                              existingFile =>
                                  existingFile.name === newFile.name &&
                                  existingFile.size === newFile.size &&
                                  existingFile.lastModified ===
                                      newFile.lastModified
                          )
                  )
              ]
            : selectedFiles;
        setFiles(newFiles);

        // Create previews for images
        const newPreviews = selectedFiles.map(file => {
            if (file.type.startsWith('image/')) {
                return {
                    file,
                    preview: URL.createObjectURL(file),
                    type: 'image'
                };
            }
            return {
                file,
                preview: null,
                type: 'file',
                name: file.name,
                size: file.size
            };
        });

        setPreviews(prev =>
            multiple ? [...prev, ...newPreviews] : newPreviews
        );

        // Update react-hook-form with the files array
        if (setValue) {
            setValue(name, newFiles, { shouldValidate: true });
        } else {
            // Fallback: Update the input value for react-hook-form
            const dataTransfer = new DataTransfer();
            newFiles.forEach(file => dataTransfer.items.add(file));
            e.target.files = dataTransfer.files;
            registered.onChange(e);
        }
    };

    const removeFile = index => {
        const previewToRemove = previews[index];

        // Only remove File objects from files array, not existing URL objects
        const newFiles = files.filter((_, i) => {
            // Find the corresponding file index by checking previews
            return (
                previews[i]?.file !== previewToRemove?.file ||
                previewToRemove?.isExisting
            );
        });

        const newPreviews = previews.filter((_, i) => i !== index);

        // Cleanup preview URL before removing (only for File objects, not URLs)
        if (
            previewToRemove?.preview &&
            previewToRemove.type === 'image' &&
            !previewToRemove.isExisting
        ) {
            URL.revokeObjectURL(previewToRemove.preview);
        }

        setFiles(newFiles);
        setPreviews(newPreviews);

        // Update react-hook-form with only File objects (not existing URL objects)
        if (setValue) {
            setValue(name, newFiles, { shouldValidate: true });
        } else {
            // Fallback: Update the input value
            const dataTransfer = new DataTransfer();
            newFiles.forEach(file => dataTransfer.items.add(file));
            if (fileInputRef.current) {
                fileInputRef.current.files = dataTransfer.files;

                // Trigger onChange for react-hook-form without re-running handleFileChange
                // We manually update the form state
                const syntheticEvent = {
                    target: fileInputRef.current,
                    currentTarget: fileInputRef.current
                };
                registered.onChange(syntheticEvent);
            }
        }
    };

    const formatFileSize = bytes => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
        );
    };

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            previews.forEach(preview => {
                if (preview.preview && preview.type === 'image') {
                    URL.revokeObjectURL(preview.preview);
                }
            });
        };
    }, [previews]);

    return (
        <div>
            {label && (
                <label
                    htmlFor={name}
                    className="block font-medium text-gray-700 mb-1"
                >
                    {t(label)}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {hint ? (
                <p className="mb-2 text-xs text-gray-600 leading-relaxed">{hint}</p>
            ) : null}

            <div className="space-y-3">
                {/* File Input */}
                <div
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={`
                        w-full border-2 border-dashed rounded-lg p-6
                        cursor-pointer transition-all duration-200
                        ${
                            error
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300 bg-gray-50'
                        }
                        ${
                            disabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:border-accent hover:bg-gray-100'
                        }
                    `}
                >
                    <input
                        {...registered}
                        ref={fileInputRef}
                        type="file"
                        id={name}
                        name={name}
                        className="hidden"
                        disabled={disabled}
                        accept={accept}
                        multiple={multiple}
                        onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                        <HiCloudUpload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                            {t(placeholder) || 'Click to upload files'}
                        </p>
                    </div>
                </div>

                {/* File Previews */}
                {previews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {previews.map((preview, index) => (
                            <div
                                key={index}
                                className="relative group border border-gray-200 rounded-lg overflow-hidden bg-white"
                            >
                                {preview.type === 'image' ? (
                                    <img
                                        src={preview.preview || preview.url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-100 p-2">
                                        <div className="text-3xl text-gray-400 mb-1">
                                            📄
                                        </div>
                                        <p className="text-xs text-gray-600 text-center truncate w-full px-1">
                                            {preview.name}
                                        </p>
                                        {preview.size && (
                                            <p className="text-xs text-gray-400">
                                                {typeof preview.size ===
                                                'string'
                                                    ? preview.size
                                                    : formatFileSize(
                                                          preview.size
                                                      )}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                    >
                                        <HiX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* File List (for non-previewable files) */}
                {previews.length > 0 &&
                    previews.some(p => p.type === 'file' && !p.preview) && (
                        <div className="space-y-2">
                            {previews
                                .filter(p => p.type === 'file' && !p.preview)
                                .map((preview, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-700 truncate">
                                                {preview.name}
                                            </p>
                                            {preview.size && (
                                                <p className="text-xs text-gray-500">
                                                    {typeof preview.size ===
                                                    'string'
                                                        ? preview.size
                                                        : formatFileSize(
                                                              preview.size
                                                          )}
                                                </p>
                                            )}
                                        </div>
                                        {!disabled && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const originalIndex =
                                                        previews.findIndex(
                                                            p => p === preview
                                                        );
                                                    removeFile(originalIndex);
                                                }}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <HiX className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}
            </div>

            {error && (
                <p
                    id={`${name}-error`}
                    className="mt-1 h-4 text-xs text-red-600"
                    role="alert"
                >
                    {t(error) || ''}
                </p>
            )}
        </div>
    );
}
