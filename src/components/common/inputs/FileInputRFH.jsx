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
    defaultValue = []
}) {
    const { t } = useLocale();
    const [files, setFiles] = useState(defaultValue || []);
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);
    const registered = register(name);

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

        // Update the input value for react-hook-form
        const dataTransfer = new DataTransfer();
        newFiles.forEach(file => dataTransfer.items.add(file));
        e.target.files = dataTransfer.files;
        registered.onChange(e);
    };

    const removeFile = index => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);

        // Cleanup preview URL before removing
        if (previews[index]?.preview && previews[index].type === 'image') {
            URL.revokeObjectURL(previews[index].preview);
        }

        setFiles(newFiles);
        setPreviews(newPreviews);

        // Update the input value
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
                </label>
            )}

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
                        {multiple && (
                            <p className="text-xs text-gray-500 mt-1">
                                You can select multiple files
                            </p>
                        )}
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
                                        src={preview.preview}
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
                                        <p className="text-xs text-gray-400">
                                            {formatFileSize(preview.size)}
                                        </p>
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
                {files.length > 0 && previews.length === 0 && (
                    <div className="space-y-2">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
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
