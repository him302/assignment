import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Search, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Data Table States
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            if (response.data.status) setUsers(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 1. Filtering (Search)
    const filteredUsers = useMemo(() => {
        if (!search) return users;
        return users.filter(user =>
            user.first_name.toLowerCase().includes(search.toLowerCase()) ||
            user.last_name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    // 2. Sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const sortedUsers = useMemo(() => {
        let sortableItems = [...filteredUsers];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredUsers, sortConfig]);

    // 3. Pagination
    const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * rowsPerPage;
        const lastPageIndex = firstPageIndex + rowsPerPage;
        return sortedUsers.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, sortedUsers]);

    // Reset to page 1 on search
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return <ChevronsUpDown className="ml-1 h-4 w-4 text-gray-300" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp className="ml-1 h-4 w-4 text-indigo-600" />
            : <ChevronDown className="ml-1 h-4 w-4 text-indigo-600" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users Directory</h2>
                    <p className="text-gray-500">Manage your system users, search, sort, and paginate through records.</p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3 border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle>All Users</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search users..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-[100px] cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('id')}>
                                        <div className="flex items-center">ID <SortIcon columnKey="id" /></div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('first_name')}>
                                        <div className="flex items-center">User <SortIcon columnKey="first_name" /></div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('email')}>
                                        <div className="flex items-center">Email <SortIcon columnKey="email" /></div>
                                    </TableHead>
                                    <TableHead className="text-right cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('created_at')}>
                                        <div className="flex items-center justify-end">Joined <SortIcon columnKey="created_at" /></div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentTableData.length > 0 ? (
                                    currentTableData.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">#{user.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold uppercase shrink-0 text-xs">
                                                        {user.first_name?.charAt(0) || 'U'}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{user.first_name} {user.last_name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-500">{user.email}</TableCell>
                                            <TableCell className="text-right text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                            No results found matching "{search}".
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between border-t px-6 py-4">
                    <div className="text-sm text-gray-500">
                        Showing <strong>{currentTableData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</strong> to <strong>{Math.min(currentPage * rowsPerPage, sortedUsers.length)}</strong> of <strong>{sortedUsers.length}</strong> results
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>
                            Next
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Users;
