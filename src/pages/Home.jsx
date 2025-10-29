import React from 'react';
import useLocale from '@/utils/hooks/global/useLocale';
import {
    HiAcademicCap,
    HiBookOpen,
    HiUsers,
    HiOfficeBuilding,
    HiChartBar,
    HiLightningBolt,
    HiSparkles,
    HiStatusOnline
} from 'react-icons/hi';

export default function Home() {
    const { t } = useLocale();

    const features = [
        {
            icon: HiBookOpen,
            titleKey: 'home.features.quran_management',
            descriptionKey: 'home.features.quran_management_desc',
            gradient: 'from-emerald-400 to-teal-600'
        },
        {
            icon: HiAcademicCap,
            titleKey: 'home.features.education_programs',
            descriptionKey: 'home.features.education_programs_desc',
            gradient: 'from-blue-400 to-indigo-600'
        },
        {
            icon: HiUsers,
            titleKey: 'home.features.user_management',
            descriptionKey: 'home.features.user_management_desc',
            gradient: 'from-purple-400 to-pink-600'
        },
        {
            icon: HiOfficeBuilding,
            titleKey: 'home.features.entity_management',
            descriptionKey: 'home.features.entity_management_desc',
            gradient: 'from-orange-400 to-red-600'
        },
        {
            icon: HiChartBar,
            titleKey: 'home.features.analytics',
            descriptionKey: 'home.features.analytics_desc',
            gradient: 'from-cyan-400 to-blue-600'
        },
        {
            icon: HiLightningBolt,
            titleKey: 'home.features.notifications',
            descriptionKey: 'home.features.notifications_desc',
            gradient: 'from-yellow-400 to-orange-600'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-700 to-primary-900 rounded-2xl shadow-2xl mb-8">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                            backgroundSize: '40px 40px'
                        }}
                    ></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-700"></div>

                <div className="relative z-10 px-8 py-16 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg">
                            <HiSparkles className="w-10 h-10 text-white animate-pulse" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            {t('home.welcome.title')}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                            {t('home.welcome.subtitle')}
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                                <HiStatusOnline className="w-5 h-5 text-green-300" />
                                <span className="text-sm font-medium">
                                    {t('home.welcome.status')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="mb-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        {t('home.features.title')}
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {t('home.features.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                {/* Gradient Background on Hover */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                                ></div>

                                {/* Icon */}
                                <div
                                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <Icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {t(feature.titleKey)}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {t(feature.descriptionKey)}
                                </p>

                                {/* Decorative Element */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent via-gray-50 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* About Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Left Card - App Information */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <HiBookOpen className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {t('home.about.title')}
                        </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        {t('home.about.description')}
                    </p>
                    <div className="space-y-3 mt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-700">
                                {t('home.about.feature1')}
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-700">
                                {t('home.about.feature2')}
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-700">
                                {t('home.about.feature3')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Card - Quick Start */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                            <HiLightningBolt className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {t('home.quick_start.title')}
                        </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        {t('home.quick_start.description')}
                    </p>
                    <div className="space-y-4">
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-200">
                            <p className="font-semibold text-gray-900 mb-1">
                                {t('home.quick_start.step1_title')}
                            </p>
                            <p className="text-sm text-gray-600">
                                {t('home.quick_start.step1_desc')}
                            </p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-200">
                            <p className="font-semibold text-gray-900 mb-1">
                                {t('home.quick_start.step2_title')}
                            </p>
                            <p className="text-sm text-gray-600">
                                {t('home.quick_start.step2_desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {t('home.stats.entities')}
                    </div>
                    <p className="text-gray-600">
                        {t('home.stats.entities_label')}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {t('home.stats.students')}
                    </div>
                    <p className="text-gray-600">
                        {t('home.stats.students_label')}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {t('home.stats.programs')}
                    </div>
                    <p className="text-gray-600">
                        {t('home.stats.programs_label')}
                    </p>
                </div>
            </div>
        </div>
    );
}
