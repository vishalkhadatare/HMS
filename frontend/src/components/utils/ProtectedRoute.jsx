import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, role }) => {
    const [isValidating, setIsValidating] = useState(true);
    const [authError, setAuthError] = useState(null);

    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    useEffect(() => {
        // Optional: Validate token with backend
        // You can add token validation logic here if needed
        setIsValidating(false);
    }, []);

    // Only redirect if there's NO user data at all (never logged in)
    if (!userStr) {
        if (role === 'admin') {
            // Use toastId to prevent duplicates in StrictMode
            // We need to trigger this as a side effect or ensure it only fires once.
            // Putting it here in render is risky but Navigate unmounts component immediately.
            // Better to rely on useEffect, but we need to return something.
            // Let's rely on the immediate redirect.
            setTimeout(() => toast.error("Unauthorized access", { toastId: 'unauth-error' }), 0);
            return <Navigate to="/" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);

        // Only redirect if user data is completely invalid (never logged in properly)
        if (!user || !user.role) {
            return <Navigate to="/login" replace />;
        }

        // Check if user has the required role
        if (role && user.role !== role) {
            if (role === 'admin') {
                setTimeout(() => toast.error("Unauthorized access", { toastId: 'role-unauth' }), 0);
            }

            // Redirect to appropriate dashboard based on user's actual role
            if (user.role === 'admin') {
                return <Navigate to="/admin" replace />;
            } else if (user.role === 'doctor') {
                return <Navigate to="/doctor/appointments" replace />;
            } else if (user.role === 'patient') {
                return <Navigate to="/patient/appointments" replace />;
            }
            return <Navigate to="/" replace />;
        }

        // Don't redirect on invalid/expired token - let the component handle it
        // The component will show error messages for API failures
        return children;

    } catch (error) {
        console.error("Error parsing user data:", error);
        // Only clear storage if data is completely corrupted
        // Don't redirect - let user stay on page
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        // Show error but don't redirect
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Session Data Error
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Your session data was corrupted. Please log in again to continue.
                        </p>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default ProtectedRoute;