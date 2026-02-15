import React, { useState, useEffect } from "react";
import Login from "../patient/Login";
import Register from "../patient/Register";
import { useNavigate, useLocation } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { FaCalendarCheck } from "react-icons/fa6";
import { MdDashboardCustomize } from "react-icons/md";
import DoctorProfile from "../demographics/DoctorProfile";
import { FaUserAlt } from "react-icons/fa";


const Navbar = () => {
  const [modal, setModal] = useState(null);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadUserFromStorage();

    // Add scroll listener for sticky navbar effect
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const loadUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user:", error);
      localStorage.removeItem("user");
    }
  };

  const closeModal = () => {
    setModal(null);
    setShowDropdown(false);
   
    if (modal === "profile") {
      loadUserFromStorage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  const handleLoginSuccess = () => {
    loadUserFromStorage();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white shadow-sm py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-blue-200 shadow-lg group-hover:scale-105 transition-transform">
                H+
              </div>
              <span className="text-2xl font-bold text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors">
                HealthCare<span className="text-blue-600">+</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              
              {(!user || user.role !== 'doctor') && (
                <>
                  <button
                    onClick={() => {
                      if (user) navigate("/listDoctors");
                      else setModal("login");
                    }}
                    className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
                  >
                    Find Doctor
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </button>

                
                  <button
                    onClick={() => {
                      if (user) navigate("/book-appointment");
                      else setModal("login");
                    }}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Book Appointment
                  </button>
                </>
              )}
            </div>

            {/* Auth Buttons  */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="relative profile-dropdown-container">
                  <div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-bold text-gray-700 leading-none">{user.name?.split(' ')[0]}</p>
                      <p className="text-xs text-blue-500 font-medium uppercase mt-0.5">{user.role}</p>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute top-14 right-0 bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-56 z-50 animate-fade-in-down origin-top-right">
                      <div className="px-4 py-3 border-b border-gray-100 mb-2">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      {/* Admin Menu */}
                      {user.role === "admin" && (
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            navigate("/admin");
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                        >
                          <span><MdDashboardCustomize /></span> Dashboard
                        </button>
                      )}

                      {/* Doctor Menu */}
                      {user.role === "doctor" && (
                        <>
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              setModal("profile");
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                          >
                            <span><FaUserAlt /></span> View Profile
                          </button>
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              navigate("/doctor/appointments");
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                          >
                            <span><FaCalendarCheck /></span> My Appointments
                          </button>
                        </>
                      )}

                      {/* Patient Menu */}
                      {user.role === "patient" && (
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            navigate("/patient/appointments");
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                        >
                          <span><FaCalendarCheck /></span> My Appointments
                        </button>
                      )}

                      {/* Logout for all roles */}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 font-medium flex items-center gap-2"
                        >
                          <span><MdLogout /></span> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setModal("login")}
                    className="text-gray-600 font-medium hover:text-blue-600 transition"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => setModal("register")}
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-full font-medium shadow-md hover:bg-gray-800 hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 top-full p-4 flex flex-col space-y-4">
            {(!user || user.role !== 'doctor') && (
              <>
                <button
                  onClick={() => {
                    if (user) navigate("/listDoctors");
                    else {
                      setModal("login");
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className="text-gray-700 font-medium py-2 hover:text-blue-600 text-left"
                >
                  Find Doctor
                </button>
                <button
                  onClick={() => {
                    if (user) navigate("/book-appointment");
                    else setModal("login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-700 font-medium py-2 hover:text-blue-600 text-left"
                >
                  Book Appointment
                </button>
              </>
            )}

            <div className="border-t border-gray-100 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  {user.role === 'admin' && (
                    <button onClick={() => navigate('/admin')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600">Dashboard</button>
                  )}
                  {user.role === 'doctor' && (
                    <>
                      <button onClick={() => setModal('profile')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600">View Profile</button>
                      <button onClick={() => navigate('/doctor/appointments')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600">My Appointments</button>
                    </>
                  )}
                  {user.role === 'patient' && (
                    <button onClick={() => navigate('/patient/appointments')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600">My Appointments</button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setModal("login"); setIsMobileMenuOpen(false); }}
                    className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setModal("register"); setIsMobileMenuOpen(false); }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium shadow-md"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content overlap with fixed navbar */}
      <div className="h-20"></div>

      {/* Modal */}
      {modal && (
        <>
          {(modal === "login" || modal === "register") && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
              <div className="relative animate-fade-in-up">
                <button
                  onClick={closeModal}
                  className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 z-10 font-bold transition-transform hover:rotate-90"
                >
                  ✕
                </button>
                {modal === "login" && (
                  <Login
                    onClose={closeModal}
                    onSwitchToRegister={() => setModal("register")}
                    onLoginSuccess={handleLoginSuccess}
                  />
                )}
                {modal === "register" && (
                  <Register
                    onClose={closeModal}
                    onSwitchToLogin={() => setModal("login")}
                  />
                )}
              </div>
            </div>
          )}

          {modal === "profile" && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-gray-100 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 hover:text-gray-800 transition z-10"
                >
                  ✕
                </button>

                <div className="mb-0">
                 
                  {user?.role === 'doctor' && <DoctorProfile />}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Navbar;