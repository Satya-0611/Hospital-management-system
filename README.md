# Integrated Hospital Management System (HMS)

A comprehensive, web-based healthcare platform designed to digitize hospital operations. This system automates patient appointments, pharmacy inventory, and administrative analytics into a single, secure interface.

🚀 **Live Demo:** [View Application](https://hospital-management-system-ochre-two.vercel.app/)

## 🔑 Key Features

* **🛡️ Module 1: Authentication & Security (RBAC)**
  * Secure Login/Signup for Admin, Doctor, and Patient.
  * JWT (JSON Web Token) based session management.
  * Bcrypt hashing for password security.
  * Protected Routes preventing unauthorized access.

* **🩺 Module 2: Clinical Operations**
  * Appointment Booking Engine: Patients can check doctor availability and book slots.
  * Doctor Dashboard: View assigned patients and update medical status (Pending/Completed).
  * Digital History: Centralized patient records accessible by authorized doctors.

* **💊 Module 3: Pharmacy & Inventory**
  * Automated Stock Deduction: Prescribing medicine automatically reduces inventory count.
  * Auto-Billing: System calculates total bill based on unit prices, eliminating manual error.
  * Inventory Alerts: Prevents prescribing "Out of Stock" medicines.

* **📊 Module 4: Analytics & Reporting**
  * Interactive Charts: Visualizing Revenue, Patient Footfall, and Disease Trends.
  * Data Aggregation: Uses MongoDB Aggregation Pipelines for real-time stats.
  * Export to CSV: Admins can download monthly reports for auditing.

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Infrastructure:** Docker, Docker Compose
* **Security & Visualization:** JWT, BcryptJS, Cors, Recharts

---

## 🐳 Quick Start (Recommended: Run via Docker)

The easiest way to run this application is using Docker. You do not need Node.js installed locally, just [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### 1. Clone the Repository
```bash
git clone [https://github.com/Satya-0611/Hospital-management-system.git](https://github.com/Satya-0611/Hospital-management-system.git)
cd Hospital-management-system
2. Configure Environment Variables (Crucial)
Before running the containers, you must provide your database credentials and secret keys.

Navigate to the backend directory and create a .env file:

Bash
cd hms-backend
touch .env
Open the .env file and add the following variables:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
3. Build and Run the Containers
Return to the root directory of the project and start the orchestration:

Bash
cd ..
docker compose up --build
Frontend: Accessible at http://localhost:5173

Backend API: Accessible at http://localhost:5000

⚙️ Manual Local Installation (Fallback)
If you prefer to run the application without Docker, follow these steps.

1. Backend Setup
Bash
cd hms-backend
npm install
Ensure your .env file is created inside hms-backend as described in the Docker steps above, then start the server:

Bash
npm run dev
2. Frontend Setup
Open a new terminal window.

Bash
cd hms-frontend
npm install
Configure API URL: Ensure your Axios instance (e.g., src/api.js) has the baseURL set to your local server:

JavaScript
baseURL: 'http://localhost:5000/api'
Start the client:

Bash
npm run dev