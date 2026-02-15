import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import MainLayout from './components/layout/MainLayout'
import Home from './components/pages/Home.jsx'
import AdminDashboard from './components/pages/AdminDashboard'
import DoctorDemographics from './components/demographics/DoctorDemographics'
import ListAppointments from './components/appointment/ListAppointments'
import Login from './components/patient/Login'
import Register from './components/patient/Register'
import { AuthRoute } from './components/utils/AuthRoute.jsx'
import ProtectedRoute from './components/utils/ProtectedRoute.jsx'
import ListDoctors from './components/appointment/ListDoctors.jsx'
import BookAppointment from './components/pages/BookAppointment.jsx'
import DoctorProfilePage from './components/demographics/DoctorProfilePage.jsx'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/doctors" element={
              <ProtectedRoute role="admin">
                <DoctorDemographics />
              </ProtectedRoute>
            } />


            {/* Patient Routes */}
            <Route path="/book-appointment" element={
              <AuthRoute>
                <ProtectedRoute role="patient">
                  <BookAppointment />
                </ProtectedRoute>
              </AuthRoute>
            } />
            <Route path="/patient/appointments" element={
              <AuthRoute>
                <ProtectedRoute role="patient">
                  <ListAppointments />
                </ProtectedRoute>
              </AuthRoute>
            } />

            {/* Doctor Routes */}
            <Route path="/doctor/appointments" element={
              <AuthRoute>
                <ProtectedRoute role="doctor">
                  <ListAppointments />
                </ProtectedRoute>
              </AuthRoute>
            } />
            <Route path="/doctor/profile" element={
              <AuthRoute>
                <ProtectedRoute role="doctor">
                  <DoctorProfilePage />
                </ProtectedRoute>
              </AuthRoute>
            } />

            {/* Generic appointment route (redirects based on role) */}
            <Route path="/appointments" element={
              <AuthRoute>
                <ListAppointments />
              </AuthRoute>
            } />

            <Route path="/listDoctors" element={
              <AuthRoute>
                <ListDoctors />
              </AuthRoute>
            } />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App