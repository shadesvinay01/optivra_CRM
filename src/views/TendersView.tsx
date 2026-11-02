import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Download, 
  Edit2, 
  Trash2, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  X, 
  Check, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Tender, TenderStatus, Priority } from '../types';

export const TendersView: React.FC = () => {
  const { 
    tenders, 
    addTender, 
    updateTender, 
    deleteTender, 
    updateTenderStatus, 
    employees, 
    setCurrentTab,
    showToast 
  } = useCRM();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTender, setEditingTender] = useState<Tender | null>(null);
  const [selectedTenderDetail, setSelectedTenderDetail] = useState<Tender | null>(null);
  const [deletingTenderId, setDeletingTenderId] = useState<string | null>(null);

  const statuses: TenderStatus[] = [
    'Identified', 
    'Under Evaluation', 
    'Documentation', 
    'Submitted', 
    'Technical Evaluation', 
    'Financial Evaluation', 
    'Won', 
    'Lost'
  ];

  const uniqueStates = useMemo(() => Array.from(new Set(tenders.map(t => t.state))).sort(), [tenders]);
  const deptCategories = ['NHAI', 'State PWD', 'State Infrastructure Corp', 'Smart City', 'MoRTH'];

  // Filtered Tenders
  const filteredTenders = useMemo(() => {
    return tenders.filter(t => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        t.tenderTitle.toLowerCase().includes(q) ||
        t.tenderId.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.state.toLowerCase().includes(q);

      const matchesDept = filterDept === 'all' || t.departmentCategory === filterDept;
      const matchesState = filterState === 'all' || t.state === filterState;
      const matchesStatus = filterStatus === 'all' || t.approvalStatus === filterStatus;

      return matchesSearch && matchesDept && matchesState && matchesStatus;
    }).sort((a, b) => new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime());
  }, [tenders, searchTerm, filterDept, filterState, filterStatus]);

  // Derived metrics
  const totalTenders = tenders.length;
  const activeBids = tenders.filter(t => t.approvalStatus !== 'Won' && t.approvalStatus !== 'Lost').length;
  const activeTenderValue = tenders
    .filter(t => t.approvalStatus !== 'Won' && t.approvalStatus !== 'Lost')
    .reduce((sum, t) => sum + t.estimatedValue, 0);

  const totalEMDAtRisk = tenders
    .filter(t => t.approvalStatus === 'Submitted' || t.approvalStatus === 'Technical Evaluation' || t.approvalStatus === 'Financial Evaluation')
    .reduce((sum, t) => sum + (t.earnestMoneyDeposit || 0), 0);

  const wonTenderValue = tenders
    .filter(t => t.approvalStatus === 'Won')
    .reduce((sum, t) => sum + t.estimatedValue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tender & Government Project Workspace</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor NHAI, MoRTH, and State PWD road safety, delineation & marking tenders across India.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Toggle view */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'calendar' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Deadline Timeline
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register Tender</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Active Bids</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{activeBids} Projects</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Active Tender Value</span>
          <p className="text-xl font-bold text-purple-600 mt-1">₹{(activeTenderValue / 10000000).toFixed(2)} Cr</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">EMD Bank Guarantees</span>
          <p className="text-xl font-bold text-amber-600 mt-1">₹{(totalEMDAtRisk / 100000).toFixed(1)} Lakhs</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Won Project Contracts</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">₹{(wonTenderValue / 10000000).toFixed(2)} Cr</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tender ID, state, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
            />
          </div>

          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Authorities (NHAI/PWD)</option>
            {deptCategories.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All States</option>
            {uniqueStates.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Stages</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main List View */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Tender Details & NIT</th>
                  <th className="py-3 px-3">Authority / Dept</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Estimated Value</th>
                  <th className="py-3 px-3">EMD Amount</th>
                  <th className="py-3 px-3">Submission Deadline</th>
                  <th className="py-3 px-3">Stage / Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-700">No tenders match your filter criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredTenders.map(tnd => {
                    const deadline = new Date(tnd.submissionDeadline);
                    const today = new Date();
                    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    const isUrgent = diffDays <= 4 && diffDays >= 0 && tnd.approvalStatus !== 'Won' && tnd.approvalStatus !== 'Lost';

                    return (
                      <tr 
                        key={tnd.id} 
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        onClick={() => setSelectedTenderDetail(tnd)}
                      >
                        <td className="py-3.5 px-4 max-w-sm">
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 text-sm line-clamp-1">
                            {tnd.tenderTitle}
                          </div>
                          <div className="text-[11px] font-mono text-purple-700 mt-0.5">
                            {tnd.tenderId}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-800 block">{tnd.departmentCategory}</span>
                          <span className="text-[11px] text-slate-400 truncate block max-w-[140px]">{tnd.department}</span>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="text-slate-800 font-medium">{tnd.state}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[120px]">{tnd.location}</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-900 text-sm">
                            ₹{(tnd.estimatedValue / 10000000).toFixed(2)} Cr
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-slate-700 font-medium">
                          ₹{(tnd.earnestMoneyDeposit / 100000).toFixed(1)} L
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-medium text-slate-800 block">{tnd.submissionDeadline}</span>
                          <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded-full mt-0.5 ${
                            isUrgent 
                              ? 'bg-rose-100 text-rose-700 animate-pulse' 
                              : diffDays < 0 ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-700'
                          }`}>
                            <Clock className="w-2.5 h-2.5 mr-1" />
                            {diffDays < 0 ? 'Expired' : diffDays === 0 ? 'Due Today' : `${diffDays} days left`}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <select
                            value={tnd.approvalStatus}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateTenderStatus(tnd.id, e.target.value as TenderStatus)}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border outline-none ${
                              tnd.approvalStatus === 'Won' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                              tnd.approvalStatus === 'Financial Evaluation' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                              tnd.approvalStatus === 'Technical Evaluation' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                              tnd.approvalStatus === 'Submitted' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                              tnd.approvalStatus === 'Lost' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                              'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {statuses.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedTenderDetail(tnd)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded"
                              title="Tender Dossier & Documents"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingTender(tnd)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingTenderId(tnd.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
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
      ) : (
        /* Tender Timeline Calendar View */
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              Chronological Submission Milestones
            </h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-200">
              {filteredTenders.map((tnd) => (
                <div key={tnd.id} className="relative group">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-purple-600 ring-4 ring-white" />
                  <div className="bg-slate-50/80 hover:bg-purple-50/40 p-4 rounded-xl border border-slate-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
                          {tnd.departmentCategory}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{tnd.tenderId}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{tnd.tenderTitle}</h4>
                      <p className="text-xs text-slate-500">{tnd.location} • EMD: ₹{(tnd.earnestMoneyDeposit / 100000).toFixed(1)} Lakhs</p>
                    </div>

                    <div className="sm:text-right flex-shrink-0">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        ₹{(tnd.estimatedValue / 10000000).toFixed(2)} Cr
                      </span>
                      <span className="text-xs font-bold text-purple-700 bg-white px-2.5 py-1 rounded-full border border-purple-200 shadow-2xs mt-1 inline-block">
                        Deadline: {tnd.submissionDeadline}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tender Details & Documents Modal */}
      {selectedTenderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
                  {selectedTenderDetail.departmentCategory}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedTenderDetail.tenderTitle}</h3>
                <p className="text-xs font-mono text-purple-700">{selectedTenderDetail.tenderId}</p>
              </div>
              <button onClick={() => setSelectedTenderDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block">Estimated Value</span>
                <span className="font-bold text-slate-900 text-sm">₹{(selectedTenderDetail.estimatedValue / 10000000).toFixed(2)} Cr</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block">EMD Amount</span>
                <span className="font-bold text-slate-900">₹{(selectedTenderDetail.earnestMoneyDeposit / 100000).toFixed(1)} L</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block">Tender Fee</span>
                <span className="font-bold text-slate-900">₹{selectedTenderDetail.tenderFee?.toLocaleString('en-IN') || '25,000'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block">Submission Deadline</span>
                <span className="font-bold text-purple-700">{selectedTenderDetail.submissionDeadline}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Project Description & Scope:</span>
              <p className="text-slate-600 leading-relaxed">{selectedTenderDetail.projectDescription}</p>
              <p className="text-slate-500 pt-1 font-medium">Location: {selectedTenderDetail.location}, {selectedTenderDetail.state}</p>
            </div>

            {/* Document Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Submitted NIT & Technical Qualification Files ({selectedTenderDetail.documents.length})
              </span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {selectedTenderDetail.documents.map((doc, idx) => (
                  <div key={idx} className="p-2.5 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <div>
                        <span className="font-semibold text-slate-800">{doc.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2">{doc.size} • Uploaded {doc.uploadedAt}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast(`Downloading ${doc.name}...`)}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100 text-xs text-purple-900">
              <strong>Evaluation Notes:</strong> {selectedTenderDetail.notes}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedTenderDetail(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register/Edit Tender Modal */}
      {(isCreateModalOpen || editingTender) && (
        <TenderFormModal
          isOpen={isCreateModalOpen || !!editingTender}
          tender={editingTender}
          employees={employees}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingTender(null);
          }}
          onSave={(data) => {
            if (editingTender) {
              updateTender(editingTender.id, data);
            } else {
              addTender(data as any);
            }
            setIsCreateModalOpen(false);
            setEditingTender(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingTenderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete Tender Record</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this tender bid record?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingTenderId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTender(deletingTenderId);
                  setDeletingTenderId(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
              >
                Delete Tender
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Form Modal for Tenders
interface TenderFormModalProps {
  isOpen: boolean;
  tender: Tender | null;
  employees: any[];
  onClose: () => void;
  onSave: (data: Partial<Tender>) => void;
}

const TenderFormModal: React.FC<TenderFormModalProps> = ({
  tender,
  employees,
  onClose,
  onSave
}) => {
  const [tenderTitle, setTenderTitle] = useState(tender?.tenderTitle || '');
  const [tenderId, setTenderId] = useState(tender?.tenderId || 'NHAI/RO/MUM/2026/01');
  const [department, setDepartment] = useState(tender?.department || 'National Highways Authority of India');
  const [departmentCategory, setDepartmentCategory] = useState<any>(tender?.departmentCategory || 'NHAI');
  const [state, setState] = useState(tender?.state || 'Maharashtra');
  const [location, setLocation] = useState(tender?.location || 'Western Corridor NH-48');
  const [projectDescription, setProjectDescription] = useState(tender?.projectDescription || 'Supply and application of thermoplastic road markings.');
  const [estimatedValue, setEstimatedValue] = useState<number>(tender?.estimatedValue || 45000000);
  const [submissionDeadline, setSubmissionDeadline] = useState(tender?.submissionDeadline || '2026-11-25');
  const [approvalStatus, setApprovalStatus] = useState<TenderStatus>(tender?.approvalStatus || 'Documentation');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(tender?.assignedEmployeeId || employees[0]?.id || 'emp-1');
  const [priority, setPriority] = useState<Priority>(tender?.priority || 'High');
  const [earnestMoneyDeposit, setEarnestMoneyDeposit] = useState<number>(tender?.earnestMoneyDeposit || 900000);
  const [tenderFee, setTenderFee] = useState<number>(tender?.tenderFee || 25000);
  const [notes, setNotes] = useState(tender?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      tenderTitle,
      tenderId,
      department,
      departmentCategory,
      state,
      location,
      projectDescription,
      estimatedValue: Number(estimatedValue),
      tenderPublicationDate: tender?.tenderPublicationDate || new Date().toISOString().split('T')[0],
      submissionDeadline,
      approvalStatus,
      assignedEmployeeId,
      priority,
      earnestMoneyDeposit: Number(earnestMoneyDeposit),
      tenderFee: Number(tenderFee),
      documents: tender?.documents || [
        { name: 'NIT_Published_Notice.pdf', size: '3.8 MB', uploadedAt: new Date().toISOString().split('T')[0] }
      ],
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {tender ? 'Edit Tender Record' : 'Register Government Tender'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tender Title *</label>
              <input
                type="text"
                required
                value={tenderTitle}
                onChange={(e) => setTenderTitle(e.target.value)}
                placeholder="e.g. Periodic Maintenance & Thermoplastic Lane Marking on NH-48"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIT Number / Tender ID *</label>
              <input
                type="text"
                required
                value={tenderId}
                onChange={(e) => setTenderId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none font-mono focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department Category</label>
              <select
                value={departmentCategory}
                onChange={(e) => setDepartmentCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white outline-none"
              >
                <option value="NHAI">NHAI (National Highways)</option>
                <option value="State PWD">State PWD</option>
                <option value="State Infrastructure Corp">State Corp (MSRDC, UPSHA)</option>
                <option value="Smart City">Smart City Mission</option>
                <option value="MoRTH">MoRTH Direct</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tender Value (₹)</label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setEstimatedValue(val);
                  setEarnestMoneyDeposit(Math.round(val * 0.02));
                }}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none font-bold focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">EMD (Earnest Money Deposit ₹)</label>
              <input
                type="number"
                value={earnestMoneyDeposit}
                onChange={(e) => setEarnestMoneyDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Highway Section</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Deadline</label>
              <input
                type="date"
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none font-bold text-purple-700 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Stage</label>
              <select
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value as TenderStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white outline-none"
              >
                <option value="Identified">Identified</option>
                <option value="Under Evaluation">Under Evaluation</option>
                <option value="Documentation">Documentation</option>
                <option value="Submitted">Submitted</option>
                <option value="Technical Evaluation">Technical Evaluation</option>
                <option value="Financial Evaluation">Financial Evaluation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project Description</label>
              <textarea
                rows={2}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Qualification & Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Joint venture requirements, batch test certificates, applicator credentials..."
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
              {tender ? 'Update Tender' : 'Register Tender'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
