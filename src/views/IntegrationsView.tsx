import React, { useState } from 'react';
import { 
  Radio, 
  MessageSquare, 
  Mail, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Settings, 
  X, 
  Send,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';

export const IntegrationsView: React.FC = () => {
  const { showToast } = useCRM();

  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  const [testMobile, setTestMobile] = useState('+91 98201 44521');
  const [testPayloadStatus, setTestPayloadStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  const integrations = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API (Meta)',
      icon: MessageSquare,
      category: 'Customer Messaging',
      status: 'Demo Connected',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Send automated quotation updates, dispatch notifications, and lab test certificates directly to contractor engineers via verified WhatsApp sender.',
      connectedSince: 'Oct 2026'
    },
    {
      id: 'email',
      name: 'Enterprise Email (SMTP / SendGrid)',
      icon: Mail,
      category: 'Communications',
      status: 'Demo Configured',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Dispatch official PDF quotations, order confirmations, and monthly statements of account directly from sales@sunriseoverseas.in.',
      connectedSince: 'Sep 2026'
    },
    {
      id: 'calendar',
      name: 'Google & Microsoft Outlook Calendar Sync',
      icon: Calendar,
      category: 'Scheduling',
      status: 'Ready to Sync',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      description: 'Synchronize pre-bid tender meetings, site trials, and client follow-ups directly with sales executive mobile calendars.',
      connectedSince: 'Not connected'
    },
    {
      id: 'maps',
      name: 'Google Maps Highway Geo-Tracker',
      icon: MapPin,
      category: 'Field Operations',
      status: 'Demo Connected',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Map expressway project chainages (Km markers), site depot locations, and field visit logs.',
      connectedSince: 'Aug 2026'
    }
  ];

  const handleTestConnection = (e: React.FormEvent) => {
    e.preventDefault();
    setTestPayloadStatus('testing');
    setTimeout(() => {
      setTestPayloadStatus('success');
      showToast(`Test payload successfully simulated for ${testingIntegration}!`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Integrations</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
              Demo Simulation Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Connect messaging channels, transactional email, and calendar synchronization.
          </p>
        </div>
      </div>

      {/* Honest Transparency Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Integration Environment Policy:
        </p>
        <p className="leading-relaxed">
          The application is running in an interactive demo sandbox. Real WhatsApp Business API, SMTP, or Outlook OAuth credentials can be configured in production via enterprise environment variables. Below, you can explore configurations and test simulated message dispatches.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => {
          const Icon = item.icon;

          return (
            <div 
              key={item.id} 
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{item.name}</h3>
                      <span className="text-[11px] text-slate-400 font-medium">{item.category}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {item.connectedSince === 'Not connected' ? 'Not yet linked' : `Active: ${item.connectedSince}`}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTestingIntegration(item.name);
                      setTestPayloadStatus('idle');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Test Payload
                  </button>
                  <button
                    onClick={() => showToast(`Opening settings for ${item.name}...`)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Test Connection Modal */}
      {testingIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Simulate Test Dispatch</h3>
              <button onClick={() => setTestingIntegration(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Trigger a test webhook event for <strong className="text-slate-800">{testingIntegration}</strong>.
            </p>

            <form onSubmit={handleTestConnection} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination Phone / Endpoint</label>
                <input
                  type="text"
                  value={testMobile}
                  onChange={(e) => setTestMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700">
                Payload Preview:
                <div className="text-blue-700 mt-1">
                  &#123; "event": "QUOTATION_DISPATCH", "client": "Dilip Buildcon", "quote_ref": "QT-2024-001" &#125;
                </div>
              </div>

              {testPayloadStatus === 'success' && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Payload accepted by mock API webhook! Status 200 OK.</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTestingIntegration(null)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={testPayloadStatus === 'testing'}
                  className="px-5 py-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  {testPayloadStatus === 'testing' ? 'Simulating...' : 'Send Test Ping'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
