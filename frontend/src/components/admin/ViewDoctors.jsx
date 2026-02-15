import React, { useState, useEffect } from 'react';
import { listDoctors, deleteDoctor } from '../service/api';
import { toast } from 'react-toastify';
import { FaTrash, FaEnvelope, FaBriefcase, FaUserMd, FaStethoscope } from 'react-icons/fa';

const ViewDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDoctors();

        // Refetch when page becomes visible (browser tab becomes active)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchDoctors();
            }
        };

        // Refetch when window regains focus
        const handleFocus = () => {
            fetchDoctors();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const response = await listDoctors();
            setDoctors(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch doctors');
            setLoading(false);
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
            try {
                await deleteDoctor(id);
                // Remove from local state
                setDoctors(doctors.filter(doc => doc._id !== id));
                toast.success('Doctor deleted successfully');
            } catch (err) {
                console.error("Error deleting doctor:", err);
                toast.error('Failed to delete doctor');
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <FaUserMd className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Registered Doctors</h2>
                        <p className="text-sm text-gray-500">Manage hospital doctors and their profiles</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchDoctors}
                        disabled={loading}
                        className="p-2 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 group"
                        title="Refresh doctors list"
                    >
                        <svg
                            className={`w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors ${loading ? 'animate-spin' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{doctors.length} Doctors</span>
                </div>
            </div>

            {doctors.length === 0 ? (
                <div className="text-center py-12">
                    <FaUserMd className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">No doctors registered yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto no-scrollbar">
                    <table className="w-full text-left border-collapse sticky-header">
                        <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm tracking-wide">Doctor Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm tracking-wide">Specialization</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm tracking-wide">Contact Email</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm tracking-wide">Experience</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm tracking-wide text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {doctors.map((doctor) => (
                                <tr key={doctor._id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                                                {doctor.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <p className="font-semibold text-gray-800">{doctor.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaStethoscope className="text-blue-400" />
                                            <span>{doctor.specialization || 'Not specified'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaEnvelope className="text-gray-400" />
                                            <span>{doctor.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaBriefcase className="text-gray-400" />
                                            <span>{doctor.experience ? `${doctor.experience} years` : 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDelete(doctor._id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                                            title="Delete Doctor"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewDoctors;
