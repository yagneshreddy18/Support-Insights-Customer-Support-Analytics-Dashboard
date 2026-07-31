import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { Bell, Sun, Moon, Search, LogOut, User, Settings, Check } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Global Search */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Global Search (Tickets, Code, Customers)..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (onSearch) onSearch(e.target.value);
          }}
          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </form>

      {/* Action items */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark/Light Theme"
          className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.link) navigate(n.link);
                        setShowNotifications(false);
                      }}
                      className={`p-3.5 hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        n.is_read ? 'opacity-60' : 'bg-blue-500/5 font-medium'
                      }`}
                    >
                      <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors"
          >
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
              alt="Avatar"
              className="w-8 h-8 rounded-lg object-cover border border-slate-700"
            />
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-slate-200">{user?.name}</div>
              <div className="text-[10px] text-blue-400 uppercase tracking-wider font-bold">
                {user?.role_name}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50">
              <Link
                to="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
              >
                <User className="w-4 h-4 text-blue-400" /> My Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4 text-purple-400" /> Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
