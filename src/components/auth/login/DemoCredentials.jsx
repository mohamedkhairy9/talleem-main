import React from 'react';

export default function DemoCredentials() {
    return (
        <div className="p-4 bg-indigo-100 border text-sm border-indigo-300 rounded-lg mb-8">
            <p className="font-semibold mb-2 text-indigo-800 uppercase">
                Demo Credentials
            </p>
            <p className="">
                <span className="font-semibold text-indigo-700">National ID : </span>
                <span className="font-medium text-indigo-600">
                    Use your assigned ID
                </span>
            </p>
            <p className="">
                <span className="font-semibold text-indigo-700">
                    Password :{' '}
                </span>
                <span className="font-medium text-indigo-600">super123456</span>
            </p>
        </div>
    );
}
