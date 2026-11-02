import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Target, 
  GitPullRequest, 
  IndianRupee, 
  FileText, 
  ShoppingCart, 
  CalendarClock, 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles,
  BarChart3,
  Filter,
  AlertTriangle,
  ArrowRight,
  Layers,
  PieChart,
  Activity,
  Award,
  Briefcase,
  ChevronRight,
  RefreshCw,
  X,
  FileCheck,
  PhoneCall,
  HardHat,
  ChevronDown
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';

export const OverviewDashboard: React.FC = () => {
  const { 
    customers, 
    leads, 
    opportunities, 
    quotations, 
    orders, 
    activities, 
    tenders, 
    employees, 
    setCurrentTab, 
    openCustomerProfile, 
    openQuickCreate 
  } = useCRM();

  // Dashboard Filters & State
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [timeHorizon, setTimeHorizon] = useState<'30d' | 'quarter' | 'year'>('quarter');
  const [activeChartTab, setActiveChartTab] = useState<'revenue' | 'funnel' | 'products' | 'leaderboard'>('revenue');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredDonutIndex, setHoveredDonutIndex] = useState<number | null>(null);
  const [showAlertBanner, setShowAlertBanner] = useState<boolean>(true);

  // Filtered datasets based on state & employee
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (selectedState !== 'all' && c.state !== selectedState) return false;
      if (selectedEmployee !== 'all' && c.assignedEmployeeId !== selectedEmployee) return false;
      return true;
    });
  }, [customers, selectedState, selectedEmployee]);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (selectedState !== 'all' && l.state !== selectedState) return false;
      if (selectedEmployee !== 'all' && l.assignedEmployeeId !== selectedEmployee) return false;
      return true;
    });
  }, [leads, selectedState, selectedEmployee]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(o => {
      if (selectedEmployee !== 'all' && o.assignedEmployeeId !== selectedEmployee) return false;
      return true;
    });
  }, [opportunities, selectedEmployee]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (selectedEmployee !== 'all' && o.assignedEmployeeId !== selectedEmployee) return false;
      return true;
    });
  }, [orders, selectedEmployee]);

  // Derived KPI calculations
  const totalCustomers = filteredCustomers.length;
  const activeLeads = filteredLeads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').length;
  const openOpportunities = filteredOpportunities.filter(o => o.stage !== 'Won' && o.stage !== 'Lost').length;
  const totalPipelineValue = filteredOpportunities
    .filter(o => o.stage !== 'Won' && o.stage !== 'Lost')
    .reduce((sum, o) => sum + o.dealValue, 0);
  
  const pendingQuotations = quotations.filter(q => q.status === 'Sent' || q.status === 'Under Review').length;
  const totalOrdersWonValue = filteredOrders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.orderValue, 0);

  const followUpsDue = activities.filter(a => !a.completed).length;
  const activeTendersCount = tenders.filter(t => t.approvalStatus !== 'Won' && t.approvalStatus !== 'Lost').length;
  const totalTendersValue = tenders
    .filter(t => t.approvalStatus !== 'Won' && t.approvalStatus !== 'Lost')
    .reduce((sum, t) => sum + t.estimatedValue, 0);

  // Pipeline stage distribution
  const stages: Array<'New Opportunity' | 'Qualified' | 'Quotation Sent' | 'Negotiation' | 'Won'> = [
    'New Opportunity', 'Qualified', 'Quotation Sent', 'Negotiation', 'Won'
  ];
  const stageStats = useMemo(() => {
    return stages.map(st => {
      const stageOpps = filteredOpportunities.filter(o => o.stage === st);
      const count = stageOpps.length;
      const value = stageOpps.reduce((sum, o) => sum + o.dealValue, 0);
      return { stage: st, count, value };
    });
  }, [filteredOpportunities]);

  // State distribution
  const stateDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => {
      map[l.state] = (map[l.state] || 0) + 1;
    });
    return Object.entries(map)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [leads]);

  // Upcoming tender deadlines sorted by deadline
  const upcomingTenders = useMemo(() => {
    return [...tenders]
      .filter(t => t.approvalStatus !== 'Won' && t.approvalStatus !== 'Lost')
      .sort((a, b) => new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime())
      .slice(0, 4);
  }, [tenders]);

  // Unique states for filter
  const allStates = useMemo(() => {
    return Array.from(new Set(customers.map(c => c.state))).sort();
  }, [customers]);

  // Monthly Revenue & Dispatch Data for Interactive SVG Chart
  const monthlyData = useMemo(() => [
    { month: 'Aug', paint: 48, equipment: 16, target: 60, total: 64 },
    { month: 'Sep', paint: 54, equipment: 22, target: 68, total: 76 },
    { month: 'Oct', paint: 68, equipment: 28, target: 85, total: 96 },
    { month: 'Nov', paint: 82, equipment: 34, target: 100, total: 116 },
    { month: 'Dec', paint: 95, equipment: 42, target: 120, total: 137 },
    { month: 'Jan', paint: 118, equipment: 48, target: 140, total: 166 },
  ], []);

  // Product mix data
  const productMix = useMemo(() => [
    { name: 'Thermoplastic Paint (BS 3262)', share: 44, value: '₹2.84 Cr', color: '#2563eb' },
    { name: 'Cold Plastic / MMA Resin', share: 22, value: '₹1.42 Cr', color: '#059669' },
    { name: 'Glass Beads (Class A / Drop-on)', share: 18, value: '₹1.16 Cr', color: '#0284c7' },
    { name: 'TrackPro Screed Applicators', share: 11, value: '₹71 Lakhs', color: '#d97706' },
    { name: 'Retroreflectometers & QC Tools', share: 5, value: '₹32 Lakhs', color: '#7c3aed' },
  ], []);

  // Employee Leaderboard data
  const salesLeaderboard = useMemo(() => {
    return [...employees]
      .filter(e => e.role !== 'Admin')
      .sort((a, b) => (b.salesAchieved / b.monthlyTarget) - (a.salesAchieved / a.monthlyTarget))
      .slice(0, 5);
  }, [employees]);

  // Urgent counts for alert banner
  const urgentTenders = tenders.filter(t => {
    if (t.approvalStatus === 'Won' || t.approvalStatus === 'Lost') return false;
    const diff = Math.ceil((new Date(t.submissionDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diff <= 5;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header with Controls & Clean Period Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Commercial pipeline, manufacturing dispatch & highway tender tracking for Sunrise Overseas.
          </p>
        </div>

        {/* Global Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Horizon Pill Selector */}
          <div className="flex items-center bg-slate-100/90 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setTimeHorizon('30d')}
              className={`px-2.5 py-1 rounded-md transition-all ${timeHorizon === '30d' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeHorizon('quarter')}
              className={`px-2.5 py-1 rounded-md transition-all ${timeHorizon === 'quarter' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Q3 FY26
            </button>
            <button
              onClick={() => setTimeHorizon('year')}
              className={`px-2.5 py-1 rounded-md transition-all ${timeHorizon === 'year' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              FY 2025-26
            </button>
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs hover:border-slate-300 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All States ({allStates.length})</option>
              {allStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Employee Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs hover:border-slate-300 transition-colors">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Team Members</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* Quick AI Insight Button */}
          <button
            onClick={() => setCurrentTab('ai-assistant')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Executive Intel</span>
          </button>
        </div>
      </div>

      {/* 2. Executive Alert & Priority Strip (Refined, Clean Light-Theme Accent) */}
      {showAlertBanner && (
        <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-blue-50/70 border border-amber-200/80 rounded-xl p-3 sm:p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  High-Priority Operational Actions:
                </span>
                <span className="text-xs text-amber-800 font-medium">
                  {urgentTenders.length} highway tender submissions due in ≤ 5 days • 2 QC approvals pending
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                MSRDC Samruddhi package EMD guarantee required by tomorrow 3:00 PM. Follow up on Ashoka Buildcon delivery signoff.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
            <button
              onClick={() => setCurrentTab('tenders')}
              className="px-3 py-1 bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 font-semibold text-xs rounded-lg transition-colors shadow-2xs flex items-center gap-1"
            >
              <span>Review Tenders</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setShowAlertBanner(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              title="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. 8 Refined Primary KPI Cards with SVG Mini-Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Customers */}
        <div 
          onClick={() => setCurrentTab('customers')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Accounts</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{totalCustomers}</span>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
              </span>
            </div>
          </div>

          {/* Mini Sparkline SVG */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Contractors & PWDs</span>
            <svg className="w-20 h-5 text-blue-500 overflow-visible" viewBox="0 0 60 16">
              <path d="M 0 14 Q 15 12, 25 8 T 45 6 T 60 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 2: Active Leads & RFQs */}
        <div 
          onClick={() => setCurrentTab('leads')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Leads & RFQs</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{activeLeads}</span>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +21.8%
              </span>
            </div>
          </div>

          {/* Mini Sparkline SVG */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">High-intent enquiries</span>
            <svg className="w-20 h-5 text-emerald-500 overflow-visible" viewBox="0 0 60 16">
              <path d="M 0 13 Q 15 15, 30 9 T 45 4 T 60 1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 3: Pipeline Value */}
        <div 
          onClick={() => setCurrentTab('pipeline')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pipeline Value</span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                <GitPullRequest className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">
                ₹{(totalPipelineValue / 10000000).toFixed(2)} <span className="text-sm font-semibold text-slate-500">Cr</span>
              </span>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                {openOpportunities} Deals
              </span>
            </div>
          </div>

          {/* Mini Sparkline SVG */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Weighted avg ~68%</span>
            <svg className="w-20 h-5 text-indigo-500 overflow-visible" viewBox="0 0 60 16">
              <path d="M 0 12 Q 18 10, 32 6 T 50 4 T 60 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 4: Orders Won / Booked */}
        <div 
          onClick={() => setCurrentTab('orders')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Orders Booked</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">
                ₹{(totalOrdersWonValue / 10000000).toFixed(2)} <span className="text-sm font-semibold text-slate-500">Cr</span>
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 mr-0.5" /> Booked
              </span>
            </div>
          </div>

          {/* Mini Sparkline SVG */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Q3 Supply Contracts</span>
            <svg className="w-20 h-5 text-amber-500 overflow-visible" viewBox="0 0 60 16">
              <path d="M 0 14 Q 20 8, 35 7 T 52 3 T 60 1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 5: Pending Quotations */}
        <div 
          onClick={() => setCurrentTab('quotations')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 hover:border-sky-400 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quotations Sent</span>
              <div className="p-2 rounded-lg bg-sky-50 text-sky-600 group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{pendingQuotations}</span>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                Under Client Review
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Avg TAT: 1.8 Days</span>
            <span className="text-xs font-semibold text-sky-600 flex items-center">
              View <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* KPI 6: Tender Opportunities */}
        <div 
          onClick={() => setCurrentTab('tenders')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 hover:border-purple-400 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Highway Tenders</span>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{activeTendersCount}</span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                ₹{(totalTendersValue / 10000000).toFixed(1)} Cr Pool
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">NHAI & State PWD</span>
            <span className="text-xs font-semibold text-purple-600 flex items-center">
              NITs <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* KPI 7: Follow-ups & Visits Due */}
        <div 
          onClick={() => setCurrentTab('activities')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 hover:border-teal-400 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Follow-ups & Visits</span>
              <div className="p-2 rounded-lg bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
                <CalendarClock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{followUpsDue}</span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                Due This Week
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Site trials & meetings</span>
            <span className="text-xs font-semibold text-teal-600 flex items-center">
              Calendar <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* KPI 8: Receivables & Collection Watch */}
        <div 
          onClick={() => setCurrentTab('payment-recovery')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 hover:border-rose-400 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Receivables Ledger</span>
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">
                ₹{(filteredOrders.length * 12.8).toFixed(1)} <span className="text-sm font-semibold text-slate-500">L</span>
              </span>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                Aging Monitored
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">92% within 30-day term</span>
            <span className="text-xs font-semibold text-rose-600 flex items-center">
              Ledger <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>

      {/* 4. Main Interactive Analytics Suite (Tabbed SVG Visualizations) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Chart Header with Interactive View Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Commercial Analytics & Performance
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Interactive operational telemetry across revenue, conversion velocity and sales mix
                </p>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-medium self-start sm:self-auto">
                <button
                  onClick={() => setActiveChartTab('revenue')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeChartTab === 'revenue' 
                      ? 'bg-white text-blue-600 font-bold shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Revenue & Dispatches
                </button>
                <button
                  onClick={() => setActiveChartTab('funnel')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeChartTab === 'funnel' 
                      ? 'bg-white text-blue-600 font-bold shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pipeline Velocity
                </button>
                <button
                  onClick={() => setActiveChartTab('products')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeChartTab === 'products' 
                      ? 'bg-white text-blue-600 font-bold shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Product Mix
                </button>
                <button
                  onClick={() => setActiveChartTab('leaderboard')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeChartTab === 'leaderboard' 
                      ? 'bg-white text-blue-600 font-bold shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Team Quota
                </button>
              </div>
            </div>

            {/* TAB 1: Real Interactive SVG Monthly Revenue & Dispatch Chart */}
            {activeChartTab === 'revenue' && (
              <div className="mt-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block" />
                      Thermoplastic & Cold Plastic Supply (₹ Lakhs)
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span className="w-3 h-3 rounded-sm bg-indigo-400 inline-block" />
                      Road Machines & Equipment (₹ Lakhs)
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-500 inline-block" />
                      Target Goal
                    </span>
                  </div>
                  <div className="font-semibold text-slate-700">
                    Total Dispatched H2: <span className="text-blue-700 font-bold">₹6.55 Crores</span>
                  </div>
                </div>

                {/* Pure Interactive SVG Chart Canvas */}
                <div className="relative w-full h-[240px] pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                    {/* Horizontal Grid lines */}
                    <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="65" x2="580" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="110" x2="580" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="155" x2="580" y2="155" stroke="#e2e8f0" strokeWidth="1" />

                    {/* Target dashed line across chart */}
                    <line x1="40" y1="45" x2="580" y2="45" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="545" y="40" fill="#10b981" fontSize="9" fontWeight="bold">Target ₹1.4 Cr</text>

                    {/* Y-Axis Value Labels */}
                    <text x="8" y="24" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">₹180L</text>
                    <text x="8" y="69" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">₹120L</text>
                    <text x="8" y="114" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">₹60L</text>
                    <text x="18" y="159" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">0</text>

                    {/* Monthly Dual Stacked / Clustered Bars */}
                    {monthlyData.map((d, index) => {
                      const barGroupX = 75 + index * 88;
                      const paintHeight = (d.paint / 180) * 135;
                      const equipHeight = (d.equipment / 180) * 135;
                      const isHovered = hoveredBarIndex === index;

                      return (
                        <g 
                          key={d.month} 
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredBarIndex(index)}
                          onMouseLeave={() => setHoveredBarIndex(null)}
                        >
                          {/* Hover Background Column Highlight */}
                          {isHovered && (
                            <rect 
                              x={barGroupX - 18} 
                              y="10" 
                              width="66" 
                              height="148" 
                              fill="#f8fafc" 
                              rx="6" 
                              stroke="#e2e8f0" 
                              strokeWidth="1"
                            />
                          )}

                          {/* Paint Bar */}
                          <rect 
                            x={barGroupX - 12} 
                            y={155 - paintHeight} 
                            width="22" 
                            height={paintHeight} 
                            rx="4" 
                            className={`transition-all duration-300 ${isHovered ? 'fill-blue-700 filter drop-shadow-md' : 'fill-blue-600'}`}
                          />

                          {/* Equipment Bar */}
                          <rect 
                            x={barGroupX + 13} 
                            y={155 - equipHeight} 
                            width="16" 
                            height={equipHeight} 
                            rx="3" 
                            className={`transition-all duration-300 ${isHovered ? 'fill-indigo-600' : 'fill-indigo-400'}`}
                          />

                          {/* Month Label */}
                          <text 
                            x={barGroupX + 9} 
                            y="176" 
                            textAnchor="middle" 
                            fill={isHovered ? '#0f172a' : '#64748b'} 
                            fontSize="11" 
                            fontWeight={isHovered ? 'bold' : 'normal'}
                          >
                            {d.month}
                          </text>

                          {/* Value on top of bar on hover */}
                          {isHovered && (
                            <g>
                              <rect 
                                x={barGroupX - 25} 
                                y={155 - paintHeight - 24} 
                                width="70" 
                                height="20" 
                                rx="4" 
                                fill="#0f172a" 
                              />
                              <text 
                                x={barGroupX + 10} 
                                y={155 - paintHeight - 10} 
                                textAnchor="middle" 
                                fill="#ffffff" 
                                fontSize="10" 
                                fontWeight="bold"
                              >
                                ₹{d.total} Lakhs
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span><strong>Record Dispatch in January:</strong> 1,480 MT Thermoplastic paint dispatched across NHAI Uttar Pradesh & Maharashtra packages.</span>
                  </div>
                  <button 
                    onClick={() => setCurrentTab('orders')}
                    className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    View All Dispatches <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Sales Pipeline & Conversion Funnel */}
            {activeChartTab === 'funnel' && (
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Current conversion velocity from RFQ stage to confirmed manufacturing order</span>
                  <span className="font-semibold text-emerald-600">Overall Win Rate: 29.4%</span>
                </div>

                <div className="space-y-3">
                  {stageStats.map((item, index) => {
                    const maxVal = Math.max(...stageStats.map(s => s.value), 1);
                    const pct = Math.max(14, Math.round((item.value / maxVal) * 100));
                    const conversionRates = ['100%', '64%', '52%', '41%', '29%'];

                    return (
                      <div key={item.stage} className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="font-bold text-slate-900">{item.stage}</span>
                            <span className="text-slate-400 font-normal">({item.count} deals)</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              Conv: {conversionRates[index]}
                            </span>
                            <span className="font-bold text-slate-900">
                              ₹{(item.value / 100000).toFixed(1)} Lakhs
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                          <div 
                            style={{ width: `${pct}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              index === 0 ? 'bg-blue-500' :
                              index === 1 ? 'bg-indigo-500' :
                              index === 2 ? 'bg-sky-500' :
                              index === 3 ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">Pipeline Velocity Cycle: <strong>21 Days average deal gestation</strong></span>
                  <button 
                    onClick={() => setCurrentTab('pipeline')}
                    className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Open Kanban Board <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Product Mix & Demand Distribution */}
            {activeChartTab === 'products' && (
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Clean SVG Donut Representation */}
                  <div className="relative flex items-center justify-center h-[200px]">
                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                      {/* Product Segments */}
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#2563eb" strokeWidth="12" strokeDasharray="105 134" strokeDashoffset="0" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#059669" strokeWidth="12" strokeDasharray="52 187" strokeDashoffset="-105" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#0284c7" strokeWidth="12" strokeDasharray="43 196" strokeDashoffset="-157" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#d97706" strokeWidth="12" strokeDasharray="26 213" strokeDashoffset="-200" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#7c3aed" strokeWidth="12" strokeDasharray="12 227" strokeDashoffset="-226" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs text-slate-400 font-semibold uppercase">Total Value</span>
                      <span className="text-lg font-bold text-slate-900">₹6.45 Cr</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Q3 Supplied</span>
                    </div>
                  </div>

                  {/* Product Legend & Details */}
                  <div className="space-y-2">
                    {productMix.map((p, i) => (
                      <div 
                        key={p.name}
                        onMouseEnter={() => setHoveredDonutIndex(i)}
                        onMouseLeave={() => setHoveredDonutIndex(null)}
                        className={`p-2 rounded-lg border transition-all flex items-center justify-between text-xs ${
                          hoveredDonutIndex === i ? 'bg-slate-50 border-slate-300' : 'border-transparent hover:bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                          <span className="font-semibold text-slate-800">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-mono">{p.share}%</span>
                          <span className="font-bold text-slate-900">{p.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  Compliant with <strong>MoRTH Section 803</strong> & <strong>AASHTO M249</strong> specifications for high-retroreflectivity national highway projects.
                </p>
              </div>
            )}

            {/* TAB 4: Sales Leaderboard & Quota */}
            {activeChartTab === 'leaderboard' && (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                  <span>Executive target fulfillment for Q3 FY26</span>
                  <span className="font-semibold text-slate-700">Monthly Target: ₹2.40 Cr Combined</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {salesLeaderboard.map((emp, index) => {
                    const attainment = Math.round((emp.salesAchieved / emp.monthlyTarget) * 100);
                    const isSuperStar = attainment >= 100;

                    return (
                      <div key={emp.id} className="py-3 flex items-center justify-between gap-3 group">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-amber-100 text-amber-800' : 
                            index === 1 ? 'bg-slate-200 text-slate-700' : 
                            index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            #{index + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {emp.name}
                              </h4>
                              <span className="text-[10px] text-slate-400">{emp.department}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              Territory: {emp.assignedStates.join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-900 block">
                              ₹{(emp.salesAchieved / 100000).toFixed(1)}L / ₹{(emp.monthlyTarget / 100000).toFixed(0)}L
                            </span>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 ml-auto">
                              <div 
                                style={{ width: `${Math.min(100, attainment)}%` }}
                                className={`h-full rounded-full ${isSuperStar ? 'bg-emerald-500' : 'bg-blue-600'}`}
                              />
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                            isSuperStar ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {attainment}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Need to reassign territorial quotas?</span>
                  <button 
                    onClick={() => setCurrentTab('employees')}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Open Employees Directory →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Footer Summary within Main Card */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Active Supply Contracts: <strong className="text-slate-800">{filteredOrders.length} Booked</strong>
            </div>
            <div>
              Weighted Pipeline: <strong className="text-blue-700 font-semibold">₹{((totalPipelineValue * 0.68) / 10000000).toFixed(2)} Cr</strong>
            </div>
            <div>
              Average Deal Ticket: <strong className="text-slate-800">₹{(totalPipelineValue / Math.max(1, filteredOpportunities.length) / 100000).toFixed(1)} Lakhs</strong>
            </div>
          </div>
        </div>

        {/* State Distribution & Territory Hotspots (1 Col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  State Lead Density
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Territory distribution & highway corridors</p>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                Top 6
              </span>
            </div>

            <div className="space-y-3.5 mt-4">
              {stateDistribution.map((item, idx) => {
                const total = leads.length || 1;
                const percentage = Math.round((item.count / total) * 100);
                const isSelected = selectedState === item.state;

                return (
                  <div 
                    key={item.state} 
                    onClick={() => setSelectedState(isSelected ? 'all' : item.state)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50/80 border-blue-300 shadow-2xs' 
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                        {item.state}
                      </span>
                      <span className="font-semibold text-slate-700">
                        {item.count} Leads <span className="text-slate-400 font-normal">({percentage}%)</span>
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${percentage}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0 ? 'bg-blue-600' :
                          idx === 1 ? 'bg-emerald-600' :
                          idx === 2 ? 'bg-amber-600' :
                          idx === 3 ? 'bg-purple-600' : 'bg-slate-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-950">Corridor Expansion: Western & Northern</p>
                <p className="text-[11px] text-blue-700">Surge driven by Delhi-Vadodara & Bundelkhand</p>
              </div>
              <button 
                onClick={() => setCurrentTab('reports')}
                className="text-xs font-semibold text-blue-700 hover:underline px-2 py-1 rounded hover:bg-blue-100/50"
              >
                Analytics →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Secondary Row: High-Priority Tenders & Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Highway Tenders (CRITICAL ROAD-MARKING MODULE) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                Upcoming Highway Tender Submissions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">NHAI, MoRTH & State PWD active bids requiring EMD & bid papers</p>
            </div>
            <button
              onClick={() => setCurrentTab('tenders')}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/60 transition-colors"
            >
              All Tenders <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingTenders.map(tnd => {
              const deadline = new Date(tnd.submissionDeadline);
              const today = new Date();
              const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const isUrgent = diffDays <= 4 && diffDays >= 0;

              return (
                <div key={tnd.id} className="py-3 flex items-start justify-between gap-3 group hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200/60 uppercase">
                        {tnd.departmentCategory}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{tnd.tenderId}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-purple-700 transition-colors mt-0.5 truncate">
                      {tnd.tenderTitle}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {tnd.location} • EMD: ₹{(tnd.earnestMoneyDeposit / 100000).toFixed(1)}L
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold text-slate-900 block">
                      ₹{(tnd.estimatedValue / 10000000).toFixed(2)} Cr
                    </span>
                    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                      isUrgent 
                        ? 'bg-rose-100 text-rose-700 animate-pulse' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {diffDays <= 0 ? 'Due Today' : `${diffDays} days left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Total pipeline tender value</span>
            <span className="font-bold text-purple-700">₹{(totalTendersValue / 10000000).toFixed(2)} Crores</span>
          </div>
        </div>

        {/* Upcoming Field Visits & Follow-ups */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-teal-600" />
                Scheduled Field Visits & Follow-ups
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">On-site applicator trials, retroreflectivity demos & negotiations</p>
            </div>
            <button
              onClick={() => setCurrentTab('activities')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60 transition-colors"
            >
              Calendar <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {activities.filter(a => !a.completed).slice(0, 4).map(act => (
              <div key={act.id} className="py-3 flex items-start justify-between gap-3 group hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      act.type === 'Field Visit' ? 'bg-teal-100 text-teal-800' :
                      act.type === 'Meeting' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {act.type}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {act.date} at {act.time}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors mt-0.5 truncate">
                    {act.relatedCustomerName || act.relatedLeadName || 'Client Meeting'}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {act.notes}
                  </p>
                </div>

                <button
                  onClick={() => openCustomerProfile(act.relatedCustomerId || '')}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200/60 rounded-lg transition-colors flex-shrink-0"
                >
                  Client File
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need to dispatch a technical engineer to site?</span>
            <button
              onClick={() => openQuickCreate('activity')}
              className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              + Log Site Visit / Trial
            </button>
          </div>
        </div>
      </div>

      {/* 6. Recent Confirmed Supply Orders & Dispatches Matrix */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              Recent Confirmed Orders & Dispatches
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Live tracking from manufacturing plant to project highway stretch</p>
          </div>
          <button
            onClick={() => setCurrentTab('orders')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60 transition-colors"
          >
            All Orders ({orders.length}) <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Order Ref.</th>
                <th className="py-2.5 px-3">Client / Contractor</th>
                <th className="py-2.5 px-3">Order Value</th>
                <th className="py-2.5 px-3">Fulfillment Status</th>
                <th className="py-2.5 px-3">Payment Term</th>
                <th className="py-2.5 px-3">ETA Delivery</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map(ord => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-blue-600">{ord.orderNumber}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{ord.customerName}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">₹{ord.orderValue.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.orderStatus === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                      ord.orderStatus === 'Processing' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      ord.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                      ord.paymentStatus === 'Partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{ord.expectedDelivery}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setCurrentTab('orders')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
