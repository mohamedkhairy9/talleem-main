import React from 'react';
import { HiUsers, HiShieldCheck, HiCollection, HiBell } from 'react-icons/hi';

export default function Home() {
    const stats = [
        {
            title: 'Total Roles',
            value: '12',
            icon: HiUsers,
            color: 'bg-primary-500'
        },
        {
            title: 'Permissions',
            value: '48',
            icon: HiShieldCheck,
            color: 'bg-green-500'
        },
        {
            title: 'Resources',
            value: '24',
            icon: HiCollection,
            color: 'bg-purple-500'
        },
        {
            title: 'Notifications',
            value: '8',
            icon: HiBell,
            color: 'bg-orange-500'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to Dashboard
                </h1>
                <p className="text-gray-600">
                    Manage your academic institution's data and operations from
                    here.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <h3 className="font-medium text-gray-900">
                            Add New Role
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Create a new user role
                        </p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <h3 className="font-medium text-gray-900">
                            Manage Permissions
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Configure user permissions
                        </p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <h3 className="font-medium text-gray-900">
                            View Reports
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Check system reports
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
}
