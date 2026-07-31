import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { LogIn, Lock, Mail, Key } from 'lucide-react';

export const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      addToast('Welcome back! Login successful.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email, password) => {
    onSubmit({ email, password });
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to Dashboard</h2>
        <p className="text-xs text-slate-400 mt-1">Enter your credentials to manage tickets & analytics</p>
      </div>

      {/* Quick Demo Credentials */}
      <div className="mb-6 p-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs space-y-1.5">
        <div className="font-bold text-slate-300 mb-1 flex items-center gap-1">
          <Key className="w-3.5 h-3.5 text-amber-400" /> One-Click Demo Credentials:
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@supportinsights.com', 'password123')}
            className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/20 font-semibold"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('david.chen@supportinsights.com', 'password123')}
            className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/20 font-semibold"
          >
            Support Agent
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('alice@acme.com', 'password123')}
            className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg hover:bg-emerald-500/20 font-semibold"
          >
            Customer
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="user@example.com"
            />
          </div>
          {errors.email && <span className="text-[11px] text-rose-400 mt-1 block">{errors.email.message}</span>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <Link to="/forgot-password" className="text-xs text-blue-400 hover:underline font-medium">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          {errors.password && <span className="text-[11px] text-rose-400 mt-1 block">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-6"
        >
          {loading ? 'Authenticating...' : <><LogIn className="w-4 h-4" /> Sign In</>}
        </button>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-slate-800/80">
        <p className="text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
