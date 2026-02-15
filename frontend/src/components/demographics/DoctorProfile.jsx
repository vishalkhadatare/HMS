import React, { useState, useEffect } from 'react';
import { getDoctorProfile, updateDoctorProfileSelf } from '../service/api';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        specialization: '',
        experience: '',
        phone: '',
        address: '',
        availableDays: [],
        availableTimeSlots: []
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await getDoctorProfile();
            if (response.data) {
                const doc = response.data;
                setFormData({
                    specialization: doc.specialization || '',
                    experience: doc.experience || '',
                    phone: doc.phone || '',
                    address: doc.address || '',
                    availableDays: doc.availableDays || [],
                    availableTimeSlots: doc.availableTimeSlots || []
                });
            }
        } catch (error) {
            console.error("Error loading profile", error);
            // If 404, it might mean profile not created yet, just show empty form
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e, field) => {
        // Simple comma separated for now
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
            toast.success("Profile updated successfully");
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            console.error("Error updating profile", error);
            toast.error("Failed to update profile");
        }
    };

    if (loading) return <div>Loading Profile...</div>;

    return (
        <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-600">My Professional Profile</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Specialization</label>
                            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                            <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="number" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Clinic/Hospital Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
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
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Changes</button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">Specialization</p>
                        <p className="font-medium text-lg">{formData.specialization || 'Not Set'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-medium text-lg">{formData.experience ? `${formData.experience} Years` : 'Not Set'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-lg">{formData.phone || 'Not Set'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-lg">{formData.address || 'Not Set'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Available Days</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {formData.availableDays.length > 0 ? formData.availableDays.map(d => (
                                <span key={d} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{d}</span>
                            )) : 'None'}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Available Time Slots</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {formData.availableTimeSlots.length > 0 ? formData.availableTimeSlots.map(t => (
                                <span key={t} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{t}</span>
                            )) : 'None'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorProfile;
