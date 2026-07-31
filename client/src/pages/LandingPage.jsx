import React from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoy, ShieldCheck, BarChart3, Clock, Users, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-[Inter] selection:bg-blue-500 selection:text-white">
      {/* Header Navigation */}
      <nav className="h-20 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LifeBuoy className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white">Support Insights</span>
            <span className="text-xs text-blue-400 font-semibold block -mt-1">Dashboard 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 text-center max-w-5xl mx-auto overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5" /> Next-Gen Enterprise Customer Support Intelligence
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Support Analytics & Ticket Intelligence Engine
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Empower your support team with automated workflows, real-time SLA metrics, normalized SQL analytics, role-based controls, and rich team performance dashboards.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
          >
            Launch Free Demo <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 text-sm font-bold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-2xl transition-all"
          >
            Explore Pre-seeded Admin Dashboard
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
          <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Real-Time SQL Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track SLA compliance rates, average response times, monthly ticket volumes, and backlog ratios with optimized SQL aggregation.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Role-Based Access Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tailored workspaces for Admins, Support Engineers, and Customers with granular permissions and JWT tokens.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Automated Ticket Workflows</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open → Assigned → In Progress → Resolved lifecycle with internal agent notes, attachments, and instant notifications.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        © 2026 Support Insights Inc. All rights reserved. Built with React, Node.js & MySQL.
      </footer>
    </div>
  );
};
