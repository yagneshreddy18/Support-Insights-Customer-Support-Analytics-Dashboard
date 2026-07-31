import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PRIORITY_COLORS_MAP = {
  Low: '#64748b',
  Medium: '#3b82f6',
  High: '#f97316',
  Critical: '#ef4444'
};

export const PriorityDistributionChart = ({ data }) => {
  const chartData = data || [
    { priority: 'Low', count: 12 },
    { priority: 'Medium', count: 28 },
    { priority: 'High', count: 15 },
    { priority: 'Critical', count: 5 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="priority" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={PRIORITY_COLORS_MAP[entry.priority] || '#3b82f6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
