import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { useNotification } from '../context/NotificationContext';
import { Modal } from '../components/common/Modal';
import { SkeletonTable } from '../components/common/Skeleton';
import { Users, UserPlus, Trash2, Edit, Shield, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const ManageUsersPage = () => {
  const { addToast } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add User Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('password123');
  const [newRoleId, setNewRoleId] = useState('2'); // Support Agent by default

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getUsers();
      setUsers(res.data.data);
    } catch (err) {
      addToast('Failed to load users.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await userApi.createUser({
        name: newName,
        email: newEmail,
        password: newPassword,
        role_id: parseInt(newRoleId, 10)
      });
      addToast('New user created successfully!', 'success');
      setShowAddModal(false);
      setNewName('');
      setNewEmail('');
      fetchUsers();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create user.', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userApi.deleteUser(id);
      addToast('User deleted successfully.', 'success');
      fetchUsers();
    } catch (err) {
      addToast('Failed to delete user.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" /> User & Role Management
          </h2>
          <p className="text-xs text-slate-400">Manage platform administrators, support engineers, and customer accounts</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Add Support Agent
        </button>
      </div>

      {/* Users Table */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
        {loading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                      <img
                        src={u.avatar_url || 'https://ui-avatars.com/api/?name=User'}
                        alt="Avatar"
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        u.role_name === 'Admin'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : u.role_name === 'Support Agent'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {u.role_name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(u.created_at)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        title="Delete User"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Support User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="sarah@supportinsights.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
            <select
              value={newRoleId}
              onChange={(e) => setNewRoleId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
            >
              <option value="1">Admin</option>
              <option value="2">Support Agent</option>
              <option value="3">Customer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Password</label>
            <input
              type="text"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
