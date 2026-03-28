import React, { useState } from 'react';
import api from '../api';
import { useToast } from '../App';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Database, Loader2, Save } from 'lucide-react';

const CombinedForm = () => {
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', password: '',
        university_name: '', gender: 'Male', year_joined: new Date().getFullYear().toString()
    });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/teacher/combined-insert', formData);
            if (response.data.status) {
                toast({ title: 'Success', description: 'User and Teacher records inserted simultaneously.' });
                setFormData({
                    first_name: '', last_name: '', email: '', password: '',
                    university_name: '', gender: 'Male', year_joined: new Date().getFullYear().toString()
                });
            } else {
                toast({ title: 'Insertion Failed', description: response.data.message, variant: 'destructive' });
            }
        } catch (error) {
            const msg = error.response?.data?.messages
                ? Object.values(error.response.data.messages).join(', ')
                : 'Server error occurred during execution';
            toast({ title: 'Transaction Error', description: msg, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                        <Database className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Combined Data Entry</h2>
                        <p className="text-gray-500">Atomic database transaction for creating a User and extending Teacher profile.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* User Information Card */}
                    <Card className="border-t-4 border-t-indigo-500">
                        <CardHeader>
                            <CardTitle>User Account Specifications</CardTitle>
                            <CardDescription>Authentication and core identity credentials.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input id="first_name" name="first_name" required value={formData.first_name} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input id="last_name" name="last_name" required value={formData.last_name} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Secure Password</Label>
                                <Input id="password" name="password" type="password" required minLength="6" value={formData.password} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Teacher Profile Card */}
                    <Card className="border-t-4 border-t-purple-500">
                        <CardHeader>
                            <CardTitle>Teacher Specialization</CardTitle>
                            <CardDescription>Academic assignment and historical data.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="university_name">Associated University</Label>
                                <Input id="university_name" name="university_name" required value={formData.university_name} onChange={handleChange} placeholder="e.g. Stanford University" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender Identification</Label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year_joined">Year Joined</Label>
                                    <Input id="year_joined" name="year_joined" type="number" required min="1900" max="2100" value={formData.year_joined} onChange={handleChange} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                <div className="mt-6 flex justify-end">
                    <Button type="submit" size="lg" disabled={isLoading} className="gap-2 shadow-lg">
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        {isLoading ? 'Executing Transaction...' : 'Submit Transaction'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CombinedForm;
