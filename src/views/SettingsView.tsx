import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Building2, 
  ShieldCheck, 
  Layers, 
  Package, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  HardHat,
  Database,
  Sliders,
  BellRing
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';

export const SettingsView: React.FC = () => {
  const { catalog, resetDemoData, showToast } = useCRM();

  const [activeTab, setActiveTab] = useState<'company' | 'catalog' | 'pipeline' | 'reset'>('company');

  // Company Profile State
  const [companyName, setCompanyName] = useState('Sunrise Overseas');
  const [tagline, setTagline] = useState('Intelligent Sales, Customer & Project Management for Infrastructure & Road-Marking');
  const [gstin, setGstin] = useState('24AAACS9981A1ZZ');
  const [cin, setCin] = useState('U24220MH2012PTC228190');
  const [email, setEmail] = useState('info@sunriseoverseas.in');
  const [phone, setPhone] = useState('+91 22 6640 4220');
  const [factoryAddress, setFactoryAddress] = useState('Plot 18-20, GIDC Industrial Estate, Umbergaon, Gujarat - 396171');
  const [officeAddress, setOfficeAddress] = useState('402, Trade Square, Bandra-Kurla Complex, Mumbai, MH - 400051');

  // Reset confirmation modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Company settings updated.');
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setIsResetModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings & Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure Sunrise Overseas corporate details, product specifications, and demo environment data.
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'company', label: 'Company Profile & Letterhead', icon: Building2 },
          { id: 'catalog', label: 'Product & Material Catalog', icon: Package },
          { id: 'pipeline', label: 'Sales Pipeline Stages', icon: Sliders },
          { id: 'reset', label: 'Demo Data Management', icon: RotateCcw }
        ].map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
                active 
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Company Profile */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Corporate & Letterhead Configuration</h3>
            <p className="text-xs text-slate-500">
              Details populated automatically on official printable Quotations, delivery dockets, and tender bids.
            </p>
          </div>

          <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corporate Positioning Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GSTIN Registration Number</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corporate Identification Number (CIN)</label>
                <input
                  type="text"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Sales Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Head Office Telephone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Manufacturing Works & Warehouse Address</label>
                <input
                  type="text"
                  value={factoryAddress}
                  onChange={(e) => setFactoryAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Registered Corporate Office Address</label>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Product & Material Catalog */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Road Marking Materials & Equipment Catalog</h3>
              <p className="text-xs text-slate-500">Standard price list, HSN tax classifications, and technical specifications</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">HSN Code</th>
                  <th className="py-2.5 px-3">Standard Unit</th>
                  <th className="py-2.5 px-3">Base Price (₹)</th>
                  <th className="py-2.5 px-3">GST Rate</th>
                  <th className="py-2.5 px-3">Technical Specification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {catalog.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-semibold text-slate-900">{prod.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium text-[11px]">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{prod.hsn}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{prod.unit}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">₹{prod.defaultPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-slate-600">{prod.gstRate}%</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate" title={prod.specification}>
                      {prod.specification}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Sales Pipeline Stages */}
      {activeTab === 'pipeline' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Configured Sales Pipeline Stages</h3>
            <p className="text-xs text-slate-500">Standard highway contract opportunity stages and default win probabilities</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {[
              { name: '1. New Opportunity', prob: '20%', desc: 'Initial inquiry logged from highway project or tender' },
              { name: '2. Qualified', prob: '50%', desc: 'Technical specifications approved by project engineer' },
              { name: '3. Quotation Sent', prob: '70%', desc: 'Formal price quote issued with delivery schedule' },
              { name: '4. Negotiation', prob: '85%', desc: 'Commercial negotiation on volume discount & credit days' },
              { name: '5. Won', prob: '100%', desc: 'Purchase order issued & manufacturing scheduled' },
              { name: '6. Lost', prob: '0%', desc: 'Project cancelled or awarded to competitor' }
            ].map(st => (
              <div key={st.name} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">{st.name}</h4>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    {st.prob} Win
                  </span>
                </div>
                <p className="text-slate-500 leading-snug">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Reset Demo Data */}
      {activeTab === 'reset' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Demo Environment & Data Persistence</h3>
            <p className="text-xs text-slate-500">
              The CRM saves all edits, created records, and converted leads to your browser's persistent storage.
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Restore Factory Demo Dataset</p>
              <p className="leading-relaxed">
                If you have modified records, created test customers, or want a clean demonstration for a new client presentation, clicking below will reset all CRM modules back to the standard 28+ road-marking customer records, 36+ leads, and realistic NHAI tenders.
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Demo Data to Defaults</span>
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reset Demo Data?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will restore the entire Sunrise Overseas sample database to default records. Any custom customers or quotations added during this test session will be reset.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs"
              >
                Yes, Restore Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
