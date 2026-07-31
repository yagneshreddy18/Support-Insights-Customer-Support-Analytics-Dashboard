export const TICKET_STATUSES = [
  'Open',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
  'Rejected'
];

export const TICKET_PRIORITIES = [
  'Low',
  'Medium',
  'High',
  'Critical'
];

export const DEFAULT_CATEGORIES = [
  'Bug',
  'Payment',
  'Login',
  'Account',
  'Feature Request',
  'Technical Issue',
  'Other'
];

export const STATUS_COLORS = {
  Open: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Assigned: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'In Progress': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Closed: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  Rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
};

export const PRIORITY_COLORS = {
  Low: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  Medium: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  High: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  Critical: 'bg-red-500/10 text-red-400 border-red-500/30 ring-1 ring-red-500/50'
};
