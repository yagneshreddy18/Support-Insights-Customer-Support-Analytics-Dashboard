import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  BarChart3,
  Users,
  FolderKanban,
  Settings,
  ShieldAlert,
  Headphones,
  LifeBuoy
} from 'lucide-react';

export const Sidebar = () => {
  const { isAdmin, isAgent, isCustomer, user } = useAuth();

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/5'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
    }`;

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between p-4 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LifeBuoy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Support Insights</h1>
            <p className="text-[10px] text-slate-500 font-medium">Analytics Dashboard 2026</p>
          </div>
        </div>

        {/* Role Badge */}
        <div className="mx-3 mb-6 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
          {isAdmin && <ShieldAlert className="w-4 h-4 text-purple-400" />}
          {isAgent && <Headphones className="w-4 h-4 text-blue-400" />}
          {isCustomer && <LifeBuoy className="w-4 h-4 text-emerald-400" />}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Role</div>
            <div className="text-xs font-bold text-white">{user?.role_name || 'User'}</div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Main</div>
          <NavLink to="/dashboard" className={navItemClass}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </NavLink>

          {isCustomer && (
            <>
              <NavLink to="/tickets/new" className={navItemClass}>
                <PlusCircle className="w-4 h-4 text-emerald-400" /> Create Ticket
              </NavLink>
              <NavLink to="/my-tickets" className={navItemClass}>
                <Ticket className="w-4 h-4" /> My Tickets
              </NavLink>
            </>
          )}

          {(isAdmin || isAgent) && (
            <>
              <NavLink to="/all-tickets" className={navItemClass}>
                <Ticket className="w-4 h-4" /> Ticket Queue
              </NavLink>
              <NavLink to="/analytics" className={navItemClass}>
                <BarChart3 className="w-4 h-4 text-indigo-400" /> Analytics & Reports
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <div className="px-3 pt-6 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Administration</div>
              <NavLink to="/manage-users" className={navItemClass}>
                <Users className="w-4 h-4 text-purple-400" /> User Management
              </NavLink>
              <NavLink to="/manage-categories" className={navItemClass}>
                <FolderKanban className="w-4 h-4 text-amber-400" /> Ticket Categories
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-4 border-t border-slate-900">
        <NavLink to="/settings" className={navItemClass}>
          <Settings className="w-4 h-4" /> System Settings
        </NavLink>
      </div>
    </aside>
  );
};
