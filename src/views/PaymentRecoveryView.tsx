import React, { useState, useMemo } from 'react';
import { 
  IndianRupee, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Filter, 
  Calendar, 
  FileText, 
  X,
  CreditCard,
  TrendingDown
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { PaymentRecovery } from '../types';

export const PaymentRecoveryView: React.FC = () => {
  const { 
    paymentRecoveries, 
    recordPayment, 
    addPaymentRecovery, 
    customers, 
    employees, 
    openCustomerProfile,
    showToast 
  } = useCRM();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [recordingPaymentFor, setRecordingPaymentFor] = useState<PaymentRecovery | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'NEFT/RTGS' | 'Cheque' | 'UPI' | 'Letter of Credit'>('NEFT/RTGS');
  const [payRef, setPayRef] = useState('');

  // Filtered
  const filtered = useMemo(() => {
    return paymentRecoveries.filter(p => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        p.invoiceNumber.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q);

      const matchesStatus = filterStatus === 'all' || p.recoveryStatus === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [paymentRecoveries, searchTerm, filterStatus]);

  // Totals
  const totalOutstanding = paymentRecoveries.reduce((sum, p) => sum + p.outstandingAmount, 0);
  const totalOverdue = paymentRecoveries
    .filter(p => p.recoveryStatus === 'Overdue')
    .reduce((sum, p) => sum + p.outstandingAmount, 0);
  const totalCollected = paymentRecoveries.reduce((sum, p) => sum + p.amountReceived, 0);

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingPaymentFor || payAmount <= 0) return;
    recordPayment(
      recordingPaymentFor.id,
      Number(payAmount),
      payMethod,
      payRef || `UTR-${Date.now().toString().slice(-6)}`
    );
    setRecordingPaymentFor(null);
    setPayAmount(0);
    setPayRef('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Recovery & Receivables</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor commercial invoice aging, record client RTGS collections, and track credit cycles.
          </p>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Outstanding Receivables</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            ₹{(totalOutstanding / 100000).toFixed(2)} <span className="text-sm font-semibold text-slate-500">Lakhs</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across active accounts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Critical Overdue Amount</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            ₹{(totalOverdue / 100000).toFixed(2)} <span className="text-sm font-semibold text-slate-500">Lakhs</span>
          </p>
          <p className="text-[11px] text-rose-500 mt-0.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Requires immediate follow-up
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Recovered / Collected</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            ₹{(totalCollected / 100000).toFixed(2)} <span className="text-sm font-semibold text-slate-500">Lakhs</span>
          </p>
          <p className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> RTGS / LC cleared this quarter
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
        >
          <option value="all">All Recovery Statuses</option>
          <option value="Overdue">Overdue</option>
          <option value="Due">Due Soon</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Paid">Fully Paid</option>
          <option value="Not Due">Not Due</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Invoice No.</th>
                <th className="py-3 px-3">Customer Account</th>
                <th className="py-3 px-3">Invoice Date</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Amount Received</th>
                <th className="py-3 px-3">Outstanding Balance</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const isPaid = p.outstandingAmount <= 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.invoiceNumber}</td>
                    <td className="py-3.5 px-3">
                      <div 
                        onClick={() => openCustomerProfile(p.customerId)}
                        className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer"
                      >
                        {p.customerName}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{p.invoiceDate}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-800">{p.dueDate}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900">₹{p.invoiceAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-3 text-emerald-700 font-semibold">₹{p.amountReceived.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-3">
                      <span className={`font-bold text-sm ${p.outstandingAmount > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        ₹{p.outstandingAmount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        p.recoveryStatus === 'Paid' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        p.recoveryStatus === 'Overdue' ? 'bg-rose-50 text-rose-800 border border-rose-200 animate-pulse' :
                        p.recoveryStatus === 'Partially Paid' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {p.recoveryStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!isPaid ? (
                        <button
                          onClick={() => {
                            setRecordingPaymentFor(p);
                            setPayAmount(p.outstandingAmount);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors"
                        >
                          Record Payment
                        </button>
                      ) : (
                        <span className="text-emerald-700 text-xs font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {recordingPaymentFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Record Payment Received</h3>
              <button onClick={() => setRecordingPaymentFor(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Invoice <strong className="text-slate-800">{recordingPaymentFor.invoiceNumber}</strong> for {recordingPaymentFor.customerName}.
              Current outstanding: <strong className="text-rose-600">₹{recordingPaymentFor.outstandingAmount.toLocaleString('en-IN')}</strong>.
            </p>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount Received (₹) *</label>
                <input
                  type="number"
                  required
                  max={recordingPaymentFor.outstandingAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-sm outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="NEFT/RTGS">NEFT / RTGS Bank Transfer</option>
                  <option value="Cheque">Account Payee Cheque</option>
                  <option value="UPI">Corporate UPI</option>
                  <option value="Letter of Credit">Letter of Credit (LC)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Reference / UTR Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UTR-HDFC0099411"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRecordingPaymentFor(null)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                >
                  Confirm & Update Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
