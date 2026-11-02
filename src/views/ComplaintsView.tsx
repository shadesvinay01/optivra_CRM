import React, { useState } from 'react';
import { 
  AlertCircle, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Star, 
  Users, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  X, 
  ShieldAlert,
  HardHat
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Complaint, ComplaintStatus, Priority } from '../types';

export const ComplaintsView: React.FC = () => {
  const { 
    complaints, 
    addComplaint, 
    updateComplaint, 
    resolveComplaint, 
    customers, 
    employees, 
    openCustomerProfile,
    showToast 
  } = useCRM();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resolvingComplaint, setResolvingComplaint] = useState<Complaint | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const filteredComplaints = complaints.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      c.complaintId.toLowerCase().includes(q) ||
      c.customerName.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || c.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openTicketsCount = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const resolvedTicketsCount = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingComplaint || !resolutionText.trim()) return;
    resolveComplaint(resolvingComplaint.id, resolutionText);
    setResolvingComplaint(null);
    setResolutionText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Complaints & Quality Feedback</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Resolve technical issues with retroreflectivity, paint curing, nozzle clogging, and batch consistency.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Issue Ticket</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Open Support Tickets</span>
          <p className="text-xl font-bold text-rose-600 mt-1">{openTicketsCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Resolved Cases</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">{resolvedTicketsCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Avg SLA Resolution</span>
          <p className="text-xl font-bold text-slate-900 mt-1">28 Hours</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Customer CSAT Rating</span>
          <p className="text-xl font-bold text-amber-500 mt-1 flex items-center gap-1">
            4.8 <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search complaint ID, client, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
        >
          <option value="all">All Ticket Statuses</option>
          <option value="Open">Open</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
        >
          <option value="all">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Quality Category</th>
                <th className="py-3 px-3">Issue Description</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Assigned Lead</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action / Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.map(cmp => {
                const manager = employees.find(e => e.id === cmp.assignedEmployeeId);
                const isResolved = cmp.status === 'Resolved' || cmp.status === 'Closed';

                return (
                  <tr key={cmp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{cmp.complaintId}</td>
                    <td className="py-3.5 px-3">
                      <div 
                        onClick={() => openCustomerProfile(cmp.customerId)}
                        className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer"
                      >
                        {cmp.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400">Reported: {cmp.dateReported}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-800">{cmp.category}</span>
                    </td>

                    <td className="py-3.5 px-3 max-w-xs">
                      <p className="text-slate-600 line-clamp-2">{cmp.description}</p>
                      {cmp.resolutionNotes && (
                        <p className="text-[11px] text-emerald-700 bg-emerald-50/80 p-1.5 rounded mt-1 border border-emerald-100">
                          <strong>Resolution:</strong> {cmp.resolutionNotes}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        cmp.priority === 'Critical' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                        cmp.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {cmp.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {manager?.name || 'Technical Team'}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isResolved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        cmp.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isResolved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {cmp.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {!isResolved ? (
                        <button
                          onClick={() => setResolvingComplaint(cmp)}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                        >
                          Resolve Ticket
                        </button>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          {cmp.rating && (
                            <div className="flex items-center text-amber-500 font-bold text-xs mr-2">
                              {cmp.rating} <Star className="w-3.5 h-3.5 fill-amber-400" />
                            </div>
                          )}
                          <span className="text-slate-400 text-xs">Closed</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolve Ticket Modal */}
      {resolvingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Record Technical Resolution</h3>
            <p className="text-xs text-slate-500">
              Provide resolution notes for {resolvingComplaint.complaintId} ({resolvingComplaint.customerName}).
            </p>
            <form onSubmit={handleResolveSubmit} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="e.g. Deputed Sunil Choudhary to site. Recalibrated bead dispenser drop speed to 250 g/m2. Fresh retroreflectivity reading tested 385 mcd."
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingComplaint(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Issue Modal */}
      {isModalOpen && (
        <LogComplaintModal
          isOpen={isModalOpen}
          customers={customers}
          employees={employees}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            addComplaint(data);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

interface LogModalProps {
  isOpen: boolean;
  customers: any[];
  employees: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const LogComplaintModal: React.FC<LogModalProps> = ({ customers, employees, onClose, onSave }) => {
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [category, setCategory] = useState<any>('Retroreflectivity Issue');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(employees[1]?.id || 'emp-2');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = customers.find(c => c.id === customerId);
    onSave({
      customerId,
      customerName: matched?.name || 'Customer',
      category,
      description,
      priority,
      assignedEmployeeId,
      dateReported: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'Open'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Log Customer Quality Ticket</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
            >
              <option value="Retroreflectivity Issue">Retroreflectivity Below Spec</option>
              <option value="Drying Time / Curing">Slow Drying / Curing on Bitumen</option>
              <option value="Nozzle / Machine Clogging">Nozzle / Machine Clogging</option>
              <option value="Adhesion Failure">Adhesion Failure on Concrete</option>
              <option value="Batch Shade Mismatch">Batch Shade Variation</option>
              <option value="Packaging / Transit">Packaging / Transit Damage</option>
              <option value="Documentation / Billing">Documentation / Billing Error</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Lead</label>
              <select
                value={assignedEmployeeId}
                onChange={(e) => setAssignedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description & Batch Details</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State batch number, road package, and observed discrepancy..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs"
            >
              Open Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
