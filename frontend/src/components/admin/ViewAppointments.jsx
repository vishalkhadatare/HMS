import React, { useState, useEffect } from 'react';
import { viewAllAppointments } from '../service/api';
import { toast } from 'react-toastify';
import { FaCalendarCheck, FaSync, FaClock } from 'react-icons/fa';

const ViewAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await viewAllAppointments();

            if (response.data) {
                setAppointments(response.data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error(error.response?.data?.message || 'An error occurred while fetching appointments.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <FaCalendarCheck className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Appointment Records</h2>
                        <p className="text-sm text-gray-500">View and manage all hospital appointments</p>
                    </div>
                </div>
                <button
                    onClick={fetchAppointments}
                    className="group bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-sm"
                >
                    <FaSync className={`text-sm ${loading ? 'animate-spin text-blue-500' : 'group-hover:text-blue-500'}`} />
                    <span className="font-medium">Refresh Data</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading appointment data...</p>
                </div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-20">
                    <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCalendarCheck className="text-gray-300 text-3xl" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No Appointments Found</h3>
                    <p className="text-gray-500">There are no appointments scheduled at the moment.</p>
                </div>
            ) : (
                <div className="overflow-x-auto max-h-[440px] overflow-y-auto no-scrollbar">
                    <table className="w-full text-left border-collapse sticky-header">
                        <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm tracking-wide">Patient Details</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm tracking-wide">Doctor Assigned</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm tracking-wide">Schedule Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm tracking-wide">Current Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {appointments.map((appointment) => (
                                <tr key={appointment._id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                                                {appointment.patient?.name?.charAt(0).toUpperCase() || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{appointment.patient?.name || 'Unknown'}</p>
                                                <p className="text-xs text-gray-500">{appointment.patient?.email || 'No Email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                {appointment.doctor?.name?.charAt(0).toUpperCase() || 'D'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">Dr. {appointment.doctor?.name || 'Unassigned'}</p>
                                                <p className="text-xs text-gray-500">{appointment.doctor?.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaClock className="text-gray-400" />
                                            <span className="font-medium">
                                                {appointment.date ? new Date(appointment.date).toLocaleDateString(undefined, {
                                                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                                }) : 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${appointment.status === 'confirmed'
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : appointment.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                : 'bg-red-100 text-red-700 border border-red-200'
                                            }`}>
                                            <span className={`h-2 w-2 rounded-full mr-2 ${appointment.status === 'confirmed' ? 'bg-green-500' :
                                                appointment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}></span>
                                            {appointment.status || 'pending'}
                                        </span>
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

export default ViewAppointments;