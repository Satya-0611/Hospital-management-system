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
git clone [https://github.com/YOUR_USERNAME/hospital-management-system.git](https://github.com/YOUR_USERNAME/hospital-management-system.git)
cd hospital-management-system
