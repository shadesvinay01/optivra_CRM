import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  GitPullRequest, 
  CalendarClock, 
  FileText, 
  ShoppingCart, 
  Building2, 
  MapPin, 
  AlertCircle, 
  IndianRupee, 
  UserCheck, 
  BarChart3, 
  Sparkles, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Radio,
  Menu,
  X,
  HardHat
} from 'lucide-react';
import { useCRM, NavigationTab } from '../../context/CRMContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentTab, setCurrentTab, currentRole, tenders, complaints, paymentRecoveries, leads } = useCRM();
  const [collapsed, setCollapsed] = useState(false);

  // Compute live badge counts
  const activeLeadsCount = leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').length;
  const pendingTendersCount = tenders.filter(t => t.approvalStatus !== 'Won' && t.approvalStatus !== 'Lost').length;
  const openComplaintsCount = complaints.filter(c => c.status !== 'Closed' && c.status !== 'Resolved').length;
  const overdueInvoicesCount = paymentRecoveries.filter(p => p.recoveryStatus === 'Overdue').length;

  const navItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'leads', label: 'Leads & Enquiries', icon: Target, badge: activeLeadsCount, badgeColor: 'bg-blue-100 text-blue-700' },
    { id: 'pipeline', label: 'Sales Pipeline', icon: GitPullRequest },
    { id: 'activities', label: 'Activities & Visits', icon: CalendarClock },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'tenders', label: 'Tenders & Projects', icon: Building2, badge: pendingTendersCount, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'field-visits', label: 'Field Visits & Sites', icon: MapPin },
    { id: 'complaints', label: 'Complaints & QC', icon: AlertCircle, badge: openComplaintsCount, badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'payment-recovery', label: 'Payment Recovery', icon: IndianRupee, badge: overdueInvoicesCount, badgeColor: 'bg-orange-100 text-orange-800' },
    { id: 'employees', label: 'Employees & Targets', icon: UserCheck },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, badgeColor: 'bg-purple-100 text-purple-700' },
    { id: 'integrations', label: 'Integrations', icon: Radio },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setCurrentTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shadow-sm
          ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'lg:w-[76px]' : 'lg:w-64'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <HardHat className="w-5 h-5 text-amber-300" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-slate-900 text-base tracking-tight leading-tight flex items-center gap-1.5">
                  Sunrise CRM
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200/60">
                    Pro
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 truncate font-medium">
                  Sunrise Overseas
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Ecosystem Subtitle Pill */}
        {(!collapsed || mobileOpen) && (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Road-Marking & Infra Ecosystem</span>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative
                  ${isActive 
                    ? 'bg-blue-50/80 text-blue-700 font-semibold shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                  ${collapsed ? 'justify-center px-2' : ''}
                `}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r-md" />
                )}

                <Icon 
                  className={`w-4 h-4 flex-shrink-0 transition-colors
                    ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}
                  `} 
                />

                {(!collapsed || mobileOpen) && (
                  <span className="flex-1 text-left truncate tracking-tight">
                    {item.label}
                  </span>
                )}

                {(!collapsed || mobileOpen) && item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Role Info */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          {(!collapsed || mobileOpen) ? (
            <div className="flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Role</span>
                <span className="font-semibold text-slate-800">{currentRole}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Connection" />
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500" title={`Role: ${currentRole}`} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
