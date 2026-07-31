import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import { userApi } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { Modal } from '../components/common/Modal';
import { formatDate } from '../utils/formatters';
import {
  MessageSquare,
  UserCheck,
  Paperclip,
  Clock,
  Send,
  Upload,
  Shield,
  FileText,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Activity
} from 'lucide-react';

export const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isAgent } = useAuth();
  const { addToast } = useNotification();

  const [ticket, setTicket] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & form state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Comment state
  const [commentText, setCommentText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // File Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await ticketApi.getTicketById(id);
      setTicket(res.data.data);
      setNewStatus(res.data.data.status);
      setResolutionNotes(res.data.data.resolution_notes || '');
    } catch (err) {
      addToast('Failed to load ticket details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    if (isAdmin) {
      userApi.getUsers({ role_id: 2 }).then(res => setAgents(res.data.data)).catch(() => {});
    }
  }, [id, isAdmin]);

  const handleAssignAgent = async () => {
    if (!selectedAgentId) return;
    try {
      await ticketApi.assignTicket(id, selectedAgentId);
      addToast('Agent assigned successfully.', 'success');
      setShowAssignModal(false);
      fetchDetails();
    } catch (err) {
      addToast('Failed to assign agent.', 'error');
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await ticketApi.updateStatus(id, newStatus, resolutionNotes);
      addToast(`Ticket status updated to ${newStatus}.`, 'success');
      setShowStatusModal(false);
      fetchDetails();
    } catch (err) {
      addToast('Failed to update status.', 'error');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      await ticketApi.addComment(id, commentText, isInternal);
      setCommentText('');
      addToast('Comment posted.', 'success');
      fetchDetails();
    } catch (err) {
      addToast('Failed to post comment.', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      await ticketApi.uploadAttachment(id, formData);
      addToast('Attachment uploaded successfully.', 'success');
      setUploadFile(null);
      fetchDetails();
    } catch (err) {
      addToast('Failed to upload file.', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (loading || !ticket) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading ticket workspace...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Queue
          </button>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-blue-400">{ticket.ticket_code}</span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">{ticket.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl"
            >
              <UserCheck className="w-4 h-4 text-purple-400" /> Assign Agent
            </button>
          )}

          {(isAdmin || isAgent) && (
            <button
              onClick={() => setShowStatusModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20"
            >
              <CheckCircle2 className="w-4 h-4" /> Update Status
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Timeline & Discussion (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Issue Description Box */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={ticket.customer_avatar || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'}
                  alt="Customer"
                  className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-white">{ticket.customer_name}</div>
                  <div className="text-[10px] text-slate-400">{ticket.customer_email}</div>
                </div>
              </div>
              <span className="text-[11px] text-slate-500">{formatDate(ticket.created_at)}</span>
            </div>

            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {ticket.description}
            </div>

            {ticket.resolution_notes && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-1">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Resolution Summary Notes:
                </div>
                <div className="text-xs text-slate-300">{ticket.resolution_notes}</div>
              </div>
            )}
          </div>

          {/* Conversation Comments Stream */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" /> Discussion Thread ({ticket.comments?.length || 0})
            </h3>

            <div className="space-y-4">
              {ticket.comments?.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/30 border border-slate-800/60 rounded-2xl">
                  No discussion comments posted yet.
                </div>
              ) : (
                ticket.comments.map(c => (
                  <div
                    key={c.id}
                    className={`p-5 rounded-2xl border transition-colors ${
                      c.is_internal
                        ? 'bg-amber-500/5 border-amber-500/30'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={c.user_avatar || 'https://ui-avatars.com/api/?name=User'}
                          alt="Avatar"
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <span className="text-xs font-bold text-white">{c.user_name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-bold">
                          {c.user_role}
                        </span>
                        {c.is_internal === 1 && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Internal Agent Note
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">{formatDate(c.created_at)}</span>
                    </div>
                    <div className="text-xs text-slate-300 pl-9 leading-relaxed">{c.message}</div>
                  </div>
                ))
              )}
            </div>

            {/* Post Comment Input Form */}
            <form onSubmit={handleAddComment} className="p-4 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type your reply or status comment..."
                className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
              ></textarea>

              <div className="flex items-center justify-between">
                {(isAdmin || isAgent) ? (
                  <label className="flex items-center gap-2 text-xs text-amber-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0"
                    />
                    <Lock className="w-3.5 h-3.5" /> Mark as internal agent note (invisible to customer)
                  </label>
                ) : (
                  <div></div>
                )}

                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Info & Attachments (Right Column) */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Ticket Information</h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Category</span>
                <span className="font-semibold text-slate-200">{ticket.category_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Support Agent</span>
                <span className="font-semibold text-blue-400">{ticket.assigned_agent_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">First Response Time</span>
                <span className="font-semibold text-slate-200">
                  {ticket.first_responded_at ? formatDate(ticket.first_responded_at) : 'Awaiting agent response'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Resolution Timestamp</span>
                <span className="font-semibold text-slate-200">
                  {ticket.resolved_at ? formatDate(ticket.resolved_at) : 'Not resolved yet'}
                </span>
              </div>
            </div>
          </div>

          {/* Attachments Card */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Attachments ({ticket.attachments?.length || 0})</span>
              <Paperclip className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="space-y-2">
              {ticket.attachments?.length === 0 ? (
                <p className="text-xs text-slate-500">No file attachments uploaded.</p>
              ) : (
                ticket.attachments.map(att => (
                  <div key={att.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-xs text-slate-300 font-semibold truncate">{att.file_name}</span>
                    </div>
                    <a
                      href={att.file_path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-400 hover:underline font-bold"
                    >
                      Download
                    </a>
                  </div>
                ))
              )}
            </div>

            {/* Upload Attachment Box */}
            <form onSubmit={handleFileUpload} className="pt-3 border-t border-slate-800 space-y-3">
              <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
              />
              <button
                type="submit"
                disabled={uploading || !uploadFile}
                className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                <Upload className="w-3.5 h-3.5" /> {uploading ? 'Uploading...' : 'Upload Attachment'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ASSIGNMENT MODAL (ADMIN) */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Ticket to Agent">
        <div className="space-y-4">
          <p className="text-xs text-slate-400">Select a Support Agent to take ownership of ticket {ticket.ticket_code}.</p>
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
          >
            <option value="">Select Agent...</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
            ))}
          </select>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setShowAssignModal(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignAgent}
              disabled={!selectedAgentId}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      </Modal>

      {/* UPDATE STATUS MODAL */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Update Ticket Status">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
            >
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Resolution Summary Notes</label>
            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Explain fix details or steps taken..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
