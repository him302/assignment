import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Save, User, Moon, Sun, Monitor } from 'lucide-react';

const Settings = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
    });

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        toast({ title: 'Theme Updated', description: `Your appearance has been set to ${newTheme}.` });
    };

    const handleProfileSave = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Mimic an API call
        setTimeout(() => {
            toast({ title: 'Profile Updated', description: 'Your personal information has been saved successfully.' });
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-gray-500">Manage your account settings and set system preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Navigation Sidebar */}
                <nav className="flex md:flex-col gap-2 md:w-48 overflow-x-auto pb-2 md:pb-0 shrink-0">
                    <Button
                        variant={activeTab === 'profile' ? 'default' : 'ghost'}
                        className={`justify-start ${activeTab !== 'profile' && 'text-gray-600'}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile Attributes
                    </Button>
                    <Button
                        variant={activeTab === 'appearance' ? 'default' : 'ghost'}
                        className={`justify-start ${activeTab !== 'appearance' && 'text-gray-600'}`}
                        onClick={() => setActiveTab('appearance')}
                    >
                        Appearance
                    </Button>
                    <Button
                        variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                        className={`justify-start ${activeTab !== 'notifications' && 'text-gray-600'}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        Notifications
                    </Button>
                </nav>

                {/* Content Area */}
                <div className="flex-1 w-full space-y-6">
                    {activeTab === 'profile' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details. These changes will reflect across all directories.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileSave} className="space-y-6">
                                    <div className="flex items-center gap-6 pb-6 border-b">
                                        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl uppercase shadow-inner">
                                            {formData.first_name.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <Button type="button" variant="outline" size="sm" className="mb-2">Change Avatar</Button>
                                            <p className="text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">First Name</Label>
                                            <Input id="first_name" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">Last Name</Label>
                                            <Input id="last_name" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={isLoading} className="gap-2">
                                            <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save Preferences'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'appearance' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance</CardTitle>
                                <CardDescription>Customize the look and feel of your dashboard interface.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    <div
                                        onClick={() => handleThemeChange('light')}
                                        className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300'}`}
                                    >
                                        <Sun className={`w-8 h-8 ${theme === 'light' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                        <span className="font-medium">Light</span>
                                    </div>

                                    <div
                                        onClick={() => handleThemeChange('dark')}
                                        className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300'}`}
                                    >
                                        <Moon className={`w-8 h-8 ${theme === 'dark' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                        <span className="font-medium">Dark Mode (Beta)</span>
                                    </div>

                                    <div
                                        onClick={() => handleThemeChange('system')}
                                        className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300'}`}
                                    >
                                        <Monitor className={`w-8 h-8 ${theme === 'system' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                        <span className="font-medium">System Default</span>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'notifications' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>Decide what alerts you receive and how you receive them.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                    <div>
                                        <p className="font-medium text-gray-900">New User Registrations</p>
                                        <p className="text-sm text-gray-500">Receive alerts when a user signs up.</p>
                                    </div>
                                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input type="checkbox" name="toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-indigo-500 checked:right-0 checked:border-indigo-600" />
                                        <label className="toggle-label block overflow-hidden h-6 rounded-full bg-indigo-500 cursor-pointer"></label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                    <div>
                                        <p className="font-medium text-gray-900">System Errors</p>
                                        <p className="text-sm text-gray-500">Critical system warnings and failovers.</p>
                                    </div>
                                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input type="checkbox" name="toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-indigo-500 checked:right-0 checked:border-indigo-600" />
                                        <label className="toggle-label block overflow-hidden h-6 rounded-full bg-indigo-500 cursor-pointer"></label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium text-gray-900">Marketing Emails</p>
                                        <p className="text-sm text-gray-500">Promotional content and platform updates.</p>
                                    </div>
                                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input type="checkbox" name="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0" />
                                        <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
