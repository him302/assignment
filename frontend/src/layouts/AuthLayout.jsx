import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* SaaS Dashboard inspired abstract background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-100 to-purple-50 blur-3xl opacity-50 transform rotate-12" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-50 to-indigo-100 blur-3xl opacity-50" />
            </div>

            <div className="relative w-full max-w-md space-y-8 glass-panel p-8 sm:p-10 rounded-2xl shadow-xl border border-white/60 z-10">
                <div>
                    <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-2 text-center text-sm text-gray-600">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
