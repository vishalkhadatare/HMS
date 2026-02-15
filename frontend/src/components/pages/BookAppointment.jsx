import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { listDoctors, bookAppointment } from '../service/api';
import { toast } from 'react-toastify';
import background from '../../assets/background.jpg';

const BookAppointment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [formData, setFormData] = useState({
        patientName: '',
        doctorId: '',
        date: '',
        time: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Load user name
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setFormData(prev => ({ ...prev, patientName: user.name }));
        } else {
            navigate('/login');
        }

        // Fetch doctors
        fetchDoctors();
    }, [navigate]);

    // Handle query param for pre-selection
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const preSelectedDoctorId = searchParams.get('doctorId');
        if (preSelectedDoctorId && doctors.length > 0) {
            const doctor = doctors.find(d => d.userId?._id === preSelectedDoctorId || d._id === preSelectedDoctorId);
            if (doctor) {
                setFormData(prev => ({ ...prev, doctorId: doctor.userId?._id }));
                setSelectedDoctor(doctor);
            }
        }
    }, [doctors, location.search]);

    const fetchDoctors = async () => {
        try {
            const response = await listDoctors();
            setDoctors(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Failed to load doctors", err);
            setError("Failed to load doctors list");
        }
    };

    const handleDoctorChange = (e) => {
        const doctorId = e.target.value;
        setFormData({ ...formData, doctorId: doctorId, date: '', time: '' });

        const doctor = doctors.find(d => d.userId?._id === doctorId);
        setSelectedDoctor(doctor || null);
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        if (!selectedDoctor) return;

        const dateObj = new Date(selectedDate);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        if (selectedDoctor.availableDays && !selectedDoctor.availableDays.includes(dayName)) {
            toast.warning(`Doctor is only available on: ${selectedDoctor.availableDays.join(', ')}`);
            setFormData({ ...formData, date: '' });
        } else {
            setFormData({ ...formData, date: selectedDate });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await bookAppointment({
                doctorId: formData.doctorId,
                date: formData.date,
                time: formData.time
            });
            toast.success("Appointment booked successfully!");
            navigate('/patient/appointments');
        } catch (err) {
            setError(err.response?.data?.message || "Failed to book appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={background}
                    alt="Medical Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div> {/* Overlay for better text contrast */}
            </div>

            {/* Form Container */}
            <div className="max-w-4xl w-full space-y-8 bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl relative z-10 border border-white/20">
                <div>
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Book Appointment</h2>
                    <p className="text-center text-gray-600 text-sm">Schedule your visit with our specialists</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
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

                <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Patient & Doctor */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Name</label>
                                <input
                                    type="text"
                                    value={formData.patientName}
                                    disabled
                                    className="block w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl shadow-sm focus:outline-none text-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Doctor</label>
                                <select
                                    name="doctorId"
                                    value={formData.doctorId}
                                    onChange={handleDoctorChange}
                                    required
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                >
                                    <option value="">-- Choose a Doctor --</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor._id} value={doctor.userId?._id}>
                                            {doctor.name} - {doctor.specialization}
                                        </option>
                                    ))}
                                </select>
                                {selectedDoctor && (
                                    <div className="mt-3 text-sm text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <p className="mb-1"><strong>Available Days:</strong> {selectedDoctor.availableDays?.join(', ') || 'Not specified'}</p>
                                        <p><strong>Time Slots:</strong> {selectedDoctor.availableTimeSlots?.join(', ') || 'Not specified'}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Date & Time */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleDateChange}
                                    required
                                    disabled={!selectedDoctor}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${!selectedDoctor ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                />
                                {!selectedDoctor && <p className="text-xs text-gray-500 mt-1 italic">Please select a doctor first.</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Time</label>
                                <select
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    disabled={!selectedDoctor}
                                    className={`block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${!selectedDoctor ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                >
                                    <option value="">-- Select Time Slot --</option>
                                    {selectedDoctor?.availableTimeSlots?.map((slot, index) => (
                                        <option key={index} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-[1.02] active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Confirming...' : 'Confirm Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
