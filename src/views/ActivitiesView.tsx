import React, { useState, useMemo } from 'react';
import { 
  CalendarClock, 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Users, 
  MapPin, 
  Mail, 
  MessageSquare, 
  FileText, 
  Calendar, 
  X, 
  Edit2, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Activity, ActivityType } from '../types';

export const ActivitiesView: React.FC = () => {
  const { 
    activities, 
    addActivity, 
    updateActivity, 
    deleteActivity, 
    completeActivity, 
    customers, 
    employees,
    openCustomerProfile,
    showToast
  } = useCRM();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [completingActivity, setCompletingActivity] = useState<Activity | null>(null);
  const [outcomeText, setOutcomeText] = useState('');

  const types: ActivityType[] = [
    'Phone Call', 'Meeting', 'Field Visit', 'Email', 'WhatsApp', 'Follow-up', 'Internal Note'
  ];

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter(a => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        (a.relatedCustomerName || '').toLowerCase().includes(q) ||
        (a.notes || '').toLowerCase().includes(q) ||
        (a.outcome || '').toLowerCase().includes(q);

      const matchesType = filterType === 'all' || a.type === filterType;
      const matchesEmployee = filterEmployee === 'all' || a.assignedEmployeeId === filterEmployee;
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'completed' && a.completed) ||
        (filterStatus === 'pending' && !a.completed);

      return matchesSearch && matchesType && matchesEmployee && matchesStatus;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activities, searchTerm, filterType, filterEmployee, filterStatus]);

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingActivity) return;
    completeActivity(completingActivity.id, outcomeText || 'Interaction completed successfully.');
    setCompletingActivity(null);
    setOutcomeText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Activities & Client Follow-ups</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Centralized schedule of phone calls, site visits, technical presentations, and follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
              Calendar Schedule
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Activity</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search interaction or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Interaction Types</option>
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Team Members</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Follow-ups</option>
            <option value="completed">Completed Activities</option>
          </select>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Activity Type</th>
                <th className="py-3 px-3">Related Customer / Lead</th>
                <th className="py-3 px-3">Scheduled Date & Time</th>
                <th className="py-3 px-3">Assigned Sales Lead</th>
                <th className="py-3 px-3">Agenda / Notes</th>
                <th className="py-3 px-3">Outcome</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredActivities.map(act => {
                const manager = employees.find(e => e.id === act.assignedEmployeeId);

                return (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        act.type === 'Field Visit' ? 'bg-teal-50 text-teal-800 border border-teal-200' :
                        act.type === 'Meeting' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                        act.type === 'Phone Call' ? 'bg-sky-50 text-sky-800 border border-sky-200' :
                        act.type === 'WhatsApp' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {act.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div 
                        onClick={() => openCustomerProfile(act.relatedCustomerId || '')}
                        className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer"
                      >
                        {act.relatedCustomerName || act.relatedLeadName || 'Direct Interaction'}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-800 block">{act.date}</span>
                      <span className="text-[11px] text-slate-400">{act.time} ({act.duration})</span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {manager?.name || 'Unassigned'}
                    </td>

                    <td className="py-3.5 px-3 max-w-xs text-slate-600 line-clamp-2">
                      {act.notes}
                    </td>

                    <td className="py-3.5 px-3">
                      {act.completed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          {act.outcome || 'Done'}
                        </span>
                      ) : (
                        <button
                          onClick={() => setCompletingActivity(act)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteActivity(act.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete"
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

      {/* Log Outcome Modal */}
      {completingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Complete Activity & Record Outcome</h3>
            <p className="text-xs text-slate-500">
              Log the discussion results for {completingActivity.type} with {completingActivity.relatedCustomerName || 'Client'}.
            </p>
            <form onSubmit={handleCompleteSubmit} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="e.g. Discussed batch certification. Client agreed to issue PO for 150 MT white paint next Tuesday."
                value={outcomeText}
                onChange={(e) => setOutcomeText(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCompletingActivity(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Save Outcome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Activity Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Schedule Client Activity</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ScheduleActivityForm
              customers={customers}
              employees={employees}
              onClose={() => setIsCreateModalOpen(false)}
              onSave={(data) => {
                addActivity(data);
                setIsCreateModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ScheduleFormProps {
  customers: any[];
  employees: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const ScheduleActivityForm: React.FC<ScheduleFormProps> = ({ customers, employees, onClose, onSave }) => {
  const [type, setType] = useState<ActivityType>('Phone Call');
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00 AM');
  const [duration, setDuration] = useState('30 mins');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(employees[0]?.id || 'emp-1');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = customers.find(c => c.id === customerId);
    onSave({
      type,
      relatedCustomerId: customerId,
      relatedCustomerName: matched?.name,
      date,
      time,
      duration,
      assignedEmployeeId,
      notes,
      outcome: 'Scheduled',
      completed: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Interaction Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ActivityType)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
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
          <label className="block font-semibold text-slate-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Time</label>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
          />
        </div>

        <div className="col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">Assigned Executive</label>
          <select
            value={assignedEmployeeId}
            onChange={(e) => setAssignedEmployeeId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
          >
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">Agenda / Discussion Details</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Sample testing, rate revision, delivery docket..."
            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
          />
        </div>
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
          Schedule
        </button>
      </div>
    </form>
  );
};
