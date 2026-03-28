import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, Filter } from 'lucide-react';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Data Table States
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await api.get('/teachers');
            if (response.data.status) setTeachers(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 1. Filtering (Search)
    const filteredTeachers = useMemo(() => {
        if (!search) return teachers;
        return teachers.filter(t =>
            (t.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (t.last_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (t.university_name || '').toLowerCase().includes(search.toLowerCase())
        );
    }, [teachers, search]);

    // 2. Sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const sortedTeachers = useMemo(() => {
        let sortableItems = [...filteredTeachers];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredTeachers, sortConfig]);

    // 3. Pagination
    const totalPages = Math.ceil(sortedTeachers.length / rowsPerPage);
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * rowsPerPage;
        const lastPageIndex = firstPageIndex + rowsPerPage;
        return sortedTeachers.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, sortedTeachers]);

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
                    <h2 className="text-3xl font-bold tracking-tight">Teachers Directory</h2>
                    <p className="text-gray-500">Comprehensive list of academic staff and their affiliations.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" /> Filter View
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3 border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle>Active Staff Members</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search staff or university..."
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
                                    <TableHead className="w-[100px] cursor-pointer" onClick={() => requestSort('id')}>
                                        <div className="flex items-center">ID <SortIcon columnKey="id" /></div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => requestSort('first_name')}>
                                        <div className="flex items-center">Teacher Profile <SortIcon columnKey="first_name" /></div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => requestSort('university_name')}>
                                        <div className="flex items-center">University <SortIcon columnKey="university_name" /></div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => requestSort('gender')}>
                                        <div className="flex items-center">Gender <SortIcon columnKey="gender" /></div>
                                    </TableHead>
                                    <TableHead className="text-right cursor-pointer" onClick={() => requestSort('year_joined')}>
                                        <div className="flex items-center justify-end">Year Joined <SortIcon columnKey="year_joined" /></div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentTableData.length > 0 ? (
                                    currentTableData.map((t) => (
                                        <TableRow key={t.id}>
                                            <TableCell className="font-medium">#{t.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-50 flex items-center justify-center text-indigo-700 font-bold uppercase shrink-0 text-sm">
                                                        {t.first_name?.charAt(0) || 'T'}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-900 block">{t.first_name} {t.last_name}</span>
                                                        <span className="text-xs text-gray-500 block">{t.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600 font-medium">{t.university_name}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${t.gender === 'Female' ? 'bg-pink-100 text-pink-700' :
                                                        t.gender === 'Male' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {t.gender}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right text-gray-500 font-medium">
                                                {t.year_joined}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Search className="h-8 w-8 text-gray-300 mb-2" />
                                                No teachers found matching your search.
                                            </div>
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
                        Showing <strong>{currentTableData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</strong> to <strong>{Math.min(currentPage * rowsPerPage, sortedTeachers.length)}</strong> of <strong>{sortedTeachers.length}</strong> results
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

export default Teachers;
