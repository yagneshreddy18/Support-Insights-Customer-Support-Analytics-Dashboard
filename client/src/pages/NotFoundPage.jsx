import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/20">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404 - Page Not Found</h1>
      <p className="text-xs text-slate-400 mt-2 max-w-sm">
        The requested page or ticket resource could not be found or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>
    </div>
  );
};
