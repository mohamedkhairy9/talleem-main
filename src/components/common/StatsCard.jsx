import React from 'react';

export default function StatsCard({ title, value, subtitle, Icon }) {
    return (
        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow hover:shadow-lg transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            {title}
                        </p>
                        <div className="flex items-baseline space-x-2 mt-2">
                            <p className="text-3xl font-bold text-gray-900">
                                {value}
                            </p>
                            {subtitle && (
                                <span className="text-sm text-gray-500">
                                    {subtitle}
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        className={`p-3 rounded-xl shadow-lg bg-gradient-to-br from-emerald-400 to-emerald-600`}
                    >
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
