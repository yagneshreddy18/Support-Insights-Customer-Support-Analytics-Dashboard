import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings, Sun, Moon, Bell, Shield, Database, Cpu } from 'lucide-react';

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" /> Platform Settings & Preferences
        </h2>
        <p className="text-xs text-slate-400">Configure dashboard themes, notifications, and integration settings</p>
      </div>

      <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-6">
        {/* Theme Settings */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              Appearance Mode
            </h3>
            <p className="text-xs text-slate-400 mt-1">Switch between sleek dark mode and high-contrast light theme</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl border border-slate-700"
          >
            Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        {/* Notifications Preference */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" /> Ticket SLA Alerts
            </h3>
            <p className="text-xs text-slate-400 mt-1">Receive immediate push alerts on critical SLA tickets</p>
          </div>
          <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-blue-600" />
        </div>

        {/* Database Status */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> Database Connection
            </h3>
            <p className="text-xs text-slate-400 mt-1">MySQL 8.0 Connection Pool with Fallback Engine active</p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
            Connected
          </span>
        </div>
      </div>
    </div>
  );
};
