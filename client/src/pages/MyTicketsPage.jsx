import React, { useState, useEffect } from 'react';
import { ticketApi } from '../api/ticketApi';
import { categoryApi } from '../api/categoryApi';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { SkeletonTable } from '../components/common/Skeleton';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter, RefreshCw } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [search, setSearch] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const [tRes, cRes] = await Promise.all([
        ticketApi.getTickets({ status, priority, category_id: categoryId, search }),
        categoryApi.getCategories()
      ]);
      setTickets(tRes.data.data);
      setCategories(cRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [status, priority, categoryId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">My Support Tickets</h2>
          <p className="text-xs text-slate-400">View and track status updates for tickets created by you</p>
        </div>
        <Link
          to="/tickets/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Create New Ticket
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <button
            onClick={fetchTickets}
            title="Refresh List"
            className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ticket List Table */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
        {loading ? (
          <SkeletonTable />
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-3">
            <p>No tickets found matching current filters.</p>
            <Link to="/tickets/new" className="text-blue-400 font-bold hover:underline">
              Create your first ticket
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {tickets.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-400">{t.ticket_code}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200 max-w-sm truncate">{t.title}</td>
                    <td className="py-3.5 px-4 text-slate-400">{t.category_name}</td>
                    <td className="py-3.5 px-4"><PriorityBadge priority={t.priority} /></td>
                    <td className="py-3.5 px-4"><StatusBadge status={t.status} /></td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(t.created_at)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/tickets/${t.id}`}
                        className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold"
                      >
                        View Ticket
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
