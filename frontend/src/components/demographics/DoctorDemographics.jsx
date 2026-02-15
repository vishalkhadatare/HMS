import React, { useState, useEffect } from 'react';
import { listDoctors, updateDoctorProfile } from '../service/api';
import { toast } from 'react-toastify';

const DoctorDemographics = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        address: '',
        specialization: '',
        experience: ''
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const response = await listDoctors();
            if (response.data) {
                setDoctors(response.data);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (doctor) => {
        setEditingId(doctor._id);
        setEditForm({
            name: doctor.userId?.name || '',
            email: doctor.userId?.email || '',
            address: doctor.address || '',
            specialization: doctor.specialization || '',
            experience: doctor.experience || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({
            name: '',
            email: '',
            address: '',
            specialization: '',
            experience: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (doctorId) => {
        try {
            await updateDoctorProfile(doctorId, editForm);
            toast.success('Doctor profile updated successfully!');
            setEditingId(null);
            fetchDoctors();
        } catch (error) {
            console.error('Error updating doctor:', error);
            toast.error(error.response?.data?.message || 'Failed to update doctor profile');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-blue-600">Doctor Demographics</h2>
                    <p className="text-gray-600 mt-1">Manage doctor information and profiles</p>
                </div>
                <button
                    onClick={fetchDoctors}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Loading doctors...</p>
                </div>
            ) : doctors.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">No doctors found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-blue-50">
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialization</th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Experience</th>
                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor) => (
                                <tr key={doctor._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-3">
                                        {editingId === doctor._id ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <span className="font-medium text-gray-800">Dr. {doctor.userId?.name || 'N/A'}</span>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3">
                                        {editingId === doctor._id ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={editForm.email}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <span className="text-gray-600">{doctor.userId?.email || 'N/A'}</span>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3">
                                        {editingId === doctor._id ? (
                                            <input
                                                type="text"
                                                name="address"
                                                value={editForm.address}
                                                onChange={handleInputChange}
                                                placeholder="Enter address"
                                                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <span className="text-gray-600">{doctor.address || 'Not specified'}</span>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3">
                                        {editingId === doctor._id ? (
                                            <input
                                                type="text"
                                                name="specialization"
                                                value={editForm.specialization}
                                                onChange={handleInputChange}
                                                placeholder="Enter specialization"
                                                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                {doctor.specialization || 'Not specified'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3">
                                        {editingId === doctor._id ? (
                                            <input
                                                type="text"
                                                name="experience"
                                                value={editForm.experience}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 5 years"
                                                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <span className="text-gray-600">{doctor.experience || 'Not specified'}</span>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            {editingId === doctor._id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(doctor._id)}
                                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleEdit(doctor)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && doctors.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                    Total Doctors: {doctors.length}
                </div>
            )}
        </div>
    );
};

export default DoctorDemographics;