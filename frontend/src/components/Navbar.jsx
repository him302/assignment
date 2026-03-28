import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Users, GraduationCap, LayoutDashboard, Database } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Combined Form', path: '/combined', icon: Database },
        { name: 'Users', path: '/users', icon: Users },
        { name: 'Teachers', path: '/teachers', icon: GraduationCap },
    ];

    return (
        <nav className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <GraduationCap className="h-8 w-8 text-indigo-200" />
                            <span className="font-bold text-xl tracking-tight">EduMgt</span>
                        </Link>

                        {user && (
                            <div className="hidden md:block ml-10">
                                <div className="flex items-baseline space-x-4">
                                    {navLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <Link
                                                key={link.name}
                                                to={link.path}
                                                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                                                        ? 'bg-indigo-700 text-white'
                                                        : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {link.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-medium leading-none whitespace-nowrap">{user.first_name} {user.last_name}</span>
                                        <span className="text-xs text-indigo-200 mt-1">{user.email}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <Link
                                        to="/login"
                                        className="text-indigo-100 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-white text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
