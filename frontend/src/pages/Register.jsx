import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useToast } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/register', formData);
            if (response.data.status) {
                toast({ title: 'Account created!', description: 'You can now log in with your credentials.' });
                setTimeout(() => navigate('/login'), 1500);
            } else {
                toast({ title: 'Registration Failed', description: response.data.message, variant: 'destructive' });
            }
        } catch (error) {
            const msg = error.response?.data?.messages
                ? Object.values(error.response.data.messages).join(', ')
                : 'Server error occurred';
            toast({ title: 'Registration Error', description: msg, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" name="first_name" required value={formData.first_name} onChange={handleChange} className="bg-white/50" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" name="last_name" required value={formData.last_name} onChange={handleChange} className="bg-white/50" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="bg-white/50" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password" name="password" type={showPassword ? "text" : "password"} required minLength="6"
                        value={formData.password} onChange={handleChange} className="bg-white/50 pr-10"
                    />
                    <button
                        type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                <p className="text-xs text-gray-500">Must be at least 6 characters long.</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <div className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                    Sign in
                </Link>
            </div>
        </form>
    );
};

export default Register;
