import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Filter, 
  Calendar, 
  Users, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  FileText, 
  IndianRupee,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';

export const ReportsView: React.FC = () => {
  const { 
    customers, 
    leads, 
    opportunities, 
    quotations, 
    orders, 
    tenders, 
    paymentRecoveries, 
    employees, 
    showToast 
  } = useCRM();

  const [activeReportTab, setActiveReportTab] = useState<'sales' | 'territory' | 'tenders' | 'recovery' | 'conversion'>('sales');
  const [filterState, setFilterState] = useState('all');
  const [filterEmployee, setFilterEmployee] = useState('all');

  const uniqueStates = useMemo(() => Array.from(new Set(customers.map(c => c.state))).sort(), [customers]);

  // Total calculations
  const totalRevenueBooked = orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.orderValue, 0);

  const totalQuotesSentValue = quotations.reduce((sum, q) => sum + q.grandTotal, 0);
  const totalQuotesAcceptedValue = quotations
    .filter(q => q.status === 'Accepted')
    .reduce((sum, q) => sum + q.grandTotal, 0);

  const quoteConversionRate = Math.round((totalQuotesAcceptedValue / Math.max(1, totalQuotesSentValue)) * 100);

  // Territory breakdown
  const territoryStats = useMemo(() => {
    const map: Record<string, { customers: number; leads: number; tenderValue: number }> = {};
    customers.forEach(c => {
      if (!map[c.state]) map[c.state] = { customers: 0, leads: 0, tenderValue: 0 };
      map[c.state].customers += 1;
    });
    leads.forEach(l => {
      if (!map[l.state]) map[l.state] = { customers: 0, leads: 0, tenderValue: 0 };
      map[l.state].leads += 1;
    });
    tenders.forEach(t => {
      if (!map[t.state]) map[t.state] = { customers: 0, leads: 0, tenderValue: 0 };
      map[t.state].tenderValue += t.estimatedValue;
    });
    return Object.entries(map).map(([state, data]) => ({ state, ...data }))
      .sort((a, b) => (b.customers + b.leads) - (a.customers + a.leads));
  }, [customers, leads, tenders]);

  // Export Report to CSV
  const handleExportReportCSV = () => {
    let headers: string[] = [];
    let rows: any[] = [];

    if (activeReportTab === 'sales') {
      headers = ['Employee Name', 'Role', 'Department', 'Monthly Target', 'Sales Achieved', 'Attainment %'];
      rows = employees.map(e => [
        `"${e.name}"`,
        e.role,
        e.department,
        e.monthlyTarget,
        e.salesAchieved,
        `${Math.round((e.salesAchieved / e.monthlyTarget) * 100)}%`
      ]);
    } else if (activeReportTab === 'territory') {
      headers = ['State / Territory', 'Customers Count', 'Active Leads Count', 'Tenders Pipeline (INR)'];
      rows = territoryStats.map(t => [
        t.state,
        t.customers,
        t.leads,
        t.tenderValue
      ]);
    } else {
      headers = ['Order ID', 'Customer Name', 'Order Value', 'Status', 'Payment Status', 'Expected Delivery'];
      rows = orders.map(o => [
        o.orderNumber,
        `"${o.customerName}"`,
        o.orderValue,
        o.orderStatus,
        o.paymentStatus,
        o.expectedDelivery
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sunrise_${activeReportTab}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${activeReportTab} report to CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Reports & Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational intelligence, sales attainment, territory penetration, and receivables analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportReportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Orders Booked</span>
          <p className="text-xl font-bold text-slate-900 mt-1">₹{(totalRevenueBooked / 10000000).toFixed(2)} Cr</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Confirmed PO volume</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Quotations Issued</span>
          <p className="text-xl font-bold text-blue-600 mt-1">₹{(totalQuotesSentValue / 10000000).toFixed(2)} Cr</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{quotations.length} formal bids issued</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Quotation Win Rate</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">{quoteConversionRate}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Value acceptance ratio</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Receivables</span>
          <p className="text-xl font-bold text-rose-600 mt-1">
            ₹{(paymentRecoveries.reduce((s, p) => s + p.outstandingAmount, 0) / 100000).toFixed(1)} L
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Under recovery cycle</p>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'sales', label: 'Sales Attainment & Leaderboard' },
          { id: 'territory', label: 'State-wise Road Marking Penetration' },
          { id: 'tenders', label: 'Government Tender Performance' },
          { id: 'recovery', label: 'Payment Aging & Recovery' },
          { id: 'conversion', label: 'Lead Funnel Velocity' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveReportTab(t.id as any)}
            className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeReportTab === t.id
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Report 1: Sales Attainment Leaderboard */}
      {activeReportTab === 'sales' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Sales Executive Performance vs Targets</h3>
            <span className="text-xs text-slate-500 font-medium">Q3 FY 2026-27</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Sales Executive</th>
                  <th className="py-2.5 px-3">Role & Dept</th>
                  <th className="py-2.5 px-3">Monthly Target</th>
                  <th className="py-2.5 px-3">Achieved Revenue</th>
                  <th className="py-2.5 px-3">Attainment %</th>
                  <th className="py-2.5 px-3">Territories</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => {
                  const pct = Math.round((emp.salesAchieved / emp.monthlyTarget) * 100);
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-semibold text-slate-900">{emp.name}</td>
                      <td className="py-3 px-3 text-slate-600">{emp.role} • {emp.department}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">₹{(emp.monthlyTarget / 100000).toFixed(1)} L</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">₹{(emp.salesAchieved / 100000).toFixed(1)} L</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${Math.min(100, pct)}%` }}
                              className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                            />
                          </div>
                          <span className="font-bold text-slate-800">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{emp.assignedStates.join(', ')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 2: State-wise Road Marking Penetration */}
      {activeReportTab === 'territory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Territory Market Share & Penetration</h3>
            <span className="text-xs text-slate-500">Cross-state distribution</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">State / Union Territory</th>
                  <th className="py-2.5 px-3">Customer Accounts</th>
                  <th className="py-2.5 px-3">Active Leads & RFQs</th>
                  <th className="py-2.5 px-3">Tender Pipeline (₹)</th>
                  <th className="py-2.5 px-3">Market Density</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {territoryStats.map(t => {
                  const totalAccounts = t.customers + t.leads;
                  return (
                    <tr key={t.state} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-bold text-slate-900">{t.state}</td>
                      <td className="py-3 px-3 font-semibold text-blue-600">{t.customers} Clients</td>
                      <td className="py-3 px-3 font-semibold text-emerald-600">{t.leads} Inquiries</td>
                      <td className="py-3 px-3 font-bold text-purple-700">₹{(t.tenderValue / 10000000).toFixed(2)} Cr</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          totalAccounts >= 8 ? 'bg-emerald-50 text-emerald-700' :
                          totalAccounts >= 4 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {totalAccounts >= 8 ? 'Tier 1 Priority' : totalAccounts >= 4 ? 'Tier 2 Active' : 'Developing'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 3: Government Tender Performance */}
      {activeReportTab === 'tenders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Government Highway Tender Bid Conversion</h3>
            <span className="text-xs text-purple-700 font-semibold">NHAI, MoRTH & State PWD</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Tender NIT</th>
                  <th className="py-2.5 px-3">Authority</th>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3">Estimated Value</th>
                  <th className="py-2.5 px-3">EMD Paid</th>
                  <th className="py-2.5 px-3">Current Bid Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenders.map(tnd => (
                  <tr key={tnd.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono font-bold text-purple-700">{tnd.tenderId}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{tnd.departmentCategory}</td>
                    <td className="py-3 px-3 text-slate-700">{tnd.state}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">₹{(tnd.estimatedValue / 10000000).toFixed(2)} Cr</td>
                    <td className="py-3 px-3 text-slate-600">₹{(tnd.earnestMoneyDeposit / 100000).toFixed(1)} L</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        tnd.approvalStatus === 'Won' ? 'bg-emerald-100 text-emerald-800' :
                        tnd.approvalStatus === 'Lost' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {tnd.approvalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 4: Payment Aging & Recovery */}
      {activeReportTab === 'recovery' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Receivables Aging & Credit Cycle</h3>
            <span className="text-xs text-rose-600 font-semibold">Overdue Invoices Highlighted</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Invoice</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Invoice Total</th>
                  <th className="py-2.5 px-3">Collected</th>
                  <th className="py-2.5 px-3">Outstanding</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentRecoveries.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{rec.invoiceNumber}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{rec.customerName}</td>
                    <td className="py-3 px-3 text-slate-600">{rec.dueDate}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">₹{rec.invoiceAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">₹{rec.amountReceived.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 font-bold text-rose-600">₹{rec.outstandingAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        rec.recoveryStatus === 'Overdue' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {rec.recoveryStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 5: Conversion Velocity */}
      {activeReportTab === 'conversion' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Lead to Opportunity Conversion Funnel</h3>
            <span className="text-xs text-blue-600 font-semibold">Velocity Metrics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Captured RFQs</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{leads.length}</p>
              <p className="text-xs text-slate-400 mt-1">Across 12 Indian states</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Opportunities Created</span>
              <p className="text-2xl font-bold text-blue-600 mt-1">{opportunities.length}</p>
              <p className="text-xs text-slate-400 mt-1">Qualified project bids</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Conversion Efficiency</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {Math.round((opportunities.length / Math.max(1, leads.length)) * 100)}%
              </p>
              <p className="text-xs text-slate-400 mt-1">Lead to Pipeline velocity</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
