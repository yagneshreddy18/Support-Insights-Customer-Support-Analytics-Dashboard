import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useNotification } from '../context/NotificationContext';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { addToast } = useNotification();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setSent(true);
      addToast('Reset link sent to your email address.', 'success');
    } catch (err) {
      addToast('Failed to request password reset.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Forgot Password?</h2>
        <p className="text-xs text-slate-400 mt-1">Enter your registered email to receive password reset instructions.</p>
      </div>

      {sent ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
          <p className="text-xs font-semibold text-emerald-400">
            A password reset email has been sent. Please check your inbox or spam folder.
          </p>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-bold hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register('email', { required: 'Email address is required' })}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="user@example.com"
              />
            </div>
            {errors.email && <span className="text-[11px] text-rose-400 mt-1 block">{errors.email.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-6"
          >
            {loading ? 'Sending Link...' : <><Send className="w-4 h-4" /> Send Reset Link</>}
          </button>
        </form>
      )}

      <div className="text-center mt-6 pt-4 border-t border-slate-800/80">
        <Link to="/login" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
        </Link>
      </div>
    </div>
  );
};
