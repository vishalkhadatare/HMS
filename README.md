# 🏥 Hospital Appointment Booking System

## 📌 Introduction
The Hospital Appointment Booking System is a full-stack web application that enables patients to book doctor appointments online, doctors to manage appointments, and admins to control system operations. The application implements role-based access control to ensure secure and efficient workflows.

---

## 🛠 Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Language: TypeScript
- Authentication: JWT (JSON Web Tokens)

---

## ✨ Features
- Role-based access control (Admin, Doctor, Patient)
- Secure authentication & authorization
- Doctor availability management
- Appointment booking with slot validation
- Prevention of double booking
- Appointment status management


---

## 👥 User Roles & Permissions

### 👑 Admin
- Add doctors 
- View all appointments

### 🧑‍⚕️ Doctor
- Login using admin-provided credentials
- Create and update doctor profile
- Set availability (days and time slots)
- View assigned appointments
- Update appointment status

### 🧑‍🦱 Patient
- Register and login
- View available doctors
- Book appointments
- View upcoming appointments
- Cancel appointments

---

## 🔐 Authentication
Authentication is handled using JWT.  
All protected routes require the token in the request header:

## Getting Started

To run the project locally, follow these steps:

### Frontend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/vishalkhadatare/HMS.git
    ```
2. Navigate to the project directory:
    ```bash
    cd frontend
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Start the project:
    ```bash
    npm run dev
    ```
### Mongodb Setup

1. Install and open MongoDB Compass.
2. Create a new connection to your local MongoDB server or an Atlas cluster.

### Backend Setup

1. Navigate to the project directory:
    ```bash
    cd backend
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Create ``` .env ``` file in backed root

    ```bash 
    PORT = 500
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```
4. Start the project:
     ```bash
    npm run dev
     ```

### API Documentation
### Hospital Appointment Booking

**Register**

POST/api/auth/registe

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "password123"
}

```
**Login (Admin / Doctor / Patient)**

**Request Body**
```json
{
  "email": "user@gmail.com",
  "password": "password123"
}

```
###  👑 Admin APIs
### 1. Add Doctors

**Endpoint:**POST /api/admin/add-doctor

**Request Body:**
```bash
    {
  "name": "Dr. Arun Kumar",
  "email": "arun@hospital.com"
  "password": "password123"
    }
```

### 2. View All Appointments

**Endpoint:** GET /api/admin/appointments

**Request Body:**
```bash
    {
  "name": "Dr. Arun Kumar",
  "email": "arun@hospital.com"
  "password": "password123"
    }
```

### 🧑‍⚕️ Doctor APIs

### 1. Create / Update Doctor Profile


**Endpoint:** GPUT /api/doctor/profile

**Request Body:**
```bash
   {
  "specialization": "Cardiology",
  "experience": 10,
  "phone": "9876543210",
  "address": "Pune, Maharashtra",
  "availableDays": ["Monday", "Wednesday", "Friday"],
  "availableTimeSlots": ["09:00 AM", "09:30 AM", "10:00 AM"]
}
```
### 2. View Doctor Appointments

**Endpoint:** GET /api/appointment/doctor/view

### 3. Update Appointment Status

**Endpoint:** PATCH /api/appointment/updateStatus/:id
```bash
   {
  "status": "Accepted"
    }
```

### 🧑‍🦱 Patient APIs

### 1. View Available Doctors

**Endpoint:** GET /api/doctor/list

### 2. Book Appointment

**Endpoint:** POST /api/appointment/book

```bash
  {
  "doctorId": "65c9f1a2b3d4e5f678901234",
  "date": "2026-02-10",
  "time": "09:30 AM"
    }
```

### 3. View Available Doctors

**Endpoint:** GET /api/appointment/patient/view


### 4. Cancel Appointment

**Endpoint:** PATCH /api/appointment/cancel/:id

### Local Development URLs

**Frontend :** http://localhost:5173

**Backend :** http://localhost:5000


## 🚀 Deployment

### 🌐 Frontend

**. Platform:** Netlify

**. Live URL:** https://bespoke-starlight-94a774.netlify.app

### ⚙️ Backend

**. Platform:** Render

**. API Base URL:** https://hospital-backend-2-3zi4.onrender.com

### 📝 Deployment Note

Frontend is hosted on Netlify and consumes APIs from the Render backend.

Backend services are securely connected to MongoDB Atlas.

Environment variables are managed securely on Render.

### 🔑 Admin Login Credentials (For Demo)
```bash
email : admin123@gmail.com
password: adim123
```
### 🔗 Useful Links

**🌐 Live Application:** https://bespoke-starlight-94a774.netlify.app
    
**⚙️ Backend API:** https://hospital-backend-2-3zi4.onrender.com



