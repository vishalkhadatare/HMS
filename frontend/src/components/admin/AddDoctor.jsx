import React, { useState } from 'react';
import { addDoctor } from '../service/api';
import { toast } from 'react-toastify';
import { FaUserMd, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const AddDoctor = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            const response = await addDoctor(formData);

            if (response.data) {
                toast.success('Doctor added successfully!');
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    password: ''
                });
            }
        } catch (error) {
            console.error('Error adding doctor:', error);
            toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[62vh] border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                    <FaUserPlus className="text-white text-xl" />
                </div>
                <h2 className="text-xl font-bold text-white">Add New Doctor</h2>
            </div>

            <form onSubmit={handleAddDoctor} className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUserMd className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                                placeholder="Dr. John Doe"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                                placeholder="doctor@hospital.com"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                                placeholder="••••••••"
                                minLength="6"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-semibold flex items-center justify-center gap-2"
                    >
                        <FaUserPlus />
                        <span>Add Doctor to System</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddDoctor;