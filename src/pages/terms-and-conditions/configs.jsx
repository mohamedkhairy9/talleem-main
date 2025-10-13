import { enabledDisabledOptions } from '@/utils/constants/options';

export const termsAndConditionsFields = [
    {
        name: 'description.en',
        label: 'validation.description.label.en',
        type: 'textarea',
        placeholder: 'validation.description.placeholder.en'
    },
    {
        name: 'description.ar',
        label: 'validation.description.label.ar',
        type: 'textarea',
        placeholder: 'validation.description.placeholder.ar'
    },
    {
        name: 'status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        options: enabledDisabledOptions
    }
];
