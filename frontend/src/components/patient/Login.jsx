import { useState } from "react";
import { userLogin } from "../service/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ onClose, onSwitchToRegister, onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loginData = { email, password };
            const response = await userLogin(loginData);

            // Check if login was successful
            if (response && response.data) {
                const { token, user, role, name, isProfileCompleted } = response.data;

                // Store token
                if (token) {
                    localStorage.setItem("token", token);
                }

                // Store user data
                const userData = user || { email, name, role };
                localStorage.setItem("user", JSON.stringify(userData));

                toast.success("Login successful!");

                // Callback to refresh user state in parent component
                if (onLoginSuccess) {
                    onLoginSuccess();
                }

                // Redirect based on role and profile completion
                if (role === 'doctor' && isProfileCompleted === false) {
                    navigate('/doctor/profile');
                } else {
                    if (!onLoginSuccess) {
                        navigate('/');
                    }
                }

                // Close modal
                if (onClose) {
                    onClose();
                }
            } else {
                // Handle case where response doesn't have expected structure
                toast.error("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);

            // Handle different error types
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const errorMessage = error.response.data?.message || "Login failed";
                toast.error(errorMessage);
            } else if (error.request) {
                // The request was made but no response was received
                toast.error("Network error. Please check your connection.");
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error("An error occurred. Please try again.");
            }
        }
    };

    const handleSwitchToRegister = () => {
        if (onSwitchToRegister) {
            onSwitchToRegister();
        } else {
            navigate('/register');
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                Login
            </h2>
            <form className="space-y-5" onSubmit={handleLogin}>
                {/* Email */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                {/* Password */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
                >
                    Login
                </button>
            </form>
            <p className="text-center text-gray-600 mt-6">
                Don't have an account?{" "}
                <span
                    className="text-blue-600 font-medium cursor-pointer hover:underline"
                    onClick={handleSwitchToRegister}
                >
                    Sign Up
                </span>
            </p>
        </div>
    );
};

export default Login;