import React, { useState, useMemo } from 'react';
import { 
  Target, 
  Search, 
  Plus, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Edit2, 
  Trash2, 
  Users, 
  GitPullRequest, 
  CalendarClock, 
  Sparkles, 
  Phone, 
  MapPin, 
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Lead, LeadStatus, Priority } from '../types';

export const LeadsView: React.FC = () => {
  const { 
    leads, 
    addLead, 
    updateLead, 
    deleteLead, 
    convertLeadToCustomer, 
    convertLeadToOpportunity, 
    employees, 
    catalog,
    setCurrentTab,
    showToast
  } = useCRM();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');
  const [filterEmployee, setFilterEmployee] = useState<string>('all');

  // Modals & Active lead
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [reassigningLead, setReassigningLead] = useState<Lead | null>(null);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);

  // Reassign state
  const [newAssignee, setNewAssignee] = useState(employees[0]?.id || 'emp-1');

  // Unique lists for filters
  const uniqueStates = useMemo(() => Array.from(new Set(leads.map(l => l.state))).sort(), [leads]);
  const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal Required', 'Negotiation', 'Converted', 'Lost'];

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        l.leadName.toLowerCase().includes(q) ||
        l.organization.toLowerCase().includes(q) ||
        l.contactPerson.toLowerCase().includes(q) ||
        l.productInterest.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q);

      const matchesStatus = filterStatus === 'all' || l.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || l.priority === filterPriority;
      const matchesState = filterState === 'all' || l.state === filterState;
      const matchesEmployee = filterEmployee === 'all' || l.assignedEmployeeId === filterEmployee;

      return matchesSearch && matchesStatus && matchesPriority && matchesState && matchesEmployee;
    });
  }, [leads, searchTerm, filterStatus, filterPriority, filterState, filterEmployee]);

  const activeLeadsCount = leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').length;
  const totalLeadValue = leads
    .filter(l => l.status !== 'Converted' && l.status !== 'Lost')
    .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads & Enquiries Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Capture, qualify, and convert road-marking RFQs and infrastructure project opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('ai-assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100/80 rounded-lg shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Lead Prioritization</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Capture New Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Active Enquiries</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{activeLeadsCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Estimated Value</span>
          <p className="text-xl font-bold text-blue-600 mt-1">₹{(totalLeadValue / 10000000).toFixed(2)} Cr</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Qualified & Negotiating</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {leads.filter(l => l.status === 'Qualified' || l.status === 'Negotiation').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Converted to Client/Opp</span>
          <p className="text-xl font-bold text-indigo-600 mt-1">
            {leads.filter(l => l.status === 'Converted').length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads, projects, organizations, materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* State */}
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All States</option>
            {uniqueStates.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Displaying <strong className="text-slate-800">{filteredLeads.length}</strong> enquiries
          </span>
          {(searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterState !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterPriority('all');
                setFilterState('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Lead / Project Inquiry</th>
                <th className="py-3 px-3">Organization</th>
                <th className="py-3 px-3">Product / Scope</th>
                <th className="py-3 px-3">Est. Value</th>
                <th className="py-3 px-3">Assigned Lead</th>
                <th className="py-3 px-3">Next Follow-up</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Target className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">No leads match the specified criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((l) => {
                  const manager = employees.find(e => e.id === l.assignedEmployeeId);
                  const isConverted = l.status === 'Converted';

                  return (
                    <tr 
                      key={l.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLeadForDetail(l)}
                    >
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 text-sm">
                          {l.leadName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {l.contactPerson} • {l.phone}
                        </div>
                      </td>

                      {/* Organization */}
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-800">{l.organization}</div>
                        <div className="text-[11px] text-slate-400">{l.city}, {l.state}</div>
                      </td>

                      {/* Product Interest */}
                      <td className="py-3.5 px-3 max-w-xs">
                        <div className="text-slate-800 font-medium truncate" title={l.productInterest}>
                          {l.productInterest}
                        </div>
                        <span className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          l.priority === 'High' ? 'bg-rose-50 text-rose-700' :
                          l.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {l.priority} Priority
                        </span>
                      </td>

                      {/* Est Value */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 text-sm">
                          ₹{(l.estimatedValue / 100000).toFixed(2)} L
                        </span>
                      </td>

                      {/* Assigned Manager */}
                      <td className="py-3.5 px-3">
                        <span className="text-slate-700 font-medium">{manager?.name || 'Unassigned'}</span>
                      </td>

                      {/* Follow-up */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {l.nextFollowUp || 'TBD'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          l.status === 'Converted' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' :
                          l.status === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                          l.status === 'Negotiation' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                          l.status === 'Proposal Required' ? 'bg-sky-50 text-sky-700 border border-sky-200/60' :
                          l.status === 'Lost' ? 'bg-rose-50 text-rose-700 border border-rose-200/60' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {l.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {!isConverted && (
                            <button
                              onClick={() => {
                                convertLeadToOpportunity(l.id);
                              }}
                              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              title="Convert to Sales Opportunity"
                            >
                              <GitPullRequest className="w-3 h-3" />
                              <span>Convert Opp</span>
                            </button>
                          )}

                          <button
                            onClick={() => setEditingLead(l)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                            title="Edit Lead"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingLeadId(l.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLeadForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Inquiry Dossier</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedLeadForDetail.leadName}</h3>
                <p className="text-xs text-slate-500">{selectedLeadForDetail.organization} • {selectedLeadForDetail.city}, {selectedLeadForDetail.state}</p>
              </div>
              <button onClick={() => setSelectedLeadForDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block">Contact Person</span>
                <span className="font-semibold text-slate-800">{selectedLeadForDetail.contactPerson}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block">Phone / Mobile</span>
                <span className="font-semibold text-slate-800">{selectedLeadForDetail.phone}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block">Estimated Deal Value</span>
                <span className="font-bold text-slate-900">₹{selectedLeadForDetail.estimatedValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block">Lead Source</span>
                <span className="font-semibold text-slate-800">{selectedLeadForDetail.leadSource}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-400 block font-semibold mb-1">Product / Technical Specification</span>
              <p className="text-slate-700 leading-relaxed">{selectedLeadForDetail.productInterest}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-400 block font-semibold mb-1">Commercial Notes & Requirements</span>
              <p className="text-slate-700 leading-relaxed">{selectedLeadForDetail.notes}</p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  convertLeadToCustomer(selectedLeadForDetail.id);
                  setSelectedLeadForDetail(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Create Customer Record</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLeadForDetail(null)}
                  className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    convertLeadToOpportunity(selectedLeadForDetail.id);
                    setSelectedLeadForDetail(null);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <GitPullRequest className="w-3.5 h-3.5" />
                  <span>Push to Pipeline</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Lead Modal */}
      {(isCreateModalOpen || editingLead) && (
        <LeadFormModal
          isOpen={isCreateModalOpen || !!editingLead}
          lead={editingLead}
          employees={employees}
          catalog={catalog}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingLead(null);
          }}
          onSave={(data) => {
            if (editingLead) {
              updateLead(editingLead.id, data);
            } else {
              addLead(data as any);
            }
            setIsCreateModalOpen(false);
            setEditingLead(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingLeadId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete Lead Record</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this lead? This action cannot be reversed.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingLeadId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteLead(deletingLeadId);
                  setDeletingLeadId(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Lead Create/Edit Form Modal
interface LeadFormModalProps {
  isOpen: boolean;
  lead: Lead | null;
  employees: any[];
  catalog: any[];
  onClose: () => void;
  onSave: (data: Partial<Lead>) => void;
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({
  lead,
  employees,
  catalog,
  onClose,
  onSave
}) => {
  const [leadName, setLeadName] = useState(lead?.leadName || '');
  const [organization, setOrganization] = useState(lead?.organization || '');
  const [contactPerson, setContactPerson] = useState(lead?.contactPerson || '');
  const [phone, setPhone] = useState(lead?.phone || '');
  const [email, setEmail] = useState(lead?.email || '');
  const [state, setState] = useState(lead?.state || 'Maharashtra');
  const [city, setCity] = useState(lead?.city || '');
  const [productInterest, setProductInterest] = useState(lead?.productInterest || catalog[0]?.name || '');
  const [estimatedValue, setEstimatedValue] = useState<number>(lead?.estimatedValue || 3500000);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(lead?.assignedEmployeeId || employees[0]?.id || 'emp-1');
  const [priority, setPriority] = useState<Priority>(lead?.priority || 'High');
  const [status, setStatus] = useState<LeadStatus>(lead?.status || 'New');
  const [leadSource, setLeadSource] = useState(lead?.leadSource || 'Direct Project Inquiry');
  const [nextFollowUp, setNextFollowUp] = useState(lead?.nextFollowUp || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]);
  const [notes, setNotes] = useState(lead?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      leadName,
      organization,
      contactPerson,
      phone,
      email,
      state,
      city,
      productInterest,
      estimatedValue: Number(estimatedValue),
      assignedEmployeeId,
      priority,
      status,
      leadSource,
      nextFollowUp,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {lead ? 'Edit Lead / Inquiry' : 'Capture New Lead'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry / Project Title *</label>
              <input
                type="text"
                required
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="e.g. Ganga Expressway Package 8 Lane Marking Supply"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization *</label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. PNC Infratech Ltd / MSRDC"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Er. Vivek Srivastava"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Product / Material Scope</label>
              <input
                type="text"
                value={productInterest}
                onChange={(e) => setProductInterest(e.target.value)}
                placeholder="e.g. Thermoplastic Yellow & White (300 MT)"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Value (₹)</label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State / Territory</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Account Lead</label>
              <select
                value={assignedEmployeeId}
                onChange={(e) => setAssignedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white outline-none"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Stage</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white outline-none"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Required">Proposal Required</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Commercial Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Delivery batch requirements, test certifications, road package details..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
            >
              {lead ? 'Update Lead' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
