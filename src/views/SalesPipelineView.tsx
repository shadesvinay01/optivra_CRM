import React, { useState, useMemo } from 'react';
import { 
  GitPullRequest, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Clock, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  X,
  FileText,
  DollarSign,
  Calendar,
  Layers,
  Table as TableIcon,
  Kanban as KanbanIcon
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Opportunity, PipelineStage, Priority } from '../types';

export const SalesPipelineView: React.FC = () => {
  const { 
    opportunities, 
    addOpportunity, 
    updateOpportunity, 
    deleteOpportunity, 
    updateOpportunityStage, 
    customers, 
    employees, 
    setCurrentTab,
    openCustomerProfile,
    showToast
  } = useCRM();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [deletingOppId, setDeletingOppId] = useState<string | null>(null);

  // Drag and drop tracking
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  const stages: PipelineStage[] = [
    'New Opportunity', 
    'Qualified', 
    'Quotation Sent', 
    'Negotiation', 
    'Won', 
    'Lost'
  ];

  // Filtered Opportunities
  const filteredOpps = useMemo(() => {
    return opportunities.filter(o => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        o.name.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q);

      const matchesEmployee = filterEmployee === 'all' || o.assignedEmployeeId === filterEmployee;
      const matchesPriority = filterPriority === 'all' || o.priority === filterPriority;

      return matchesSearch && matchesEmployee && matchesPriority;
    });
  }, [opportunities, searchTerm, filterEmployee, filterPriority]);

  // Derived calculations
  const totalOpenDeals = filteredOpps.filter(o => o.stage !== 'Won' && o.stage !== 'Lost').length;
  const totalPipelineValue = filteredOpps
    .filter(o => o.stage !== 'Won' && o.stage !== 'Lost')
    .reduce((sum, o) => sum + o.dealValue, 0);

  const weightedPipelineValue = filteredOpps
    .filter(o => o.stage !== 'Won' && o.stage !== 'Lost')
    .reduce((sum, o) => sum + (o.dealValue * (o.probability / 100)), 0);

  const wonDealsValue = filteredOpps
    .filter(o => o.stage === 'Won')
    .reduce((sum, o) => sum + o.dealValue, 0);

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedOppId(id);
  };

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedOppId;
    if (id) {
      updateOpportunityStage(id, targetStage);
    }
    setDraggedOppId(null);
    setDragOverStage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Pipeline</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track deal stages, closing probabilities, and weighted pipeline value for road contracts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'kanban' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Kanban Board View"
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table List View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Active Opportunities</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{totalOpenDeals} Deals</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Pipeline Value</span>
          <p className="text-xl font-bold text-blue-600 mt-1">₹{(totalPipelineValue / 10000000).toFixed(2)} Cr</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Weighted Forecast Value</span>
          <p className="text-xl font-bold text-indigo-600 mt-1">₹{(weightedPipelineValue / 10000000).toFixed(2)} Cr</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Won Contracts Value</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">₹{(wonDealsValue / 10000000).toFixed(2)} Cr</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter deals or customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
            />
          </div>

          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Sales Owners</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 hidden lg:inline">
          Tip: Drag cards across stages or select stage directly from card
        </span>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
          {stages.map((stage) => {
            const stageOpps = filteredOpps.filter(o => o.stage === stage);
            const stageTotal = stageOpps.reduce((sum, o) => sum + o.dealValue, 0);
            const isDropTarget = dragOverStage === stage;

            const headerColors: Record<PipelineStage, string> = {
              'New Opportunity': 'border-t-blue-500 bg-blue-50/30 text-blue-900',
              'Qualified': 'border-t-emerald-500 bg-emerald-50/30 text-emerald-900',
              'Quotation Sent': 'border-t-sky-500 bg-sky-50/30 text-sky-900',
              'Negotiation': 'border-t-amber-500 bg-amber-50/30 text-amber-900',
              'Won': 'border-t-teal-500 bg-teal-50/30 text-teal-900',
              'Lost': 'border-t-rose-400 bg-rose-50/30 text-rose-900'
            };

            return (
              <div
                key={stage}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage)}
                className={`bg-slate-100/70 rounded-xl p-2.5 flex flex-col min-h-[520px] transition-all border ${
                  isDropTarget 
                    ? 'border-blue-500 ring-2 ring-blue-400/30 bg-blue-50/40' 
                    : 'border-slate-200/80'
                }`}
              >
                {/* Column Header */}
                <div className={`p-2.5 rounded-lg border-t-2 shadow-2xs mb-2.5 bg-white ${headerColors[stage]}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider">{stage}</span>
                    <span className="text-xs font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                      {stageOpps.length}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 mt-1">
                    ₹{(stageTotal / 100000).toFixed(1)} Lakhs
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[680px]">
                  {stageOpps.length === 0 ? (
                    <div className="h-28 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                      Drop here
                    </div>
                  ) : (
                    stageOpps.map((opp) => {
                      const manager = employees.find(e => e.id === opp.assignedEmployeeId);

                      return (
                        <div
                          key={opp.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, opp.id)}
                          className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing group space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              opp.priority === 'High' ? 'bg-rose-50 text-rose-700' :
                              opp.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {opp.priority}
                            </span>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditingOpportunity(opp)}
                                className="p-0.5 text-slate-400 hover:text-slate-700 rounded"
                                title="Edit"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setDeletingOppId(opp.id)}
                                className="p-0.5 text-slate-400 hover:text-rose-600 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                              {opp.name}
                            </h4>
                            <p 
                              onClick={() => openCustomerProfile(opp.customerId)}
                              className="text-[11px] text-slate-500 hover:text-blue-600 cursor-pointer truncate mt-0.5"
                              title="Click to view client file"
                            >
                              {opp.customerName}
                            </p>
                          </div>

                          <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Deal Value</span>
                              <span className="text-xs font-bold text-slate-900">
                                ₹{(opp.dealValue / 100000).toFixed(1)} L
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block">Probability</span>
                              <span className="text-xs font-semibold text-emerald-700">
                                {opp.probability}%
                              </span>
                            </div>
                          </div>

                          {/* Footer Info & Stage Quick Select */}
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                            <span className="truncate max-w-[90px] text-slate-600 font-medium">
                              {manager?.name.split(' ')[0] || 'Team'}
                            </span>

                            {/* Stage Selector Alternative to Drag */}
                            <select
                              value={opp.stage}
                              onChange={(e) => updateOpportunityStage(opp.id, e.target.value as PipelineStage)}
                              className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 outline-none cursor-pointer"
                            >
                              {stages.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Deal Value</th>
                  <th className="py-3 px-3">Stage</th>
                  <th className="py-3 px-3">Probability</th>
                  <th className="py-3 px-3">Weighted Value</th>
                  <th className="py-3 px-3">Account Lead</th>
                  <th className="py-3 px-3">Expected Close</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOpps.map(opp => {
                  const manager = employees.find(e => e.id === opp.assignedEmployeeId);
                  const weighted = opp.dealValue * (opp.probability / 100);

                  return (
                    <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{opp.name}</td>
                      <td className="py-3 px-3 text-slate-700">{opp.customerName}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">₹{opp.dealValue.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3">
                        <select
                          value={opp.stage}
                          onChange={(e) => updateOpportunityStage(opp.id, e.target.value as PipelineStage)}
                          className="text-xs font-semibold bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 outline-none"
                        >
                          {stages.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-700">{opp.probability}%</td>
                      <td className="py-3 px-3 font-medium text-slate-700">₹{(weighted / 100000).toFixed(1)} L</td>
                      <td className="py-3 px-3 text-slate-600">{manager?.name || 'Unassigned'}</td>
                      <td className="py-3 px-3 text-slate-500">{opp.expectedClosingDate}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setEditingOpportunity(opp)}
                          className="p-1 text-slate-400 hover:text-slate-700 mr-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingOppId(opp.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Opportunity Modal (Create / Edit) */}
      {(isCreateModalOpen || editingOpportunity) && (
        <OpportunityFormModal
          isOpen={isCreateModalOpen || !!editingOpportunity}
          opp={editingOpportunity}
          customers={customers}
          employees={employees}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingOpportunity(null);
          }}
          onSave={(data) => {
            if (editingOpportunity) {
              updateOpportunity(editingOpportunity.id, data);
            } else {
              addOpportunity(data as any);
            }
            setIsCreateModalOpen(false);
            setEditingOpportunity(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingOppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete Opportunity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove this deal from the sales pipeline?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingOppId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteOpportunity(deletingOppId);
                  setDeletingOppId(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
              >
                Delete Opportunity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Opportunity Form Modal
interface OppModalProps {
  isOpen: boolean;
  opp: Opportunity | null;
  customers: any[];
  employees: any[];
  onClose: () => void;
  onSave: (data: Partial<Opportunity>) => void;
}

const OpportunityFormModal: React.FC<OppModalProps> = ({
  opp,
  customers,
  employees,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(opp?.name || '');
  const [customerId, setCustomerId] = useState(opp?.customerId || customers[0]?.id || '');
  const [dealValue, setDealValue] = useState<number>(opp?.dealValue || 5000000);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(opp?.assignedEmployeeId || employees[0]?.id || 'emp-1');
  const [expectedClosingDate, setExpectedClosingDate] = useState(opp?.expectedClosingDate || '2026-11-30');
  const [priority, setPriority] = useState<Priority>(opp?.priority || 'High');
  const [stage, setStage] = useState<PipelineStage>(opp?.stage || 'New Opportunity');
  const [probability, setProbability] = useState<number>(opp?.probability || 50);
  const [notes, setNotes] = useState(opp?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCust = customers.find(c => c.id === customerId);
    onSave({
      name,
      customerId,
      customerName: matchedCust ? matchedCust.name : 'Client',
      dealValue: Number(dealValue),
      assignedEmployeeId,
      expectedClosingDate,
      priority,
      stage,
      probability: Number(probability),
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {opp ? 'Edit Opportunity' : 'New Sales Opportunity'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Opportunity Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmedabad-Dholera Expressway Road Markings"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Account</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white outline-none"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Value (₹)</label>
              <input
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Closing Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as PipelineStage)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white outline-none"
              >
                <option value="New Opportunity">New Opportunity</option>
                <option value="Qualified">Qualified</option>
                <option value="Quotation Sent">Quotation Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Win Probability (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Closing Date</label>
              <input
                type="date"
                value={expectedClosingDate}
                onChange={(e) => setExpectedClosingDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Lead</label>
              <select
                value={assignedEmployeeId}
                onChange={(e) => setAssignedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white outline-none"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes & Scope</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Material volumes, TrackPro machine trials, payment terms..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
            />
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
              {opp ? 'Update Deal' : 'Save Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
