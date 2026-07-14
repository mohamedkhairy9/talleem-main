export const loginFields = [
    {
        type: 'text',
        name: 'national_id',
        label: 'auth.national_id.label',
        placeholder: 'auth.national_id.placeholder'
    },
    {
        type: 'password',
        name: 'password',
        label: 'auth.password.label',
        placeholder: 'auth.password.placeholder'
    }
];

export const loginDefaultValues = {
    national_id: '',
    password: ''
};
