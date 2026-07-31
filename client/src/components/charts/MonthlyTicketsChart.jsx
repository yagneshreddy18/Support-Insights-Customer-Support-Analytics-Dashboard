import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const MonthlyTicketsChart = ({ data }) => {
  const chartData = data || [
    { month: 'Jan', created: 12, resolved: 10 },
    { month: 'Feb', created: 18, resolved: 15 },
    { month: 'Mar', created: 25, resolved: 22 },
    { month: 'Apr', created: 20, resolved: 19 },
    { month: 'May', created: 32, resolved: 28 },
    { month: 'Jun', created: 38, resolved: 35 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
            labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" name="Tickets Created" />
          <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Tickets Resolved" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
