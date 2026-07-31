import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import { MonthlyTicketsChart } from '../components/charts/MonthlyTicketsChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { PriorityDistributionChart } from '../components/charts/PriorityDistributionChart';
import { AgentPerformanceChart } from '../components/charts/AgentPerformanceChart';
import { SkeletonCard } from '../components/common/Skeleton';
import { BarChart3, Download, ShieldCheck, Clock, CheckCircle2, TrendingUp, Users } from 'lucide-react';

export const AnalyticsPage = () => {
  const [overview, setOverview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [oRes, cRes, eRes] = await Promise.all([
          analyticsApi.getOverview(),
          analyticsApi.getCategoryDistribution(),
          analyticsApi.getEmployeePerformance()
        ]);
        setOverview(oRes.data.data);
        setCategories(cRes.data.data);
        setEmployees(eRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" /> Support Analytics & Operational Intelligence
          </h2>
          <p className="text-xs text-slate-400">SQL aggregated metrics, SLA targets, and employee performance leaderboard</p>
        </div>

        <a
          href="/api/v1/analytics/export"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <Download className="w-4 h-4" /> Export CSV Report
        </a>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Total System Volume</span>
          <div className="text-2xl font-extrabold text-white mt-2">{overview.totalTickets}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across all categories</div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-emerald-400">SLA Compliance Rate</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">{overview.slaComplianceRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Target &gt; 90%</div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-blue-400">Avg Resolution Duration</span>
          <div className="text-2xl font-extrabold text-blue-400 mt-2">{overview.avgResolutionTimeHours} hrs</div>
          <div className="text-[11px] text-slate-500 mt-1">First response avg: {overview.avgFirstResponseTimeMinutes} mins</div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-purple-400">Resolved vs Active Ratio</span>
          <div className="text-2xl font-extrabold text-purple-400 mt-2">{overview.resolvedVsPendingRatio}</div>
          <div className="text-[11px] text-slate-500 mt-1">Healthy backlog balance</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-4">Priority Volume Distribution</h3>
          <PriorityDistributionChart />
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-4">Category Load Breakdown</h3>
          <CategoryPieChart data={categories} />
        </div>
      </div>

      {/* Agent Performance Leaderboard Table */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" /> Support Agent Performance Leaderboard
          </h3>
          <p className="text-[11px] text-slate-400">Assigned tickets, resolution rates, and resolution duration breakdown</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Support Agent</th>
                <th className="py-3 px-4">Assigned Tickets</th>
                <th className="py-3 px-4">Resolved Tickets</th>
                <th className="py-3 px-4">In Progress</th>
                <th className="py-3 px-4">Resolution Rate</th>
                <th className="py-3 px-4">Avg Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {employees.map(emp => (
                <tr key={emp.agent_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                    <img
                      src={emp.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                      alt="Avatar"
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span>{emp.agent_name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-semibold">{emp.assigned_tickets}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">{emp.resolved_tickets}</td>
                  <td className="py-3.5 px-4 text-amber-400 font-semibold">{emp.in_progress_tickets}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {emp.resolution_rate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{emp.avg_resolution_hrs} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
