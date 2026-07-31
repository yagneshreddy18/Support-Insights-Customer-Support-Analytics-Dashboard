import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { useNotification } from '../context/NotificationContext';
import { User, Mail, Shield, Save, Camera } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.updateProfile({ name, bio, avatar_url: avatarUrl });
      updateUserProfile(res.data.data);
      addToast('Profile updated successfully.', 'success');
    } catch (err) {
      addToast('Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Account Profile</h2>
        <p className="text-xs text-slate-400">Update your personal account details and avatar</p>
      </div>

      <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-6">
        <div className="flex items-center gap-5 border-b border-slate-800 pb-6">
          <img
            src={avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
            alt="Avatar"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/30"
          />
          <div>
            <h3 className="text-base font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold text-[10px] uppercase border border-blue-500/30">
              {user?.role_name}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
            <div className="relative">
              <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Role Description</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20"
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
