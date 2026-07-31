import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import { categoryApi } from '../api/categoryApi';
import { useNotification } from '../context/NotificationContext';
import { PlusCircle, FileText, FolderKanban, AlertCircle, ArrowLeft } from 'lucide-react';

export const CreateTicketPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoryApi.getCategories()
      .then(res => setCategories(res.data.data))
      .catch(err => console.error(err));
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await ticketApi.createTicket(data);
      addToast('Ticket created successfully!', 'success');
      navigate(`/tickets/${res.data.data.id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create ticket.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Submit New Support Ticket</h2>
          <p className="text-xs text-slate-400">Describe your issue in detail for our support engineering team</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ticket Title</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register('title', { required: 'Ticket title is required' })}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. Unable to process payment via Visa card"
              />
            </div>
            {errors.title && <span className="text-[11px] text-rose-400 mt-1 block">{errors.title.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <div className="relative">
                <FolderKanban className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  {...register('category_id', { required: 'Please select a category' })}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Issue Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              {errors.category_id && <span className="text-[11px] text-rose-400 mt-1 block">{errors.category_id.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority</label>
              <div className="relative">
                <AlertCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  {...register('priority')}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Low">Low (General Query)</option>
                  <option value="Medium">Medium (Minor Issue)</option>
                  <option value="High">High (Major Feature Broken)</option>
                  <option value="Critical">Critical (System Outage / Payment Failure)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Detailed Description</label>
            <textarea
              rows={5}
              {...register('description', { required: 'Detailed description is required' })}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Provide step-by-step details, error messages, environment details, or browser version..."
            ></textarea>
            {errors.description && <span className="text-[11px] text-rose-400 mt-1 block">{errors.description.message}</span>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              {loading ? 'Submitting Ticket...' : <><PlusCircle className="w-4 h-4" /> Submit Ticket</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
