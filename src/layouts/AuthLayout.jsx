import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 ">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center mb-6">
                    {/* Placeholder for Logo - Replace with actual Image if available */}
                    <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight hover:text-acento-primario 
                                    transition-colors duration-300 ease-in-initial">PetCare</h1>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
