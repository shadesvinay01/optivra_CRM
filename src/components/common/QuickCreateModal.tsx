import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Target, 
  GitPullRequest, 
  FileText, 
  Calendar, 
  Building2, 
  MapPin, 
  AlertCircle,
  Check
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { CustomerType, Priority, ActivityType } from '../../types';

export const QuickCreateModal: React.FC = () => {
  const { 
    isQuickCreateOpen, 
    setIsQuickCreateOpen, 
    quickCreateDefaultTab,
    addCustomer,
    addLead,
    addOpportunity,
    addActivity,
    addTender,
    addFieldVisit,
    addComplaint,
    customers,
    employees,
    catalog
  } = useCRM();

  const [activeTab, setActiveTab] = useState<string>('customer');

  useEffect(() => {
    if (quickCreateDefaultTab) {
      setActiveTab(quickCreateDefaultTab);
    }
  }, [quickCreateDefaultTab, isQuickCreateOpen]);

  // Customer Form State
  const [custName, setCustName] = useState('');
  const [custType, setCustType] = useState<CustomerType>('Contractor');
  const [custContact, setCustContact] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custState, setCustState] = useState('Maharashtra');
  const [custCity, setCustCity] = useState('');
  const [custAssigned, setCustAssigned] = useState(employees[0]?.id || 'emp-1');
  const [custNotes, setCustNotes] = useState('');

  // Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadOrg, setLeadOrg] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadProduct, setLeadProduct] = useState(catalog[0]?.name || 'Thermoplastic Road Marking Paint (White)');
  const [leadValue, setLeadValue] = useState<number>(2500000);
  const [leadPriority, setLeadPriority] = useState<Priority>('High');
  const [leadState, setLeadState] = useState('Gujarat');
  const [leadCity, setLeadCity] = useState('');
  const [leadAssigned, setLeadAssigned] = useState(employees[1]?.id || 'emp-2');

  // Opportunity Form State
  const [oppName, setOppName] = useState('');
  const [oppCustId, setOppCustId] = useState(customers[0]?.id || '');
  const [oppValue, setOppValue] = useState<number>(5000000);
  const [oppCloseDate, setOppCloseDate] = useState('2026-11-30');
  const [oppPriority, setOppPriority] = useState<Priority>('High');
  const [oppAssigned, setOppAssigned] = useState(employees[0]?.id || 'emp-1');

  // Activity Form State
  const [actType, setActType] = useState<ActivityType>('Meeting');
  const [actCustId, setActCustId] = useState(customers[0]?.id || '');
  const [actDate, setActDate] = useState(new Date().toISOString().split('T')[0]);
  const [actTime, setActTime] = useState('11:00 AM');
  const [actDuration, setActDuration] = useState('45 mins');
  const [actNotes, setActNotes] = useState('');
  const [actAssigned, setActAssigned] = useState(employees[0]?.id || 'emp-1');

  // Tender Form State
  const [tndTitle, setTndTitle] = useState('');
  const [tndId, setTndId] = useState('NHAI/RO/DEL/2026/01');
  const [tndDept, setTndDept] = useState('National Highways Authority of India');
  const [tndCategory, setTndCategory] = useState<'NHAI' | 'MoRTH' | 'State PWD' | 'Smart City' | 'Railways / Metro' | 'State Infrastructure Corp'>('NHAI');
  const [tndState, setTndState] = useState('Uttar Pradesh');
  const [tndLoc, setTndLoc] = useState('');
  const [tndValue, setTndValue] = useState<number>(35000000);
  const [tndDeadline, setTndDeadline] = useState('2026-11-28');
  const [tndAssigned, setTndAssigned] = useState(employees[0]?.id || 'emp-1');

  // Field Visit State
  const [fvCustId, setFvCustId] = useState(customers[0]?.id || '');
  const [fvDate, setFvDate] = useState(new Date().toISOString().split('T')[0]);
  const [fvLocation, setFvLocation] = useState('');
  const [fvPurpose, setFvPurpose] = useState<'Sample Demo' | 'Machine Trial' | 'Material Inspection' | 'Applicator Training' | 'Consultant Presentation' | 'Site Survey'>('Sample Demo');
  const [fvNotes, setFvNotes] = useState('');
  const [fvAssigned, setFvAssigned] = useState(employees[0]?.id || 'emp-1');

  // Complaint State
  const [cmpCustId, setCmpCustId] = useState(customers[0]?.id || '');
  const [cmpCat, setCmpCat] = useState<any>('Retroreflectivity Issue');
  const [cmpDesc, setCmpDesc] = useState('');
  const [cmpPriority, setCmpPriority] = useState<Priority>('High');
  const [cmpDueDate, setCmpDueDate] = useState(new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]);
  const [cmpAssigned, setCmpAssigned] = useState(employees[1]?.id || 'emp-2');

  if (!isQuickCreateOpen) return null;

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName) return;
    addCustomer({
      name: custName,
      type: custType,
      contactPerson: custContact,
      email: custEmail,
      phone: custPhone,
      state: custState,
      city: custCity || 'Head Office',
      address: `${custCity || 'HQ'}, ${custState}`,
      assignedEmployeeId: custAssigned,
      source: 'Direct Entry',
      status: 'Active',
      industry: 'Highway Infrastructure',
      lastContacted: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      notes: custNotes
    });
    setIsQuickCreateOpen(false);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadOrg) return;
    addLead({
      leadName,
      organization: leadOrg,
      contactPerson: leadContact,
      phone: leadPhone,
      email: leadEmail,
      state: leadState,
      city: leadCity || 'Regional Office',
      leadSource: 'Direct Sales Inquiry',
      productInterest: leadProduct,
      estimatedValue: Number(leadValue),
      assignedEmployeeId: leadAssigned,
      priority: leadPriority,
      status: 'New',
      nextFollowUp: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      notes: `Quick captured enquiry for ${leadProduct}.`
    });
    setIsQuickCreateOpen(false);
  };

  const handleOppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppName) return;
    const matched = customers.find(c => c.id === oppCustId);
    addOpportunity({
      name: oppName,
      customerId: oppCustId,
      customerName: matched ? matched.name : 'Key Client',
      dealValue: Number(oppValue),
      assignedEmployeeId: oppAssigned,
      expectedClosingDate: oppCloseDate,
      priority: oppPriority,
      stage: 'New Opportunity',
      probability: 30,
      notes: 'Quick logged sales opportunity.'
    });
    setIsQuickCreateOpen(false);
  };

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = customers.find(c => c.id === actCustId);
    addActivity({
      type: actType,
      relatedCustomerId: actCustId,
      relatedCustomerName: matched?.name,
      assignedEmployeeId: actAssigned,
      date: actDate,
      time: actTime,
      duration: actDuration,
      outcome: 'Scheduled',
      notes: actNotes,
      completed: false
    });
    setIsQuickCreateOpen(false);
  };

  const handleTenderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tndTitle || !tndId) return;
    addTender({
      tenderTitle: tndTitle,
      tenderId: tndId,
      department: tndDept,
      departmentCategory: tndCategory,
      state: tndState,
      location: tndLoc || `${tndState} Highway Project`,
      projectDescription: `Government tender for road markings & safety infrastructure.`,
      estimatedValue: Number(tndValue),
      tenderPublicationDate: new Date().toISOString().split('T')[0],
      submissionDeadline: tndDeadline,
      approvalStatus: 'Identified',
      assignedEmployeeId: tndAssigned,
      priority: 'High',
      earnestMoneyDeposit: Math.round(Number(tndValue) * 0.02),
      tenderFee: 25000,
      documents: [],
      notes: 'Initial tender notice logged via Quick Create.'
    });
    setIsQuickCreateOpen(false);
  };

  const handleFieldVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = customers.find(c => c.id === fvCustId);
    addFieldVisit({
      employeeId: fvAssigned,
      customerId: fvCustId,
      customerName: matched?.name || 'Highway Site',
      visitDate: fvDate,
      location: fvLocation || 'Expressway Site Depot',
      purpose: fvPurpose,
      outcome: 'Scheduled',
      nextAction: 'On-site technical evaluation',
      notes: fvNotes,
      status: 'Scheduled'
    });
    setIsQuickCreateOpen(false);
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmpDesc) return;
    const matched = customers.find(c => c.id === cmpCustId);
    addComplaint({
      customerId: cmpCustId,
      customerName: matched?.name || 'Customer Site',
      category: cmpCat,
      description: cmpDesc,
      priority: cmpPriority,
      assignedEmployeeId: cmpAssigned,
      dateReported: new Date().toISOString().split('T')[0],
      dueDate: cmpDueDate,
      status: 'Open'
    });
    setIsQuickCreateOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">Quick Record Entry</h3>
            <p className="text-xs text-slate-500">Capture client information, leads, tenders, or site activities instantly</p>
          </div>
          <button
            onClick={() => setIsQuickCreateOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100/70 border-b border-slate-200 overflow-x-auto text-xs">
          {[
            { id: 'customer', label: 'Customer', icon: Users },
            { id: 'lead', label: 'Lead', icon: Target },
            { id: 'opportunity', label: 'Opportunity', icon: GitPullRequest },
            { id: 'activity', label: 'Activity', icon: Calendar },
            { id: 'tender', label: 'Tender', icon: Building2 },
            { id: 'field-visit', label: 'Field Visit', icon: MapPin },
            { id: 'complaint', label: 'Complaint', icon: AlertCircle }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  active ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-semibold' : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'customer' && (
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dilip Buildcon Ltd"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Classification</label>
                  <select
                    value={custType}
                    onChange={(e) => setCustType(e.target.value as CustomerType)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none bg-white"
                  >
                    <option value="Contractor">Contractor (EPC)</option>
                    <option value="Applicator">Applicator (Road Striping)</option>
                    <option value="Government Department">Government Department (NHAI/PWD)</option>
                    <option value="Infrastructure Company">Infrastructure Concessionaire</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Distributor">Distributor / Channel Partner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Manoj Tiwari (VP Procurement)"
                    value={custContact}
                    onChange={(e) => setCustContact(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98200 XXXXX"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State / Territory</label>
                  <input
                    type="text"
                    value={custState}
                    onChange={(e) => setCustState(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Bhopal"
                    value={custCity}
                    onChange={(e) => setCustCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Account Manager</label>
                <select
                  value={custAssigned}
                  onChange={(e) => setCustAssigned(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none bg-white"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role} - {emp.department})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickCreateOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Save Customer
                </button>
              </div>
            </form>
          )}

          {activeTab === 'lead' && (
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project / Opportunity Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samruddhi Mahamarg Phase-3 Re-striping"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MSRDC / L&T"
                    value={leadOrg}
                    onChange={(e) => setLeadOrg(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Er. Sachin Bhalerao"
                    value={leadContact}
                    onChange={(e) => setLeadContact(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98231 XXXXX"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Product / Material Interest</label>
                  <input
                    type="text"
                    value={leadProduct}
                    onChange={(e) => setLeadProduct(e.target.value)}
                    placeholder="e.g. Thermoplastic Paint (White) - 450 MT & Type II Glass Beads"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Value (₹)</label>
                  <input
                    type="number"
                    value={leadValue}
                    onChange={(e) => setLeadValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={leadPriority}
                    onChange={(e) => setLeadPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickCreateOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                >
                  Create Lead
                </button>
              </div>
            </form>
          )}

          {activeTab === 'opportunity' && (
            <form onSubmit={handleOppSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Opportunity Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NH-48 Vadodara-Surat Highway Restriping"
                    value={oppName}
                    onChange={(e) => setOppName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer</label>
                  <select
                    value={oppCustId}
                    onChange={(e) => setOppCustId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none bg-white"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Value (₹)</label>
                  <input
                    type="number"
                    value={oppValue}
                    onChange={(e) => setOppValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Closing Date</label>
                  <input
                    type="date"
                    value={oppCloseDate}
                    onChange={(e) => setOppCloseDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Executive</label>
                  <select
                    value={oppAssigned}
                    onChange={(e) => setOppAssigned(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none bg-white"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickCreateOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
                >
                  Add Opportunity
                </button>
              </div>
            </form>
          )}

          {activeTab === 'activity' && (
            <form onSubmit={handleActivitySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Type</label>
                  <select
                    value={actType}
                    onChange={(e) => setActType(e.target.value as ActivityType)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none bg-white"
                  >
                    <option value="Phone Call">Phone Call</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Field Visit">Field Visit</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Internal Note">Internal Note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Related Client</label>
                  <select
                    value={actCustId}
                    onChange={(e) => setActCustId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none bg-white"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={actDate}
                    onChange={(e) => setActDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={actTime}
                    onChange={(e) => setActTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Discussion Agenda</label>
                  <textarea
                    rows={2}
                    value={actNotes}
                    onChange={(e) => setActNotes(e.target.value)}
                    placeholder="Details about product samples, rate contract discussion, or technical demonstration..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickCreateOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-xs"
                >
                  Schedule Activity
                </button>
              </div>
            </form>
          )}

          {activeTab === 'tender' && (
            <form onSubmit={handleTenderSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tender Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Periodic Road Marking Refurbishment on NH-48 Surat Section"
                    value={tndTitle}
                    onChange={(e) => setTndTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIT / Tender ID *</label>
                  <input
                    type="text"
                    required
                    value={tndId}
                    onChange={(e) => setTndId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department Category</label>
                  <select
                    value={tndCategory}
                    onChange={(e) => setTndCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none bg-white"
                  >
                    <option value="NHAI">NHAI (National Highways)</option>
                    <option value="State PWD">State PWD</option>
                    <option value="State Infrastructure Corp">State Corp (MSRDC, UPSHA)</option>
                    <option value="Smart City">Smart City Mission</option>
                    <option value="MoRTH">MoRTH Direct</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Tender Value (₹)</label>
                  <input
                    type="number"
                    value={tndValue}
                    onChange={(e) => setTndValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    value={tndDeadline}
                    onChange={(e) => setTndDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickCreateOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-xs"
                >
                  Register Tender
                </button>
              </div>
            </form>
          )}

          {activeTab === 'field-visit' && (
            <form onSubmit={handleFieldVisitSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client / Contractor Site</label>
                  <select
                    value={fvCustId}
                    onChange={(e) => setFvCustId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none bg-white"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Visit Purpose</label>
                  <select
                    value={fvPurpose}
                    onChange={(e) => setFvPurpose(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none bg-white"
                  >
                    <option value="Sample Demo">Sample Demo</option>
                    <option value="Machine Trial">Machine Trial (TrackPro)</option>
                    <option value="Material Inspection">Material Inspection</option>
                    <option value="Applicator Training">Applicator Crew Training</option>
                    <option value="Consultant Presentation">Consultant Presentation</option>
                    <option value="Site Survey">Site Survey / Core Testing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={fvDate}
                    onChange={(e) => setFvDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location Details</label>
                  <input
                    type="text"
                    placeholder="e.g. Expressway Km 80 Toll Plaza Site"
                    value={fvLocation}
                    onChange={(e) => setFvLocation(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickCreateOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-xs"
                >
                  Log Field Visit
                </button>
              </div>
            </form>
          )}

          {activeTab === 'complaint' && (
            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reporting Customer</label>
                  <select
                    value={cmpCustId}
                    onChange={(e) => setCmpCustId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none bg-white"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Category</label>
                  <select
                    value={cmpCat}
                    onChange={(e) => setCmpCat(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none bg-white"
                  >
                    <option value="Retroreflectivity Issue">Retroreflectivity Below Spec</option>
                    <option value="Drying Time / Curing">Slow Drying / Curing on Bitumen</option>
                    <option value="Nozzle / Machine Clogging">Nozzle / Screed Box Clogging</option>
                    <option value="Adhesion Failure">Adhesion Failure on Concrete</option>
                    <option value="Batch Shade Mismatch">Batch Shade / Whiteness Variation</option>
                    <option value="Packaging / Transit">Transit / Packaging Damage</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe batch number, site location, and observed discrepancy..."
                    value={cmpDesc}
                    onChange={(e) => setCmpDesc(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickCreateOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
