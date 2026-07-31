import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const AgentPerformanceChart = ({ data }) => {
  const chartData = data?.map(d => ({
    name: d.agent_name.split(' ')[0],
    Resolved: d.resolved_tickets,
    InProgress: d.in_progress_tickets,
    Assigned: d.assigned_tickets
  })) || [
    { name: 'David', Resolved: 12, InProgress: 3, Assigned: 15 },
    { name: 'Elena', Resolved: 18, InProgress: 2, Assigned: 20 },
    { name: 'Marcus', Resolved: 14, InProgress: 4, Assigned: 18 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            formatter={(val) => <span className="text-xs text-slate-300 font-medium">{val}</span>}
          />
          <Bar dataKey="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="InProgress" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
