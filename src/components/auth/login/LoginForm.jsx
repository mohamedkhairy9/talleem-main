import React from 'react';
import InputRFH from '@/components/common/inputs/InputRFH';
import useRFH from '@/utils/hooks/global/useRFH';
import Btn from '@/components/common/buttons/Btn';
import {
    loginDefaultValues as defaultValues,
    loginFields
} from '@/pages/auth/configs';
import { loginSchema as schema } from '@/utils/yup/loginSchema';
import { useLoginMutation } from '../../../api/hooks/useAuth';

export default function LoginForm() {
    const { register, errors, handleSubmit } = useRFH({
        schema,
        defaultValues
    });

    const { mutate, isPending } = useLoginMutation();

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <form onSubmit={handleSubmit(mutate)} className="space-y-2">
                    

                    <Btn
                        className="py-2 w-full"
                        type="submit"
                        label="Submit"
                        loading={isPending}
                    />
                </form>
            </div>
        </div>
    );
}
