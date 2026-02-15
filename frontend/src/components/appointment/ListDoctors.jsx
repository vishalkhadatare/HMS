import React, { useState, useEffect } from 'react';
import { listDoctors } from '../service/api';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaUserMd, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaVideo } from 'react-icons/fa';

function ListDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        filterDoctors();
    }, [searchTerm, selectedSpecialization, doctors]);

    const fetchDoctors = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await listDoctors();
            if (response.data) {
                setDoctors(response.data);
                setFilteredDoctors(response.data);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            // Handle authentication errors without redirecting
            if (error.response?.status === 401 || error.response?.status === 403) {
                setError('Authentication required. Please log in to view doctors.');
            } else if (error.code === 'ERR_NETWORK') {
                setError('Cannot connect to server. Please check if the backend is running.');
            } else {
                setError(error.response?.data?.message || 'Failed to fetch doctors');
            }
        } finally {
            setLoading(false);
        }
    };

    const filterDoctors = () => {
        let filtered = [...doctors];

        // Filter by search term (name or email)
        if (searchTerm) {
            filtered = filtered.filter(doctor =>
                doctor.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by specialization
        if (selectedSpecialization) {
            filtered = filtered.filter(doctor =>
                doctor.specialization?.toLowerCase() === selectedSpecialization.toLowerCase()
            );
        }

        setFilteredDoctors(filtered);
    };

    // Get unique specializations for filter
    const getSpecializations = () => {
        const specializations = doctors
            .map(doctor => doctor.specialization)
            .filter(spec => spec); // Remove null/undefined
        return [...new Set(specializations)]; // Remove duplicates
    };

    const handleBookAppointment = (doctorId) => {
        // Navigate to book appointment page with pre-selected doctor
        navigate(`/book-appointment?doctorId=${doctorId}`);
    };

    return (
        <div className="bg-gray-50 min-h-[85vh] p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Find Your Doctor</h1>
                        <button
                            onClick={fetchDoctors}
                            disabled={loading}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 group"
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
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Connect with our top-rated medical specialists. Browse profiles, check availability, and book your appointment in seconds.
                    </p>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by doctor name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                        />
                    </div>
                    <div className="relative md:w-1/4">
                        <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
                        <select
                            value={selectedSpecialization}
                            onChange={(e) => setSelectedSpecialization(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium text-gray-700 cursor-pointer"
                        >
                            <option value="">All Specializations</option>
                            {getSpecializations().map((spec, index) => (
                                <option key={index} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredDoctors.length === 0 && !error ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUserMd className="text-gray-300 text-4xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Doctors Found</h3>
                        <p className="text-gray-500">
                            We couldn't find any doctors matching your search criteria.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedSpecialization('') }}
                            className="mt-6 text-blue-600 font-semibold hover:text-blue-800"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    /* Doctors Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor._id}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col"
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center text-2xl font-bold shadow-inner">
                                                {doctor.userId?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                                    Dr. {doctor.userId?.name}
                                                </h3>
                                                <p className="text-blue-600 font-medium text-sm">
                                                    {doctor.specialization || 'General Physician'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mt-6">
                                        <div className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            <FaCalendarAlt className="text-blue-400 mt-0.5 shrink-0" />
                                            <div>
                                                <span className="block font-semibold text-gray-700 text-xs uppercase tracking-wide mb-1">Available Days</span>
                                                <span className="leading-snug">
                                                    {doctor.availableDays && doctor.availableDays.length > 0
                                                        ? doctor.availableDays.join(', ')
                                                        : 'No specific days'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            <FaClock className="text-green-500 mt-0.5 shrink-0" />
                                            <div>
                                                <span className="block font-semibold text-gray-700 text-xs uppercase tracking-wide mb-1">Time Slots</span>
                                                <span className="leading-snug">
                                                    {doctor.availableTimeSlots && doctor.availableTimeSlots.length > 0
                                                        ? doctor.availableTimeSlots.join(', ')
                                                        : 'Please contact clinic'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                                    <button
                                        onClick={() => handleBookAppointment(doctor.userId?._id)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95 duration-200"
                                    >
                                        <FaCalendarAlt />
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListDoctors;