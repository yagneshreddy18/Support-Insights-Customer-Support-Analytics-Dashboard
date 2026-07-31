import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LifeBuoy } from 'lucide-react';
import { ToastContainer } from '../components/common/Toast';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header logo */}
      <Link to="/" className="flex items-center gap-3 mb-8 hover:scale-105 transition-transform">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/25">
          <LifeBuoy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Support Insights</h1>
          <p className="text-xs text-slate-400 font-medium">Customer Support Analytics Dashboard</p>
        </div>
      </Link>

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
};
