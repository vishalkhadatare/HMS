import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Register = ({ onClose, onSwitchToLogin }) => {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Registration successful!");
                // Switch to login modal or navigate to login page
                if (onSwitchToLogin) {
                    onSwitchToLogin();
                } else {
                    navigate('/login');
                }
            } else {
                toast.error(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleSwitchToLogin = () => {
        if (onSwitchToLogin) {
            onSwitchToLogin();
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                Create Account
            </h2>

            <form className="space-y-5" onSubmit={handleRegister}>
                {/* Name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Email
                    </label>
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
                    <label className="block text-gray-700 font-medium mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Register Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
                >
                    Sign Up
                </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 mt-6">
                Already have an account?{" "}
                <span
                    className="text-blue-600 font-medium cursor-pointer hover:underline"
                    onClick={handleSwitchToLogin}
                >
                    Login
                </span>
            </p>
        </div>
    );
};

export default Register;