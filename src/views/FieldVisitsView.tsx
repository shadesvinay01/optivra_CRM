import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  FileText, 
  Trash2, 
  Edit2, 
  X,
  HardHat,
  ChevronRight
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { FieldVisit } from '../types';

export const FieldVisitsView: React.FC = () => {
  const { 
    fieldVisits, 
    addFieldVisit, 
    updateFieldVisit, 
    customers, 
    employees, 
    openCustomerProfile,
    showToast 
  } = useCRM();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [filterPurpose, setFilterPurpose] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportingVisit, setReportingVisit] = useState<FieldVisit | null>(null);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [nextActionText, setNextActionText] = useState('');

  const filteredVisits = fieldVisits.filter(v => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      v.customerName.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q) ||
      v.notes.toLowerCase().includes(q) ||
      v.outcome.toLowerCase().includes(q);

    const matchesEmp = filterEmployee === 'all' || v.employeeId === filterEmployee;
    const matchesPurp = filterPurpose === 'all' || v.purpose === filterPurpose;

    return matchesSearch && matchesEmp && matchesPurp;
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingVisit) return;
    updateFieldVisit(reportingVisit.id, {
      status: 'Completed',
      outcome: outcomeNotes || 'Site visit completed successfully.',
      nextAction: nextActionText || 'Follow up with procurement team.'
    });
    setReportingVisit(null);
    setOutcomeNotes('');
    setNextActionText('');
    showToast('Field visit outcome report submitted.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Field Visits & Highway Sites</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage site inspections, TrackPro screed machine trials, applicator crew trainings, and road surveys.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Plan Field Visit</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search highway location, site, or client..."
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
          <option value="all">All Technical Engineers</option>
          {employees.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        <select
          value={filterPurpose}
          onChange={(e) => setFilterPurpose(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
        >
          <option value="all">All Visit Purposes</option>
          <option value="Sample Demo">Sample Demo</option>
          <option value="Machine Trial">Machine Trial</option>
          <option value="Material Inspection">Material Inspection</option>
          <option value="Applicator Training">Applicator Training</option>
          <option value="Consultant Presentation">Consultant Presentation</option>
          <option value="Site Survey">Site Survey</option>
        </select>
      </div>

      {/* Grid of Site Visits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVisits.map((visit) => {
          const engineer = employees.find(e => e.id === visit.employeeId);
          const isDone = visit.status === 'Completed';

          return (
            <div 
              key={visit.id} 
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    visit.purpose === 'Machine Trial' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    visit.purpose === 'Material Inspection' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                    visit.purpose === 'Applicator Training' ? 'bg-teal-50 text-teal-800 border border-teal-200' :
                    'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}>
                    {visit.purpose}
                  </span>

                  <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isDone ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                    {visit.status}
                  </span>
                </div>

                <div>
                  <h4 
                    onClick={() => openCustomerProfile(visit.customerId)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                  >
                    {visit.customerName}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{visit.location}</span>
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">Observation & Outcome:</p>
                  <p className="text-[11px] leading-relaxed">{visit.outcome}</p>
                </div>

                {visit.nextAction && (
                  <div className="text-[11px] text-blue-700 font-medium bg-blue-50/60 p-2 rounded border border-blue-100">
                    <strong>Next Action:</strong> {visit.nextAction}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Deputed Engineer</span>
                  <span className="font-semibold text-slate-800">{engineer?.name || 'Technical Team'}</span>
                </div>

                {!isDone ? (
                  <button
                    onClick={() => setReportingVisit(visit)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-2xs"
                  >
                    Log Report
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-mono">{visit.visitDate}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Outcome Report Modal */}
      {reportingVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Record Field Visit Report</h3>
            <p className="text-xs text-slate-500">
              Submit trial observations, retroreflectivity findings, and follow-up tasks for {reportingVisit.customerName}.
            </p>
            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trial / Inspection Outcome *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Conducted machine screed trial on Km 120. Glass bead distribution was uniform at 250 g/m2. Tested retroreflectivity exceeded 350 mcd."
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Next Action Required</label>
                <input
                  type="text"
                  placeholder="e.g. Issue commercial quotation for 100 MT paint by Friday"
                  value={nextActionText}
                  onChange={(e) => setNextActionText(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportingVisit(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Field Visit Modal */}
      {isModalOpen && (
        <PlanVisitModal
          isOpen={isModalOpen}
          customers={customers}
          employees={employees}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            addFieldVisit(data);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

interface PlanModalProps {
  isOpen: boolean;
  customers: any[];
  employees: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const PlanVisitModal: React.FC<PlanModalProps> = ({ customers, employees, onClose, onSave }) => {
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || 'emp-1');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [purpose, setPurpose] = useState<any>('Sample Demo');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = customers.find(c => c.id === customerId);
    onSave({
      employeeId,
      customerId,
      customerName: matched?.name || 'Client',
      visitDate,
      location: location || `${matched?.city || 'Site'}, Highway Depot`,
      purpose,
      outcome: 'Scheduled field visit.',
      nextAction: 'On-site trial demonstration',
      notes,
      status: 'Scheduled'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Plan Site Field Visit</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Customer / Project Account</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Visit Purpose</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
            >
              <option value="Sample Demo">Sample Demonstration</option>
              <option value="Machine Trial">TrackPro Screed Machine Trial</option>
              <option value="Material Inspection">Material Inspection / Batch Test</option>
              <option value="Applicator Training">Applicator Operator Training</option>
              <option value="Consultant Presentation">Consultant Specification Presentation</option>
              <option value="Site Survey">Site Survey / Core Retroreflectivity Audit</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Engineer</label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Highway / Site Location</label>
            <input
              type="text"
              placeholder="e.g. Expressway Km 80 Toll Plaza Site, Igatpuri"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Visit Objective & Materials to Carry</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Carry handheld retroreflectometer, sample 25kg white paint bag..."
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
              className="px-5 py-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
            >
              Schedule Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
