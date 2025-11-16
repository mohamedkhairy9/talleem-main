import React, { useState, useEffect } from 'react';
import { useConfigurationsQuery } from '@/api/hooks/useConfigurations';
import Loader from '@/components/common/Loader';
import useLocale from '@/utils/hooks/global/useLocale';
import EditConfigurationModal from './EditConfigurationModal';
import { useSearchParams } from 'react-router-dom';

export default function Configurations() {
    const { t } = useLocale();
    const [searchParams, setSearchParams] = useSearchParams();
    const [editingConfig, setEditingConfig] = useState(null);
    
    // Get program from URL or default to 'general'
    const selectedProgram = searchParams.get('program') || 'general';
    
    const { data, isLoading } = useConfigurationsQuery(selectedProgram);

    const configGroups = data?.data || [];

    const tabs = [
        { value: 'general', label: t('configurations.general') },
        { value: 'taaleem', label: t('configurations.taaleem') },
        { value: 'tahfiz', label: t('configurations.tahfiz') }
    ];

    // Function to change tab and update URL
    const handleTabChange = (program) => {
        setSearchParams({ program });
    };

    const renderField = (config) => {
        let displayValue;

        // Format display based on field type
        if (config.type === 'checkbox') {
            displayValue = (config.value === '1' || config.value === true) 
                ? '✓ ' + t('common.yes') 
                : '✗ ' + t('common.no');
        } else if (config.key === 'platform') {
            // Display platforms as chips
            const platforms = config.value.split(',').map(p => p.trim());
            displayValue = (
                <div className="flex flex-wrap gap-2 mt-1">
                    {platforms.map((platform, idx) => (
                        <span 
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                        >
                            {platform}
                        </span>
                    ))}
                </div>
            );
        } else {
            displayValue = config.value;
        }

        // Icon based on type
        const getTypeIcon = () => {
            switch (config.type) {
                case 'checkbox':
                    return (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    );
                case 'number':
                    return (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                    );
                case 'select':
                    return (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    );
                default:
                    return (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    );
            }
        };

        return (
            <div
                key={config.id}
                onClick={() => setEditingConfig(config)}
                className="p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-all group shadow-sm hover:shadow-md"
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        {getTypeIcon()}
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 font-medium">
                            {config.type}
                        </span>
                    </div>
                    <button className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {config.label}
                    </label>
                    <div className="text-lg font-semibold text-gray-900 bg-gray-50 p-2 rounded">
                        {displayValue}
                    </div>
                    {/* <div className="text-xs text-gray-400 mt-2 font-mono">
                        {config.key}
                    </div> */}
                </div>
            </div>
        );
    };

    const getProgramTitle = (program) => {
        switch (program) {
            case 'general':
                return t('configurations.general_settings');
            case 'taaleem':
                return t('configurations.taaleem_settings');
            case 'tahfiz':
                return t('configurations.tahfiz_settings');
            default:
                return '';
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{t('configurations.title')}</h1>

            {/* Custom Tabs with URL params */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleTabChange(tab.value)}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                    ${selectedProgram === tab.value
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
                {configGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        {group.length > 0 && (
                            <>
                                <h2 className="text-xl font-semibold mb-4 capitalize text-gray-800 border-b pb-2">
                                    {getProgramTitle(group[0].program)}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {group.map(config => renderField(config))}
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {/* Empty state */}
                {configGroups.length === 0 || (configGroups.length === 1 && configGroups[0].length === 0) && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            {t('configurations.no_configurations')}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {t('configurations.no_configurations_desc')}
                        </p>
                    </div>
                )}
            </div>

            {editingConfig && (
                <EditConfigurationModal
                    config={editingConfig}
                    onClose={() => setEditingConfig(null)}
                />
            )}
        </div>
    );
}