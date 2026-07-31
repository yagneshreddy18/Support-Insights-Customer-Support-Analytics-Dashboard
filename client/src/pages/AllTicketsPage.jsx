import React, { useState, useEffect } from 'react';
import { ticketApi } from '../api/ticketApi';
import { categoryApi } from '../api/categoryApi';
import { userApi } from '../api/userApi';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { SkeletonTable } from '../components/common/Skeleton';
import { Link } from 'react-router-dom';
import { Search, RefreshCw, UserCheck } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const AllTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [assignedAgentId, setAssignedAgentId] = useState('');
  const [search, setSearch] = useState('');

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const [tRes, cRes, uRes] = await Promise.all([
        ticketApi.getTickets({
          status,
          priority,
          category_id: categoryId,
          assigned_agent_id: assignedAgentId,
          search
        }),
        categoryApi.getCategories(),
        userApi.getUsers({ role_id: 2 })
      ]);
      setTickets(tRes.data.data);
      setCategories(cRes.data.data);
      setAgents(uRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [status, priority, categoryId, assignedAgentId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQueue();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">System Ticket Queue</h2>
        <p className="text-xs text-slate-400">Master ticket overview with real-time assignment and status controls</p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code, title, customer..."
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
            <option value="Rejected">Rejected</option>
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

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={assignedAgentId}
            onChange={(e) => setAssignedAgentId(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Support Agents</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          <button
            onClick={fetchQueue}
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
          <div className="p-12 text-center text-xs text-slate-500">
            No support tickets match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {tickets.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-400">{t.ticket_code}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200 max-w-xs truncate">{t.title}</td>
                    <td className="py-3.5 px-4 text-slate-300">{t.customer_name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{t.category_name}</td>
                    <td className="py-3.5 px-4"><PriorityBadge priority={t.priority} /></td>
                    <td className="py-3.5 px-4"><StatusBadge status={t.status} /></td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {t.assigned_agent_name !== 'Unassigned' ? (
                        <span className="inline-flex items-center gap-1.5 text-blue-400 font-semibold">
                          <UserCheck className="w-3.5 h-3.5" /> {t.assigned_agent_name}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-normal">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/tickets/${t.id}`}
                        className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold"
                      >
                        Manage
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
