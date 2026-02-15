import React from "react";
import { Link } from "react-router-dom";
import Footer from "../layout/Footer.jsx";
import hospital from "../../assets/hospital.png";
import cardio from "../../assets/cardio.jpeg";
import neuro from "../../assets/neuro.jpeg";
import pedia from "../../assets/pediatric.jpeg";
import ortho from "../../assets/ortho.jpeg";

const Home = () => {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-screen min-h-[600px] flex items-center">

        <div className="absolute inset-0 z-0">
          <img
            src={hospital}
            alt="Hospital Building"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Advanced Care, <br />
              <span className="text-blue-300">Compassionate</span> Hearts
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-lg leading-relaxed">
              Experience world-class healthcare with our team of expert doctors and state-of-the-art facilities. Your journey to better health starts here.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/book-appointment"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-1"
              >
                Book Appointment
              </Link>
              <Link
                to="/listDoctors"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full font-semibold transition hover:border-white"
              >
                Find a Doctor
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Our Departments</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Specialized Medical Care</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We offer comprehensive medical services across a wide range of specialties to ensure you receive the best possible care.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service Card 1 - Cardiology */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-80 cursor-pointer transform hover:scale-105">
              <img
                src={cardio}
                alt="Cardiology"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-blue-900/90 group-hover:to-blue-600/40 transition-all duration-500"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                <h3 className="text-2xl font-bold mb-2">Cardiology</h3>
                <p className="text-white/90 leading-relaxed">Comprehensive heart care including diagnostics, treatment, and rehabilitation.</p>
              </div>
            </div>

            {/* Service Card 2 - Neurology */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-80 cursor-pointer transform hover:scale-105">
              <img
                src={neuro}
                alt="Neurology"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-blue-900/90 group-hover:to-blue-600/40 transition-all duration-500"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                <h3 className="text-2xl font-bold mb-2">Neurology</h3>
                <p className="text-white/90 leading-relaxed">Advanced diagnosis and treatment for disorders of the nervous system.</p>
              </div>
            </div>

            {/* Service Card 3 - Pediatrics */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-80 cursor-pointer transform hover:scale-105">
              <img
                src={pedia}
                alt="Pediatrics"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-blue-900/90 group-hover:to-blue-600/40 transition-all duration-500"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                <h3 className="text-2xl font-bold mb-2">Pediatrics</h3>
                <p className="text-white/90 leading-relaxed">Specialized healthcare for infants, children, and adolescents.</p>
              </div>
            </div>

            {/* Service Card 4 - Orthopedics */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-80 cursor-pointer transform hover:scale-105">
              <img
                src={ortho}
                alt="Orthopedics"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-blue-900/90 group-hover:to-blue-600/40 transition-all duration-500"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                <h3 className="text-2xl font-bold mb-2">Orthopedics</h3>
                <p className="text-white/90 leading-relaxed">Expert care for bones, joints, ligaments, tendons, and muscles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;