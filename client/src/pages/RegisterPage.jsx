import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { UserPlus, User, Mail, Lock, Shield } from 'lucide-react';

export const RegisterPage = () => {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm();
  const { register: registerAuth } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerAuth(data);
      addToast('Registration successful! Account created.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
        <p className="text-xs text-slate-400 mt-1">Join Support Insights portal today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              {...registerField('name', { required: 'Full name is required' })}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="John Doe"
            />
          </div>
          {errors.name && <span className="text-[11px] text-rose-400 mt-1 block">{errors.name.message}</span>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              {...registerField('email', { required: 'Valid email is required' })}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="john@example.com"
            />
          </div>
          {errors.email && <span className="text-[11px] text-rose-400 mt-1 block">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
          <div className="relative">
            <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              {...registerField('role')}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="Customer">Customer</option>
              <option value="Support Agent">Support Agent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              {...registerField('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters required' }
              })}
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
          {loading ? 'Creating Account...' : <><UserPlus className="w-4 h-4" /> Create Account</>}
        </button>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-slate-800/80">
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
