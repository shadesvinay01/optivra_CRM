import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  Menu, 
  ShieldCheck, 
  ChevronDown, 
  Users, 
  Target, 
  GitPullRequest, 
  FileText, 
  Calendar, 
  Building2, 
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  MapPin,
  Clock
} from 'lucide-react';
import { useCRM, NavigationTab } from '../../context/CRMContext';
import { Role } from '../../types';

interface TopNavbarProps {
  onOpenMobileSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenMobileSidebar }) => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentUser, 
    notifications, 
    setIsSearchOpen, 
    openQuickCreate,
    setCurrentTab
  } = useCRM();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const quickCreateRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (quickCreateRef.current && !quickCreateRef.current.contains(event.target as Node)) {
        setQuickCreateOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: Role[] = ['Admin', 'Sales Manager', 'Sales Executive'];

  const quickCreateItems = [
    { label: 'New Customer', icon: Users, type: 'customer', color: 'text-blue-600 bg-blue-50' },
    { label: 'New Lead / Enquiry', icon: Target, type: 'lead', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'New Opportunity', icon: GitPullRequest, type: 'opportunity', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'New Quotation', icon: FileText, type: 'quotation', color: 'text-amber-600 bg-amber-50' },
    { label: 'Schedule Activity / Call', icon: Calendar, type: 'activity', color: 'text-sky-600 bg-sky-50' },
    { label: 'Register Tender', icon: Building2, type: 'tender', color: 'text-purple-600 bg-purple-50' },
    { label: 'Plan Field Visit', icon: MapPin, type: 'field-visit', color: 'text-teal-600 bg-teal-50' },
    { label: 'Log Complaint / Issue', icon: AlertCircle, type: 'complaint', color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-xs">
      {/* Left: Mobile hamburger & search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-between w-full max-w-md px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-lg text-sm text-slate-500 transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="truncate">Search customers, leads, tenders, orders...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Fiscal Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>FY 2026-27 | Q3</span>
        </div>

        {/* Quick Create Dropdown */}
        <div className="relative" ref={quickCreateRef}>
          <button
            onClick={() => setQuickCreateOpen(!quickCreateOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {quickCreateOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Quick Actions
              </div>
              <div className="py-1">
                {quickCreateItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      onClick={() => {
                        openQuickCreate(item.type);
                        setQuickCreateOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`p-1.5 rounded-md ${item.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                  {notifications.length} Pending
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-400">
                    No urgent notifications. All tasks up to date!
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        if (n.linkTab) setCurrentTab(n.linkTab as NavigationTab);
                        setNotificationsOpen(false);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 p-1 rounded-full ${
                          n.type === 'urgent' ? 'bg-rose-100 text-rose-600' :
                          n.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <AlertCircle className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo Role Switcher */}
        <div className="relative" ref={roleDropdownRef}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
            title="Switch Demo Role"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline text-slate-500">Role:</span>
            <span className="font-semibold text-slate-900">{currentRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Switch Demo Perspective
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentRole(r);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                    currentRole === r ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-3.5 h-3.5 ${currentRole === r ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{r}</span>
                  </div>
                  {currentRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
              <div className="px-3 py-1.5 bg-slate-50 text-[10px] text-slate-500 border-t border-slate-100">
                Simulates UI permissions for Sunrise team roles.
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {currentUser.department}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
