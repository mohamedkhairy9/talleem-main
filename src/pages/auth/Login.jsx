import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HiEye } from 'react-icons/hi';
import { HiEyeSlash } from 'react-icons/hi2';
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../utils/stores/user.store';
import { useLoginMutation } from '../../api/hooks/useAuth';
import { loginSchema } from '../../utils/yup/loginSchema';
import { loginDefaultValues, loginFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';

import logo from '../../assets/images/logo.svg';
import bgLayer from '../../assets/images/bg-layer.png';

export default function Login() {
    const isAuthenticated = useUserStore(state => state.isAuthenticated);
    const [isVisible, setIsVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();

    // Form handling
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: loginDefaultValues
    });

    // Login mutation
    const { mutate: login, isPending } = useLoginMutation();

    useEffect(() => {
        // Trigger animations after component mounts
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div dir="ltr" className="min-h-screen font-islamic bg-gradient-to-tr from-primary to-primary-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url(${bgLayer})`,
                    backgroundSize: 'cover'
                }}
            />

            <div className="relative z-10  flex">
                {/* Left Section - Login Form */}
                <div className="flex-1 flex items-end justify-center min-h-screen px-8">
                    <div
                        className={`w-full max-w-md transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                            }`}
                    >
                        <div className="bg-white min-h-[82vh] rounded-t-2xl rounded-b-none shadow-2xl p-8 flex flex-col justify-start">
                            <div className="text-center mb-8">
                                <h3 className="text-lg text-gray-500 mb-2 font-medium">
                                    {t('auth.start_journey')}
                                </h3>
                                <h1 className="text-3xl font-bold text-primary mb-2 relative">
                                    {t('auth.login')}
                                </h1>
                            </div>

                            <form
                                dir="rtl"
                                onSubmit={handleSubmit(login)}
                                className="space-y-6 !font-islamic"
                            >

                                {loginFields.map(field =>
                                    field.name === 'password' ? (
                                        <div key={field.name} className="relative">
                                            <input
                                                {...register(field.name)}
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder={t(field.placeholder)}
                                                className="w-full border rounded-lg px-4 py-3 "
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(prev => !prev)}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            >
                                                {showPassword ? <HiEyeSlash size={20} /> : <HiEye size={20} />}
                                            </button>

                                            {errors[field.name]?.message && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors[field.name]?.message}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <InputRFH
                                            key={field.name}
                                            register={register}
                                            error={errors[field.name]?.message}
                                            {...field}
                                        />
                                    )
                                )}
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className={`w-full py-3 mb-32 rounded-lg font-medium transition-colors duration-200 ${isPending
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-primary-600 hover:bg-primary-700'
                                        } text-white`}
                                >
                                    {isPending ? (
                                        <div className="flex items-center gap-4 justify-center">
                                            جاري التحميل...
                                        </div>
                                    ) : (
                                        t('auth.login')
                                    )}
                                </button>

                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Section - Decorative Content */}
                <div className="hidden lg:flex flex-1 justify-center px-8">
                    <div
                        className={`text-center text-white transition-all duration-1000 ease-out transform ${isVisible
                            ? 'translate-y-0 opacity-100'
                            : '-translate-y-full opacity-0'
                            }`}
                    >
                        {/* Logo */}
                        <div className="mb-8">
                            <img
                                src={logo}
                                alt="Tallam Logo"
                                className=" mx-auto object-contain"
                            />
                        </div>

                        {/* Text Content */}
                        <div className="max-w-md font-islamic mx-auto">
                            <h3 className="text-2xl font-bold mb-4">
                                خيركم من تعلم القرآن وعلمه
                            </h3>
                            <p className="text-lg font-light leading-relaxed">
                                منصتك لتعلم التلاوة الصحيحة، وحفظ كتاب الله خطوة
                                بخطوة، بإشراف نخبة من المعلمين المتخصصين، لتتابع
                                تقدمك وتعيش معاني القرآن في حياتك اليومية
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
