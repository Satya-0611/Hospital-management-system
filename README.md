# 🏥 Integrated Hospital Management System (HMS)

![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-success)

A comprehensive, web-based healthcare platform designed to digitize hospital operations. This system automates **patient appointments**, **pharmacy inventory**, and **administrative analytics** into a single, secure interface.

---

## 🚀 Live Demo

https://hospital-management-system-ochre-two.vercel.app/

---

## 🔑 Key Features

### 🛡️ Module 1: Authentication & Security (RBAC)
- Secure Login/Signup for Admin, Doctor, and Patient.
- **JWT (JSON Web Token)** based session management.
- **Bcrypt** hashing for password security.
- Protected Routes preventing unauthorized access.

### 🩺 Module 2: Clinical Operations
- **Appointment Booking Engine:** Patients can check doctor availability and book slots.
- **Doctor Dashboard:** View assigned patients and update medical status (Pending/Completed).
- **Digital History:** Centralized patient records accessible by authorized doctors.

### 💊 Module 3: Pharmacy & Inventory
- **Automated Stock Deduction:** Prescribing medicine automatically reduces inventory count.
- **Auto-Billing:** System calculates total bill based on unit prices, eliminating manual error.
- **Inventory Alerts:** Prevents prescribing "Out of Stock" medicines.

### 📊 Module 4: Analytics & Reporting
- **Interactive Charts:** Visualizing Revenue, Patient Footfall, and Disease Trends.
- **Data Aggregation:** Uses MongoDB Aggregation Pipelines for real-time stats.
- **Export to CSV:** Admins can download monthly reports for auditing.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Security:** JWT, BcryptJS, Cors
- **Visualization:** Recharts

---

## ⚙️ Local Installation Guide

Follow these steps to run the project locally on your machine.

### 1. Clone the Repository
```bash
1. git clone (https://github.com/Satya-0611/Hospital-management-system)
cd hospital-management-system
2. Backend Setup
Bash
cd hms-backend
npm install
Create a .env file in the hms-backend folder:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
Start the Server:

Bash
npm start
3. Frontend Setup
Open a new terminal.

Bash
cd hms-frontend
npm install
Configure API URL:
Go to src/api.js (or wherever your Axios instance is) and ensure the baseURL is set to localhost:

JavaScript
baseURL: 'http://localhost:5000/api'
Start the Client:

Bash
npm run dev
