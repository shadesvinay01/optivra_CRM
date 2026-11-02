import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Upload, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  X, 
  Clock, 
  IndianRupee,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Customer, CustomerType, CustomerStatus } from '../types';

export const CustomersView: React.FC = () => {
  const { 
    customers, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer, 
    employees, 
    activities, 
    leads, 
    quotations, 
    orders, 
    complaints, 
    paymentRecoveries,
    selectedCustomerIdForProfile,
    openCustomerProfile,
    closeCustomerProfile,
    addActivity,
    showToast
  } = useCRM();

  // Search, Filters & Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Customer>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvInput, setCsvInput] = useState('');

  // Profile Tab State
  const [profileTab, setProfileTab] = useState<'overview' | 'timeline' | 'quotations' | 'orders' | 'complaints' | 'payments' | 'notes'>('overview');
  const [newTimelineNote, setNewTimelineNote] = useState('');
  const [newTimelineType, setNewTimelineType] = useState<'Phone Call' | 'Meeting' | 'Field Visit' | 'Follow-up' | 'Internal Note'>('Phone Call');

  // Filter options
  const uniqueStates = useMemo(() => Array.from(new Set(customers.map(c => c.state))).sort(), [customers]);
  const customerTypes: CustomerType[] = [
    'Contractor', 'Applicator', 'Government Department', 'Infrastructure Company', 'Consultant', 'Distributor'
  ];

  // Filtered & Sorted Customer Data
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.contactPerson.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q);

      const matchesType = filterType === 'all' || c.type === filterType;
      const matchesState = filterState === 'all' || c.state === filterState;
      const matchesEmployee = filterEmployee === 'all' || c.assignedEmployeeId === filterEmployee;
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;

      return matchesSearch && matchesType && matchesState && matchesEmployee && matchesStatus;
    }).sort((a, b) => {
      const valA = (a[sortField] || '').toString().toLowerCase();
      const valB = (b[sortField] || '').toString().toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [customers, searchTerm, filterType, filterState, filterEmployee, filterStatus, sortField, sortAsc]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const activeCustomer = useMemo(() => {
    if (!selectedCustomerIdForProfile) return null;
    return customers.find(c => c.id === selectedCustomerIdForProfile) || null;
  }, [customers, selectedCustomerIdForProfile]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Organization Name', 'Type', 'Contact Person', 'Email', 'Phone', 'City', 'State', 'GSTIN', 'Status'];
    const rows = filteredCustomers.map(c => [
      c.id,
      `"${c.name}"`,
      c.type,
      `"${c.contactPerson}"`,
      c.email,
      c.phone,
      `"${c.city}"`,
      `"${c.state}"`,
      c.gstNumber || 'N/A',
      c.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sunrise_customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredCustomers.length} customer records to CSV.`);
  };

  // Import CSV parser
  const handleImportCSVSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput.trim()) return;

    try {
      const lines = csvInput.trim().split('\n');
      let count = 0;
      for (const line of lines) {
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 3 && parts[0].toLowerCase() !== 'name' && parts[0].toLowerCase() !== 'organization name') {
          addCustomer({
            name: parts[0],
            type: (parts[1] as CustomerType) || 'Contractor',
            contactPerson: parts[2] || 'Lead Contact',
            email: parts[3] || 'info@client.in',
            phone: parts[4] || '+91 98000 00000',
            state: parts[5] || 'Maharashtra',
            city: parts[6] || 'Mumbai',
            address: `${parts[6] || 'City'}, ${parts[5] || 'State'}`,
            assignedEmployeeId: employees[0]?.id || 'emp-1',
            source: 'CSV Import',
            status: 'Active',
            industry: 'Road Infrastructure',
            lastContacted: new Date().toISOString().split('T')[0],
            nextFollowUp: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
            notes: 'Imported via CSV batch upload.'
          });
          count++;
        }
      }
      setIsImportModalOpen(false);
      setCsvInput('');
      showToast(`Successfully imported ${count} customers from CSV.`);
    } catch (err) {
      showToast('Error parsing CSV. Please check formatting.', 'error');
    }
  };

  // Add timeline note
  const handleAddTimelineActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer || !newTimelineNote.trim()) return;

    addActivity({
      type: newTimelineType,
      relatedCustomerId: activeCustomer.id,
      relatedCustomerName: activeCustomer.name,
      assignedEmployeeId: activeCustomer.assignedEmployeeId,
      date: new Date().toISOString().split('T')[0],
      time: 'Just now',
      duration: '15 mins',
      outcome: 'Logged Note',
      notes: newTimelineNote,
      completed: true
    });

    setNewTimelineNote('');
    showToast('Activity note added to client file.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage infrastructure contractors, road-marking applicators, concessionaires & government PWD accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client name, city, contact person, or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
            className="w-full md:w-44 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Account Types</option>
            {customerTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* State Filter */}
          <select
            value={filterState}
            onChange={(e) => { setFilterState(e.target.value); setCurrentPage(1); }}
            className="w-full md:w-36 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All States</option>
            {uniqueStates.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Assigned Employee */}
          <select
            value={filterEmployee}
            onChange={(e) => { setFilterEmployee(e.target.value); setCurrentPage(1); }}
            className="w-full md:w-40 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Managers</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>

        {/* Active Filters Pill Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong className="text-slate-800">{filteredCustomers.length}</strong> of {customers.length} total customers
          </span>

          {(searchTerm || filterType !== 'all' || filterState !== 'all' || filterEmployee !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterState('all');
                setFilterEmployee('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                  onClick={() => { setSortField('name'); setSortAsc(!sortAsc); }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Organization</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3">Primary Contact</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                  onClick={() => { setSortField('state'); setSortAsc(!sortAsc); }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Location</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Account Lead</th>
                <th className="py-3 px-3">Next Follow-up</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">No customer records match your filter criteria.</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try clearing your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c) => {
                  const manager = employees.find(e => e.id === c.assignedEmployeeId);

                  return (
                    <tr 
                      key={c.id} 
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                      onClick={() => openCustomerProfile(c.id)}
                    >
                      {/* Name & Industry */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {c.industry}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          c.type === 'Contractor' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                          c.type === 'Government Department' ? 'bg-purple-50 text-purple-700 border border-purple-200/60' :
                          c.type === 'Applicator' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                          c.type === 'Infrastructure Company' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' :
                          c.type === 'Distributor' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {c.type}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-800">{c.contactPerson}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{c.phone}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-3">
                        <div className="text-slate-800 font-medium">{c.city}</div>
                        <div className="text-[11px] text-slate-400">{c.state}</div>
                      </td>

                      {/* Manager */}
                      <td className="py-3.5 px-3">
                        <span className="text-slate-700 font-medium">{manager?.name || 'Unassigned'}</span>
                      </td>

                      {/* Follow-up */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {c.nextFollowUp || 'None'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {c.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div 
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => openCustomerProfile(c.id)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors"
                            title="View Profile"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingCustomer(c)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingCustomerId(c.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <strong className="text-slate-800">{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Customer Profile Drawer / Modal (CRITICAL REQUIREMENT) */}
      {activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="w-full max-w-3xl h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {activeCustomer.type}
                  </span>
                  <span className="text-xs font-mono text-slate-400">ID: {activeCustomer.id}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{activeCustomer.name}</h2>
                <p className="text-xs text-slate-500">{activeCustomer.address} • GSTIN: {activeCustomer.gstNumber || 'Not specified'}</p>
              </div>

              <button
                onClick={closeCustomerProfile}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Tabs */}
            <div className="flex items-center gap-1 px-5 border-b border-slate-200 bg-white overflow-x-auto text-xs font-medium">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'timeline', label: 'Timeline & Activities' },
                { id: 'quotations', label: 'Quotations' },
                { id: 'orders', label: 'Orders' },
                { id: 'complaints', label: 'Complaints' },
                { id: 'payments', label: 'Payments' },
                { id: 'notes', label: 'Notes' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setProfileTab(t.id as any)}
                  className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                    profileTab === t.id
                      ? 'border-blue-600 text-blue-700 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Profile Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Overview Tab */}
              {profileTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick stat cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase">Quotations</span>
                      <p className="text-lg font-bold text-slate-900 mt-1">
                        {quotations.filter(q => q.customerId === activeCustomer.id).length}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase">Booked Orders</span>
                      <p className="text-lg font-bold text-slate-900 mt-1">
                        {orders.filter(o => o.customerId === activeCustomer.id).length}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase">Support Tickets</span>
                      <p className="text-lg font-bold text-slate-900 mt-1">
                        {complaints.filter(c => c.customerId === activeCustomer.id).length}
                      </p>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">Contact & Organization Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block">Contact Person</span>
                        <span className="font-semibold text-slate-800">{activeCustomer.contactPerson}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Phone</span>
                        <span className="font-semibold text-slate-800">{activeCustomer.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Email</span>
                        <span className="font-semibold text-slate-800">{activeCustomer.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">State & Territory</span>
                        <span className="font-semibold text-slate-800">{activeCustomer.city}, {activeCustomer.state}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Assigned Account Lead</span>
                        <span className="font-semibold text-slate-800">
                          {employees.find(e => e.id === activeCustomer.assignedEmployeeId)?.name || 'Unassigned'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Lead Source</span>
                        <span className="font-semibold text-slate-800">{activeCustomer.source}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Notes */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="text-sm font-bold text-slate-900">Commercial & Technical Notes</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{activeCustomer.notes}</p>
                  </div>
                </div>
              )}

              {/* Timeline & Activities Tab */}
              {profileTab === 'timeline' && (
                <div className="space-y-5">
                  {/* Quick Activity Logger */}
                  <form onSubmit={handleAddTimelineActivity} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-800 block">Log Client Interaction / Call</span>
                    <div className="flex gap-2">
                      <select
                        value={newTimelineType}
                        onChange={(e) => setNewTimelineType(e.target.value as any)}
                        className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white"
                      >
                        <option value="Phone Call">Phone Call</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Field Visit">Field Visit</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Internal Note">Internal Note</option>
                      </select>
                      <input
                        type="text"
                        required
                        placeholder="Log meeting notes, retroreflectivity test result, quote status..."
                        value={newTimelineNote}
                        onChange={(e) => setNewTimelineNote(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                      >
                        Log
                      </button>
                    </div>
                  </form>

                  {/* Chronological Timeline */}
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {activities
                      .filter(a => a.relatedCustomerId === activeCustomer.id)
                      .map((act) => (
                        <div key={act.id} className="relative">
                          <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white flex items-center justify-center" />
                          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-900">{act.type}</span>
                              <span className="text-slate-400">{act.date} • {act.time}</span>
                            </div>
                            <p className="text-xs text-slate-600">{act.notes}</p>
                            {act.outcome && (
                              <div className="pt-1 text-[11px] text-emerald-700 font-medium">
                                Outcome: {act.outcome}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Quotations Tab */}
              {profileTab === 'quotations' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Quotation History</h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {quotations
                      .filter(q => q.customerId === activeCustomer.id)
                      .map(quote => (
                        <div key={quote.id} className="p-3 bg-white flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-blue-600">{quote.quotationNumber}</span>
                            <p className="text-slate-500 mt-0.5">{quote.lineItems.length} line items • Valid till {quote.validityDate}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-900 text-sm">₹{quote.grandTotal.toLocaleString('en-IN')}</span>
                            <span className="block text-[11px] text-amber-700 font-semibold">{quote.status}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {profileTab === 'orders' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Order & Fulfillment History</h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {orders
                      .filter(o => o.customerId === activeCustomer.id)
                      .map(ord => (
                        <div key={ord.id} className="p-3 bg-white flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{ord.orderNumber}</span>
                            <p className="text-slate-500 mt-0.5">Delivery: {ord.expectedDelivery}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-900 text-sm">₹{ord.orderValue.toLocaleString('en-IN')}</span>
                            <span className="block text-[11px] text-blue-700 font-semibold">{ord.orderStatus}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Complaints Tab */}
              {profileTab === 'complaints' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Quality & Support Tickets</h4>
                  <div className="space-y-2">
                    {complaints
                      .filter(c => c.customerId === activeCustomer.id)
                      .map(cmp => (
                        <div key={cmp.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-700">{cmp.category}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">{cmp.status}</span>
                          </div>
                          <p className="text-slate-600">{cmp.description}</p>
                          {cmp.resolutionNotes && (
                            <p className="text-slate-500 bg-slate-50 p-2 rounded text-[11px]">
                              Resolution: {cmp.resolutionNotes}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {profileTab === 'payments' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Invoice & Receivables Ledger</h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {paymentRecoveries
                      .filter(p => p.customerId === activeCustomer.id)
                      .map(rec => (
                        <div key={rec.id} className="p-3 bg-white flex items-center justify-between text-xs">
                          <div>
                            <span className="font-mono font-bold text-slate-800">{rec.invoiceNumber}</span>
                            <p className="text-slate-500 mt-0.5">Due date: {rec.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-900 block">
                              Outstanding: ₹{rec.outstandingAmount.toLocaleString('en-IN')}
                            </span>
                            <span className={`text-[11px] font-semibold ${rec.recoveryStatus === 'Overdue' ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {rec.recoveryStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {profileTab === 'notes' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Account Specifications</h4>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    {activeCustomer.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Customer Modal */}
      {(isCreateModalOpen || editingCustomer) && (
        <CustomerFormModal
          isOpen={isCreateModalOpen || !!editingCustomer}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingCustomer(null);
          }}
          customer={editingCustomer}
          onSave={(data) => {
            if (editingCustomer) {
              updateCustomer(editingCustomer.id, data);
            } else {
              addCustomer(data as any);
            }
            setIsCreateModalOpen(false);
            setEditingCustomer(null);
          }}
          employees={employees}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this customer record? All linked interactions and notes will be affected.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingCustomerId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCustomer(deletingCustomerId);
                  setDeletingCustomerId(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Import Customers from CSV</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Paste CSV text. Columns: <code>Organization Name, Type, Contact Person, Email, Phone, State, City</code>
            </p>
            <textarea
              rows={6}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="Dilip Buildcon Ltd, Contractor, Manoj Tiwari, m.tiwari@dilipbuildcon.com, +91 755 4029999, Madhya Pradesh, Bhopal&#10;Ashoka Buildcon Ltd, Contractor, Sanjay Londhe, sanjay@ashokabuildcon.com, +91 253 6633705, Maharashtra, Nashik"
              className="w-full p-3 font-mono text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleImportCSVSubmit}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Import Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal for Create/Edit Customer
interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSave: (data: Partial<Customer>) => void;
  employees: any[];
}

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  onClose,
  customer,
  onSave,
  employees
}) => {
  const [name, setName] = useState(customer?.name || '');
  const [type, setType] = useState<CustomerType>(customer?.type || 'Contractor');
  const [contactPerson, setContactPerson] = useState(customer?.contactPerson || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [state, setState] = useState(customer?.state || 'Maharashtra');
  const [city, setCity] = useState(customer?.city || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(customer?.assignedEmployeeId || employees[0]?.id || 'emp-1');
  const [industry, setIndustry] = useState(customer?.industry || 'Highways & Expressway EPC');
  const [gstNumber, setGstNumber] = useState(customer?.gstNumber || '');
  const [status, setStatus] = useState<CustomerStatus>(customer?.status || 'Active');
  const [notes, setNotes] = useState(customer?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      type,
      contactPerson,
      email,
      phone,
      state,
      city,
      address,
      assignedEmployeeId,
      industry,
      gstNumber,
      status,
      notes,
      source: customer?.source || 'Direct Client Account',
      lastContacted: new Date().toISOString().split('T')[0],
      nextFollowUp: customer?.nextFollowUp || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {customer ? 'Edit Customer Details' : 'Add New Customer'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dilip Buildcon Ltd"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Classification</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CustomerType)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white outline-none"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Industry / Sector</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Manoj Tiwari (VP Procurement)"
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="e.g. 23AAACD4219P1ZE"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600 font-mono"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Office / Works Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Account Manager</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white outline-none"
              >
                <option value="Active">Active</option>
                <option value="Prospect">Prospect</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes & Specifications</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Product preferences, highway packages executed, NABL test requirements..."
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
              {customer ? 'Save Changes' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
