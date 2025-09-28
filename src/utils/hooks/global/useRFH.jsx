import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

export default function useRFH({ schema, defaultValues = {} }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        control
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        control
    };
}
