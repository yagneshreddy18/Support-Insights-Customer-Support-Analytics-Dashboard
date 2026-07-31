import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsApi } from '../api/analyticsApi';
import { ticketApi } from '../api/ticketApi';
import { MonthlyTicketsChart } from '../components/charts/MonthlyTicketsChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { PriorityDistributionChart } from '../components/charts/PriorityDistributionChart';
import { AgentPerformanceChart } from '../components/charts/AgentPerformanceChart';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { SkeletonCard } from '../components/common/Skeleton';
import { Link } from 'react-router-dom';
import {
  Ticket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  PlusCircle,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const DashboardPage = () => {
  const { user, isAdmin, isAgent, isCustomer } = useAuth();
  const [overview, setOverview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin || isAgent) {
          const [overviewRes, catRes, employeeRes, ticketRes] = await Promise.all([
            analyticsApi.getOverview(),
            analyticsApi.getCategoryDistribution(),
            analyticsApi.getEmployeePerformance(),
            ticketApi.getTickets({ limit: 6 })
          ]);
          setOverview(overviewRes.data.data);
          setCategories(catRes.data.data);
          setEmployees(employeeRes.data.data);
          setTickets(ticketRes.data.data);
        } else {
          // Customer
          const ticketRes = await ticketApi.getTickets({ limit: 6 });
          setTickets(ticketRes.data.data);
        }
      } catch (err) {
        console.error('Failed loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, isAgent, isCustomer]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 rounded-3xl backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
            {user?.role_name} Portal
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Welcome back, {user?.name.split(' ')[0]}!
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {isAdmin && 'Platform overview, SLA metrics, and operational performance insights.'}
            {isAgent && 'Manage your assigned queue, update resolution details, and track your metrics.'}
            {isCustomer && 'Track open requests, request new support tickets, and view resolution updates.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isCustomer && (
            <Link
              to="/tickets/new"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Create Ticket
            </Link>
          )}

          {isAdmin && (
            <a
              href="/api/v1/analytics/export"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export CSV Report
            </a>
          )}
        </div>
      </div>

      {/* ADMIN & AGENT KPI CARDS */}
      {(isAdmin || isAgent) && overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold">Total Tickets</span>
              <Ticket className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{overview.totalTickets}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" /> +12% from last week
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold">Open & Assigned</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-purple-400">
              {overview.openTickets + overview.assignedTickets}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Pending resolution workflow</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold">Critical Tickets</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-extrabold text-rose-400">{overview.criticalTickets}</div>
            <div className="text-[11px] text-rose-400/80 mt-1 font-medium">Requires immediate agent SLA action</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold">Avg Resolution Time</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">
              {overview.avgResolutionTimeHours} hrs
            </div>
            <div className="text-[11px] text-slate-500 mt-1">SLA Target &lt; 24 hrs</div>
          </div>
        </div>
      )}

      {/* CUSTOMER STAT CARDS */}
      {isCustomer && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400">Total Submitted</span>
            <div className="text-2xl font-extrabold text-white mt-2">{tickets.length}</div>
          </div>
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-xs font-semibold text-amber-400">Active Requests</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-2">
              {tickets.filter(t => ['Open', 'Assigned', 'In Progress'].includes(t.status)).length}
            </div>
          </div>
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-xs font-semibold text-emerald-400">Resolved Requests</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-2">
              {tickets.filter(t => ['Resolved', 'Closed'].includes(t.status)).length}
            </div>
          </div>
        </div>
      )}

      {/* CHARTS GRID FOR ADMIN/AGENT */}
      {(isAdmin || isAgent) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-white">Monthly Ticket Volume Trend</h3>
                <p className="text-[11px] text-slate-400">Tickets created vs tickets resolved over time</p>
              </div>
              <span className="text-xs text-blue-400 font-semibold">Live Metrics</span>
            </div>
            <MonthlyTicketsChart />
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white">Category Distribution</h3>
              <p className="text-[11px] text-slate-400">Ticket count broken down by type</p>
            </div>
            <CategoryPieChart data={categories} />
          </div>
        </div>
      )}

      {/* RECENT TICKETS TABLE */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Support Tickets</h3>
            <p className="text-[11px] text-slate-400">Overview of latest submitted inquiries</p>
          </div>
          <Link
            to={isCustomer ? "/my-tickets" : "/all-tickets"}
            className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No support tickets found.</div>
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
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {tickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-400">{ticket.ticket_code}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200 max-w-xs truncate">{ticket.title}</td>
                    <td className="py-3.5 px-4 text-slate-400">{ticket.category_name}</td>
                    <td className="py-3.5 px-4"><PriorityBadge priority={ticket.priority} /></td>
                    <td className="py-3.5 px-4"><StatusBadge status={ticket.status} /></td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(ticket.created_at)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                      >
                        View
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
