import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import SideBar from './SideBar';

export default function Layout() {
    return (
        <div className="bg-gray-100">
            <div className="flex-1 flex">
                <SideBar />
                <div className="w-full flex flex-col min-h-screen overflow-hidden">
                    <Navbar />

                    <main className="p-4 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
