import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Users, GraduationCap, Activity, TrendingUp, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#4f46e5', '#ec4899', '#f59e0b', '#10b981'];

const Dashboard = () => {
    const [stats, setStats] = useState({ users: 0, teachers: 0, recentUsers: [] });
    const [chartData, setChartData] = useState({ gender: [], year: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, teachersRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/teachers')
                ]);

                const users = usersRes.data.data || [];
                const teachers = teachersRes.data.data || [];

                // Calculate Stats
                setStats({
                    users: users.length,
                    teachers: teachers.length,
                    recentUsers: users.slice(-5).reverse(), // Last 5 users
                });

                // Graph 1: Gender Distribution
                const genderCount = teachers.reduce((acc, t) => {
                    acc[t.gender] = (acc[t.gender] || 0) + 1;
                    return acc;
                }, {});
                const genderData = Object.keys(genderCount).map(k => ({ name: k, value: genderCount[k] }));

                // Graph 2: Year Joined Distribution
                const yearCount = teachers.reduce((acc, t) => {
                    acc[t.year_joined] = (acc[t.year_joined] || 0) + 1;
                    return acc;
                }, {});
                const yearData = Object.keys(yearCount).map(k => ({ year: k, count: yearCount[k] })).sort((a, b) => a.year - b.year);

                setChartData({ gender: genderData, year: yearData });
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                <p className="text-gray-500">Your institution's key metrics at a glance.</p>
            </div>

            {/* METRIC CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.users}</div>
                        <p className="text-xs text-gray-500">+20% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.teachers}</div>
                        <p className="text-xs text-gray-500">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">System Activity</CardTitle>
                        <Activity className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">High</div>
                        <p className="text-xs text-gray-500">894 API requests today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+18.2%</div>
                        <p className="text-xs text-emerald-500 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Excelling
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* CHARTS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Teachers by Year Joined</CardTitle>
                        <CardDescription>Bar chart representing recruitment density over time.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData.year}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Gender Distribution</CardTitle>
                        <CardDescription>Diversity metrics among faculty members.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center pb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Pie
                                        data={chartData.gender}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.gender.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RECENT USERS TABLE */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Registrations</CardTitle>
                    <CardDescription>The 5 most recent users to join the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.recentUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase shrink-0">
                                        {user.first_name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{user.first_name} {user.last_name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                        {stats.recentUsers.length === 0 && (
                            <p className="text-sm text-center text-gray-500 py-4">No recent users found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default Dashboard;
