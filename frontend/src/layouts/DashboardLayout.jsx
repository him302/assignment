import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, GraduationCap, Database,
    LogOut, Settings as SettingsIcon, Menu, X, Bell, Layout
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';

// Mock Notifications
const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'New User Registered', desc: 'Alice Freeman just joined the platform.', time: '2 mins ago', unread: true },
    { id: 2, title: 'Teacher Profile Added', desc: 'Bob uploaded Stanford credentials.', time: '1 hour ago', unread: true },
    { id: 3, title: 'System Update', desc: 'Version 2.4.1 deployed successfully.', time: 'Yesterday', unread: false },
];

const DashboardLayout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Dropdown States
    const [showNotifications, setShowNotifications] = useState(false);
    const notifyRef = useRef(null);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Analytics', path: '/combined', icon: Database },
        { name: 'Users', path: '/users', icon: Users },
        { name: 'Teachers', path: '/teachers', icon: GraduationCap },
        { name: 'Settings', path: '/settings', icon: SettingsIcon },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Click outside listener for dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifyRef.current && !notifyRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const SidebarContent = () => (
        <>
            <div className="h-16 flex items-center px-6 font-bold text-xl tracking-tight text-indigo-600 border-b border-gray-100">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                    <GraduationCap className="h-5 w-5 text-white" />
                </div>
                SaaSAdmin
            </div>
            <div className="px-4 py-6 space-y-1 overflow-y-auto flex-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group",
                                isActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500")} />
                            {item.name}
                        </Link>
                    );
                })}
            </div>
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-md bg-gray-50/50">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase shrink-0 ring-2 ring-white shadow-sm">
                        {user?.first_name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="truncate font-semibold text-gray-900">{user?.first_name} {user?.last_name}</p>
                        <p className="truncate text-xs text-gray-500">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="mt-3 flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Log out
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200 z-10 transition-transform shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:pl-64 min-h-screen transition-all">
                {/* Top Navbar */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700 p-1"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
                            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">

                        {/* Functional Notification Dropdown */}
                        <div className="relative" ref={notifyRef}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("text-gray-500 hover:bg-gray-100", showNotifications && "bg-gray-100")}
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                            </Button>

                            {/* Dropdown Panel */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 origin-top-right z-50">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                        <span className="font-semibold text-gray-900">Notifications</span>
                                        <span className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline">Mark all as read</span>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {MOCK_NOTIFICATIONS.map(notif => (
                                            <div key={notif.id} className={cn("px-4 py-3 border-b border-gray-50 block hover:bg-gray-50 transition cursor-pointer", notif.unread && "bg-indigo-50/30")}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                                    {notif.unread && <span className="h-2 w-2 bg-indigo-600 rounded-full mt-1.5 shrink-0"></span>}
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2">{notif.desc}</p>
                                                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-2 border-t border-gray-50 bg-gray-50/50 text-center">
                                        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View all activity</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Functional Settings Navigate */}
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100" onClick={() => navigate('/settings')}>
                            <SettingsIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <aside className="relative w-64 max-w-sm flex flex-col bg-white h-full animate-in slide-in-from-left duration-300 shadow-2xl">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-100 p-1 rounded-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <SidebarContent />
                    </aside>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
