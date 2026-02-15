import React, { useState, useEffect } from 'react';
import { viewPatientAppointments, viewDoctorAppointments, updateStatus, cancelAppointment } from '../service/api';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaUserMd, FaUser, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const ListAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'cancelled'

    useEffect(() => {
        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchAppointments();
        }
    }, [user]);

    const fetchAppointments = async () => {
        setLoading(true);
        console.log("Fetching appointments for user role:", user?.role);
        try {
            let response;
            if (user.role === 'patient') {
                response = await viewPatientAppointments();
                setAppointments(response.data.listAppointment || []);
            } else if (user.role === 'doctor') {
                response = await viewDoctorAppointments();
                setAppointments(response.data.appointments || []);
                console.log("Doctor appointments fetched:", response.data.appointments);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await updateStatus({ appointmentId, status: newStatus });
            toast.success('Status updated successfully!');
            fetchAppointments(); // Refresh the list
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            await cancelAppointment({ appointmentId });
            toast.success('Appointment cancelled successfully!');
            fetchAppointments(); // Refresh the list
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        }
    };

    // Sort appointments: Date ascending, then Time ascending
    const sortedAppointments = [...appointments].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
        }
        return a.time.localeCompare(b.time);
    });

    // Filter appointments based on active tab
    const filteredAppointments = sortedAppointments.filter(appointment => {
        const status = appointment.status?.toLowerCase();
        if (activeFilter === 'all') return true;
        if (activeFilter === 'active') return status === 'pending' || status === 'accepted';
        if (activeFilter === 'cancelled') return status === 'cancelled';
        return true;
    });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'completed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
            case 'completed':
                return <FaCheckCircle className="text-green-600" />;
            case 'cancelled':
                return <FaTimesCircle className="text-red-600" />;
            case 'pending':
                return <FaHourglassHalf className="text-yellow-600" />;
            default:
                return <FaHourglassHalf className="text-gray-600" />;
        }
    };

    if (!user) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600">Loading user information...</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">My Appointments</h2>
                            <p className="text-gray-600 mt-2">
                                {user.role === 'patient' ? 'Manage your healthcare appointments' : 'View and manage patient appointments'}
                            </p>
                        </div>
                        <button
                            onClick={fetchAppointments}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-md font-semibold"
                        >
                            Refresh
                        </button>
                    </div>

                    {/* Filter Tabs (Only for patients) */}
                    {user.role === 'patient' && (
                        <div className="flex gap-2 mb-8 border-b border-gray-200">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`px-6 py-3 font-semibold transition-all ${activeFilter === 'all'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'
                                    }`}
                            >
                                All Appointments
                            </button>
                            <button
                                onClick={() => setActiveFilter('cancelled')}
                                className={`px-6 py-3 font-semibold transition-all ${activeFilter === 'cancelled'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'
                                    }`}
                            >
                                Cancelled
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading appointments...</p>
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4"></div>
                            <p className="text-gray-600 text-lg">No appointments found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAppointments.map((appointment) => (
                                <div
                                    key={appointment._id}
                                    className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    {/* Header with Name and Status */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                                                <span className="text-white font-bold text-lg">
                                                    {user.role === 'patient'
                                                        ? (appointment.doctor?.name?.charAt(0).toUpperCase() || 'D')
                                                        : (appointment.patient?.name?.charAt(0).toUpperCase() || 'P')
                                                    }
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {user.role === 'patient'
                                                        ? `Dr. ${appointment.doctor?.name || 'N/A'}`
                                                        : appointment.patient?.name || 'N/A'
                                                    }
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {user.role === 'patient'
                                                        ? appointment.doctor?.email || 'N/A'
                                                        : appointment.patient?.email || 'N/A'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mb-4">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(appointment.status)}`}>
                                            {getStatusIcon(appointment.status)}
                                            {appointment.status || 'Pending'}
                                        </div>
                                    </div>

                                    {/* Date and Time Info */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <FaCalendarAlt className="text-blue-600" />
                                            <span className="font-medium">{appointment.date || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <FaClock className="text-blue-600" />
                                            <span className="font-medium">{appointment.time || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {user.role === 'doctor' && appointment.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment._id, 'Accepted')}
                                                    className="w-full bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition font-semibold shadow-md"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment._id, 'Cancelled')}
                                                    className="w-full bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition font-semibold shadow-md"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}

                                        {user.role === 'doctor' && appointment.status === 'Accepted' && (
                                            <button
                                                onClick={() => handleStatusUpdate(appointment._id, 'Completed')}
                                                className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
                                            >
                                                Mark Complete
                                            </button>
                                        )}

                                        {user.role === 'patient' && appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                                            <button
                                                onClick={() => handleCancelAppointment(appointment._id)}
                                                className="w-full bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition font-semibold shadow-md"
                                            >
                                                Cancel Appointment
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListAppointments;