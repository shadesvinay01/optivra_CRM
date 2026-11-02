import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  Edit2, 
  X,
  CheckCircle2
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Employee, Role } from '../types';

export const EmployeesView: React.FC = () => {
  const { 
    employees, 
    addEmployee, 
    updateEmployee, 
    currentRole, 
    setCurrentRole,
    customers,
    leads,
    opportunities,
    showToast 
  } = useCRM();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const departments = ['Government Tenders', 'Institutional Sales', 'Channel Sales', 'Technical & Application', 'Key Accounts'];

  const filtered = employees.filter(e => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      e.name.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.assignedStates.some(s => s.toLowerCase().includes(q));

    const matchesDept = filterDepartment === 'all' || e.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Directory & Sales Targets</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage sales managers, application engineers, territory allocations, and monthly revenue targets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Role Tester Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200/80 rounded-lg text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-500">Current View:</span>
            <span className="font-bold text-blue-900">{currentRole}</span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employee by name, territory, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
          />
        </div>

        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
        >
          <option value="all">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(emp => {
          const target = emp.monthlyTarget || 1;
          const achieved = emp.salesAchieved || 0;
          const pct = Math.min(100, Math.round((achieved / target) * 100));
          const assignedCustCount = customers.filter(c => c.assignedEmployeeId === emp.id).length;
          const assignedLeadCount = leads.filter(l => l.assignedEmployeeId === emp.id).length;

          return (
            <div 
              key={emp.id} 
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={emp.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                      alt={emp.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{emp.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{emp.employeeId}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    emp.role === 'Admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    emp.role === 'Sales Manager' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {emp.role}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">{emp.department}</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{emp.phone}</span>
                  </p>
                </div>

                {/* Territories */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Assigned Territories</span>
                  <div className="flex flex-wrap gap-1">
                    {emp.assignedStates.map(st => (
                      <span key={st} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Progress Bar */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-500">Monthly Target</span>
                    <span className="font-bold text-slate-900">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 90 ? 'bg-emerald-500' : pct >= 70 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="text-slate-500">Achieved: ₹{(achieved / 100000).toFixed(1)}L</span>
                    <span className="font-semibold text-slate-800">Target: ₹{(target / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{assignedCustCount} Accounts</span>
                <span>{assignedLeadCount} Leads</span>
                <button
                  onClick={() => setEditingEmployee(emp)}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {(isModalOpen || editingEmployee) && (
        <EmployeeModal
          isOpen={isModalOpen || !!editingEmployee}
          emp={editingEmployee}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEmployee(null);
          }}
          onSave={(data) => {
            if (editingEmployee) {
              updateEmployee(editingEmployee.id, data);
            } else {
              addEmployee(data as any);
            }
            setIsModalOpen(false);
            setEditingEmployee(null);
          }}
        />
      )}
    </div>
  );
};

interface EmpModalProps {
  isOpen: boolean;
  emp: Employee | null;
  onClose: () => void;
  onSave: (data: Partial<Employee>) => void;
}

const EmployeeModal: React.FC<EmpModalProps> = ({ emp, onClose, onSave }) => {
  const [name, setName] = useState(emp?.name || '');
  const [employeeId, setEmployeeId] = useState(emp?.employeeId || `SO-${Math.floor(100 + Math.random() * 900)}`);
  const [role, setRole] = useState<Role>(emp?.role || 'Sales Executive');
  const [department, setDepartment] = useState<any>(emp?.department || 'Institutional Sales');
  const [email, setEmail] = useState(emp?.email || '');
  const [phone, setPhone] = useState(emp?.phone || '');
  const [assignedStates, setAssignedStates] = useState(emp?.assignedStates.join(', ') || 'Maharashtra, Gujarat');
  const [monthlyTarget, setMonthlyTarget] = useState<number>(emp?.monthlyTarget || 6000000);
  const [salesAchieved, setSalesAchieved] = useState<number>(emp?.salesAchieved || 4500000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      employeeId,
      role,
      department,
      email,
      phone,
      assignedStates: assignedStates.split(',').map(s => s.trim()),
      reportingManager: emp?.reportingManager || 'Rajesh Sharma',
      monthlyTarget: Number(monthlyTarget),
      salesAchieved: Number(salesAchieved),
      status: 'Active'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {emp ? 'Edit Employee Details' : 'Add Team Member'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Employee ID</label>
              <input
                type="text"
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="Admin">Admin</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Sales Executive">Sales Executive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
            >
              <option value="Government Tenders">Government Tenders</option>
              <option value="Institutional Sales">Institutional Sales</option>
              <option value="Channel Sales">Channel Sales</option>
              <option value="Technical & Application">Technical & Application</option>
              <option value="Key Accounts">Key Accounts</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assigned States (Comma separated)</label>
            <input
              type="text"
              value={assignedStates}
              onChange={(e) => setAssignedStates(e.target.value)}
              placeholder="e.g. Maharashtra, Gujarat, Rajasthan"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Target (₹)</label>
              <input
                type="number"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Achieved (₹)</label>
              <input
                type="number"
                value={salesAchieved}
                onChange={(e) => setSalesAchieved(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-bold"
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
              Save Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
