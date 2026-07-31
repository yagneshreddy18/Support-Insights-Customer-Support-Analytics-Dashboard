import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useNotification } from '../context/NotificationContext';
import { Lock, CheckCircle } from 'lucide-react';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'demo-reset-token';
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword: data.newPassword });
      addToast('Password reset successful! You can now log in.', 'success');
      navigate('/login');
    } catch (err) {
      addToast('Failed to reset password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Set New Password</h2>
        <p className="text-xs text-slate-400 mt-1">Type your new secure account password below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: { value: 6, message: 'Minimum 6 characters required' }
              })}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          {errors.newPassword && <span className="text-[11px] text-rose-400 mt-1 block">{errors.newPassword.message}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-6"
        >
          {loading ? 'Updating...' : <><CheckCircle className="w-4 h-4" /> Reset Password</>}
        </button>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-slate-800/80">
        <Link to="/login" className="text-xs text-slate-400 hover:text-white font-medium">
          Cancel and Sign In
        </Link>
      </div>
    </div>
  );
};
