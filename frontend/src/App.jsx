import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CombinedForm from './pages/CombinedForm';
import Users from './pages/Users';
import Teachers from './pages/Teachers';
import Settings from './pages/Settings';

// Simple Toast Provider for the application
export const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = 'default' }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transition-all animate-in slide-in-from-bottom-5 ${t.variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-white text-gray-900'
              }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className={`mt-1 text-sm ${t.variant === 'destructive' ? 'text-red-100' : 'text-gray-500'}`}>
                    {t.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue"><Login /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout title="Create an Account" subtitle="Join our platform today"><Register /></AuthLayout>} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>}
              />
              <Route
                path="/combined"
                element={<ProtectedRoute><DashboardLayout><CombinedForm /></DashboardLayout></ProtectedRoute>}
              />
              <Route
                path="/users"
                element={<ProtectedRoute><DashboardLayout><Users /></DashboardLayout></ProtectedRoute>}
              />
              <Route
                path="/teachers"
                element={<ProtectedRoute><DashboardLayout><Teachers /></DashboardLayout></ProtectedRoute>}
              />
              <Route
                path="/settings"
                element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>}
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
