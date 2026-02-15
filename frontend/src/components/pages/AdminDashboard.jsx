import React, { useState, useEffect } from 'react';
import AddDoctor from '../admin/AddDoctor';
import ViewDoctors from '../admin/ViewDoctors';
import ViewAppointments from '../admin/ViewAppointments';
import { MdLogout } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import { FaUserAlt, FaUserPlus } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";


const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('dashboard'); // Default to dashboard
    const [stats, setStats] = useState({ totalDoctors: 0, totalAppointments: 0 });
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        // Load admin details from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setAdmin(JSON.parse(storedUser));
        }
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {

            const { getAdminStats } = await import('../service/api'); 
            const response = await getAdminStats();
            if (response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <div className="bg-white p-3 rounded-lg shadow-md mt-3">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Welcome, Admin!</h3>
                        <p className="text-gray-600">Select an option from the sidebar to manage doctors and appointments.</p>
                    </div>
                );
            case 'addDoctor':
                return <AddDoctor />;
            case 'viewAppointments':
                return <ViewAppointments />;
            case 'viewDoctors':
                return <ViewDoctors />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-[89vh] overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-600 text-white flex flex-col">
                {/* Admin Profile Section */}
                <div className="p-6 border-b border-blue-500">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                            {admin?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-1">{admin?.name || 'Admin'}</h3>
                        <p className="text-blue-200 text-sm">{admin?.email || 'admin@healthcare.com'}</p>
                        <span className="inline-block mt-2 bg-blue-500 px-3 py-1 rounded-full text-xs font-medium">
                            Administrator
                        </span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setActiveView('dashboard')}
                                className={`w-full inline-flex items-center gap-2 px-4 py-3 rounded-md transition ${activeView === 'dashboard'
                                    ? 'bg-blue-700 font-semibold'
                                    : 'hover:bg-blue-500'
                                    }`}
                            >
                                <MdDashboardCustomize className="text-lg" />
                                <span>Dashboard</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('addDoctor')}
                                className={`w-full inline-flex items-center gap-2 px-4 py-3 rounded-md transition ${activeView === 'addDoctor'
                                    ? 'bg-blue-700 font-semibold'
                                    : 'hover:bg-blue-500'
                                    }`}
                            >
                                <FaUserPlus className="text-lg" />
                                <span>Add Doctor</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('viewAppointments')}
                                className={`w-full inline-flex items-center gap-2 px-4 py-3 rounded-md transition ${activeView === 'viewAppointments'
                                    ? 'bg-blue-700 font-semibold'
                                    : 'hover:bg-blue-500'
                                    }`}
                            >
                                <FaCalendarCheck className="text-lg" />
                                <span>View Appointments</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('viewDoctors')}
                                className={`w-full inline-flex items-center gap-2 px-4 py-3 rounded-md transition ${activeView === 'viewDoctors'
                                    ? 'bg-blue-700 font-semibold'
                                    : 'hover:bg-blue-500'
                                    }`}
                            >
                                <FaUserAlt className="text-lg" />
                                <span>View Doctors</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* Logout Section */}
                <div className="p-4 border-t border-blue-500">
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            window.location.href = '/';
                        }}
                        className="w-full inline-flex items-center gap-2 px-4 py-3 rounded-md hover:bg-blue-500 transition"
                    >
                        <MdLogout className="text-lg" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-3 overflow-y-auto no-scrollbar">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

                    {/* Stats Grid - Persistent */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase">Total Doctors</p>
                                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalDoctors}</h3>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <span className="text-2xl"><FaUserAlt /></span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase">Total Appointments</p>
                                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalAppointments}</h3>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <span className="text-2xl"><FaCalendarCheck /></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Content */}
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;