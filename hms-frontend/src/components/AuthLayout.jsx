import React from 'react';

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    // Changed bg-slate-50 to bg-slate-900 to match global dark theme
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo Section */}
        <div className="mx-auto h-12 w-12 bg-medical-primary rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-500/20">
          M
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          MediHub
        </h2>
        <h3 className="mt-2 text-center text-xl font-semibold text-slate-300">
          {title}
        </h3>
        <p className="mt-1 text-center text-sm text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Card Background: bg-slate-800 for dark mode contrast */}
        <div className="bg-slate-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-700 border-t-4 border-t-medical-primary">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;