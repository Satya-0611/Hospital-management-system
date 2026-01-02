import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-medical-primary text-white font-bold rounded p-1">MH</div>
            <span className="text-xl font-bold text-white tracking-wide">MediHub</span>
          </div>
          <Link 
            to="/login" 
            className="text-slate-300 hover:text-white font-medium transition-colors duration-200"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-4xl text-center space-y-8 animate-fade-in-up">
          
          {/* Professional Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-600 text-medical-primary text-sm font-semibold tracking-wider mb-4 shadow-sm">
            Excellence in Healthcare
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Advanced <span className="text-medical-primary">Medical Care</span> <br />
            For Everyone
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Your trusted partner in health. Experience world-class medical services and seamless appointment scheduling at your fingertips.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-10">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-medical-primary hover:bg-teal-600 text-white text-lg font-bold rounded-lg transition-all shadow-lg shadow-teal-900/40 transform hover:-translate-y-0.5"
            >
              Patient Portal
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-4 bg-transparent hover:bg-slate-800 text-white text-lg font-bold rounded-lg border border-slate-600 transition-all hover:border-slate-500"
            >
              Register New Account
            </Link>
          </div>
        </div>
      </main>

      {/* Professional Footer */}
      <footer className="py-8 text-center border-t border-slate-800 bg-slate-900">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} MediHub System. All Rights Reserved.
        </p>
        <div className="flex justify-center gap-4 mt-2 text-xs text-slate-600">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Support</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;