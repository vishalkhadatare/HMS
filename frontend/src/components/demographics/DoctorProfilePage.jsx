import React, { useState, useEffect } from 'react';
import { updateDoctorProfileSelf } from '../service/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DoctorProfilePage = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        specialization: '',
        experience: '',
        phone: '',
        address: '',
        availableDays: [],
        availableTimeSlots: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login'); // Should not happen if protected
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e, field) => {
        const val = e.target.value;
        setFormData(prev => ({ ...prev, [field]: val.split(',').map(s => s.trim()) }));
    };

    const handleDayToggle = (day) => {
        setFormData(prev => {
            const days = [...prev.availableDays];
            const index = days.indexOf(day);
            if (index > -1) {
                days.splice(index, 1);
            } else {
                days.push(day);
            }
            return { ...prev, availableDays: days };
        });
    };

    const handleTimeSlotToggle = (slot) => {
        setFormData(prev => {
            const slots = [...prev.availableTimeSlots];
            const index = slots.indexOf(slot);
            if (index > -1) {
                slots.splice(index, 1);
            } else {
                slots.push(slot);
            }
            return { ...prev, availableTimeSlots: slots };
        });
    };

    const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const TIME_SLOTS = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDoctorProfileSelf(formData);
            toast.success("Profile created successfully! You are now visible to patients.");

            navigate('/');
        } catch (error) {
            console.error("Error creating profile", error);
            toast.error("Failed to create profile. Please try again.");
        }
    };

    if (!user) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 px-8 py-6">
                    <h1 className="text-2xl font-bold text-white">Complete Your Professional Profile</h1>
                    <p className="text-blue-100 mt-2">Please provide your details to start accepting appointments.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Read-only User Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                            <div className="text-lg font-semibold text-gray-800">{user.name}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                            <div className="text-lg font-semibold text-gray-800">{user.email}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                            <input
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="e.g. Cardiologist"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (Years)</label>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="e.g. 10"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="e.g. +91 9876543210"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Clinic/Hospital Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="e.g. City Hospital, Kochi"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Available Days</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {DAYS_OF_WEEK.map(day => (
                                    <label key={day} className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.availableDays.includes(day)}
                                            onChange={() => handleDayToggle(day)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Available Time Slots</label>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                                {TIME_SLOTS.map(slot => (
                                    <label key={slot} className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.availableTimeSlots.includes(slot)}
                                            onChange={() => handleTimeSlotToggle(slot)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{slot}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-200 transition-all transform hover:-translate-y-1"
                        >
                            Create Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfilePage;
