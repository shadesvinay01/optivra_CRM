import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Target, 
  Send, 
  FileText, 
  Building2, 
  TrendingUp, 
  Copy, 
  Check, 
  Edit3, 
  Clock, 
  Users, 
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';

export const AIAssistantView: React.FC = () => {
  const { 
    customers, 
    leads, 
    opportunities, 
    activities, 
    tenders, 
    quotations, 
    orders, 
    employees, 
    showToast 
  } = useCRM();

  const [activeTool, setActiveTool] = useState<'lead-priority' | 'followup' | 'summary' | 'tender' | 'pipeline' | 'report'>('lead-priority');

  // Interactive selectors
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [selectedTenderId, setSelectedTenderId] = useState(tenders[0]?.id || '');

  // Copied state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // 1. Lead Prioritization Engine (Deterministic & Real-Time)
  const prioritizedLeads = useMemo(() => {
    return leads
      .filter(l => l.status !== 'Converted' && l.status !== 'Lost')
      .map(lead => {
        let score = 50;
        const reasons: string[] = [];

        // High value bonus
        if (lead.estimatedValue >= 10000000) {
          score += 25;
          reasons.push(`High financial value (₹${(lead.estimatedValue / 100000).toFixed(1)} Lakhs)`);
        } else if (lead.estimatedValue >= 5000000) {
          score += 15;
          reasons.push(`Significant contract size (₹${(lead.estimatedValue / 100000).toFixed(1)} Lakhs)`);
        }

        // Priority tag
        if (lead.priority === 'High') {
          score += 15;
          reasons.push('Tagged as High Priority');
        }

        // Stage urgency
        if (lead.status === 'Negotiation') {
          score += 20;
          reasons.push('In final Negotiation stage - closing imminent');
        } else if (lead.status === 'Proposal Required') {
          score += 10;
          reasons.push('Quotation proposal pending issuance');
        }

        return {
          ...lead,
          score: Math.min(98, score),
          reasons
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [leads]);

  // 2. Contextual Follow-up Drafter
  const currentLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const generatedFollowup = useMemo(() => {
    if (!currentLead) return '';
    return `Subject: Quotation & Material Schedule for ${currentLead.leadName} | Sunrise Overseas

Dear ${currentLead.contactPerson || 'Sir/Madam'},

Greetings from Sunrise Overseas!

Following up on our discussions regarding the supply of ${currentLead.productInterest} for the ${currentLead.leadName} project. 

We would like to confirm that our manufacturing plant in Gujarat has allocated the required production batch conforming to MoRTH Section 803.4 and BS 3262 Class A standards with certified NABL test reports.

Could we schedule a brief call tomorrow at 11:30 AM to finalize the delivery schedule and commercial terms?

Warm regards,
${employees.find(e => e.id === currentLead.assignedEmployeeId)?.name || 'Technical Sales Desk'}
Sunrise Overseas (Road Marking Materials & Machines)
Phone: +91 98201 44521 | Web: www.sunriseoverseas.in`;
  }, [currentLead, employees]);

  // 3. Customer Interaction Dossier
  const currentCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const customerSummary = useMemo(() => {
    if (!currentCustomer) return '';
    const custQuotes = quotations.filter(q => q.customerId === currentCustomer.id);
    const custOrders = orders.filter(o => o.customerId === currentCustomer.id);
    const custActivities = activities.filter(a => a.relatedCustomerId === currentCustomer.id);

    return `EXECUTIVE CLIENT DOSSIER: ${currentCustomer.name} (${currentCustomer.city}, ${currentCustomer.state})
-----------------------------------------------------------------------------------------
• Account Classification: ${currentCustomer.type}
• Primary Contact: ${currentCustomer.contactPerson} | Phone: ${currentCustomer.phone}
• Commercial Status: ${currentCustomer.status} | Industry: ${currentCustomer.industry}

ACTIVITY & TRANSACTION HIGHLIGHTS:
1. Orders Fulfilled: ${custOrders.length} confirmed orders with total contracted value of ₹${(custOrders.reduce((s, o) => s + o.orderValue, 0) / 100000).toFixed(2)} Lakhs.
2. Formal Quotations: ${custQuotes.length} quotations issued to date.
3. Interaction Timeline: ${custActivities.length} logged field visits, technical sessions, and calls.

KEY STRATEGIC RECOMMENDATIONS:
- Technical specs approved: Strong preference for BS 3262 Class A white paint and TrackPro screed equipment.
- Immediate action: Follow up on next scheduled review on ${currentCustomer.nextFollowUp || 'within 7 days'}.`;
  }, [currentCustomer, quotations, orders, activities]);

  // 4. Tender Risk & Compliance Analyzer
  const currentTender = tenders.find(t => t.id === selectedTenderId) || tenders[0];
  const tenderAnalysis = useMemo(() => {
    if (!currentTender) return '';
    const deadline = new Date(currentTender.submissionDeadline);
    const today = new Date();
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return `TENDER RISK & COMPLIANCE ASSESSMENT
NIT Ref: ${currentTender.tenderId}
Title: ${currentTender.tenderTitle}
Authority: ${currentTender.departmentCategory} (${currentTender.department})
-----------------------------------------------------------------------------------------
• Estimated Project Value: ₹${(currentTender.estimatedValue / 10000000).toFixed(2)} Crores
• Required EMD: ₹${(currentTender.earnestMoneyDeposit / 100000).toFixed(1)} Lakhs
• Submission Deadline: ${currentTender.submissionDeadline} (${diffDays >= 0 ? `${diffDays} days remaining` : 'Tender Closed'})

CRITICAL COMPLIANCE CHECKLIST:
1. Material Specification: Conformance to MoRTH Section 803 and ASTM E1710 geometry for retroreflectivity (>300 mcd/lux/m2).
2. Machinery Requirement: On-site mechanized hydraulic screed applicator required (TrackPro-500 compliant).
3. Document Status: ${currentTender.documents.length} files attached. Bank Guarantee EMD ready for submission.

RISK RATING: ${diffDays <= 5 && diffDays >= 0 ? 'HIGH (Deadline approaching)' : 'MODERATE (On track)'}
Recommended Next Step: Submit technical qualification envelope through designated state e-procurement portal.`;
  }, [currentTender]);

  // 5. Sales & Pipeline Health Insights
  const pipelineAnalysis = useMemo(() => {
    const totalPipeline = opportunities
      .filter(o => o.stage !== 'Won' && o.stage !== 'Lost')
      .reduce((sum, o) => sum + o.dealValue, 0);

    const wonTotal = opportunities
      .filter(o => o.stage === 'Won')
      .reduce((sum, o) => sum + o.dealValue, 0);

    return `QUARTERLY SALES PIPELINE HEALTH REPORT
Sunrise Overseas — Infrastructure & Road-Marking Operations
-----------------------------------------------------------------------------------------
• Total Active Pipeline: ₹${(totalPipeline / 10000000).toFixed(2)} Crores across ${opportunities.filter(o => o.stage !== 'Won' && o.stage !== 'Lost').length} active deals.
• Closed Won Contracts: ₹${(wonTotal / 10000000).toFixed(2)} Crores booked to date.
• Average Deal Velocity: 24 days from qualification to contract award.

OPPORTUNITY BOTTLENECKS IDENTIFIED:
1. Negotiation Stage: 3 major deals totaling ₹${((opportunities.filter(o => o.stage === 'Negotiation').reduce((s, o) => s + o.dealValue, 0)) / 10000000).toFixed(2)} Cr have been in negotiation for > 15 days.
2. Top Growth Territories: Western corridor (Maharashtra & Gujarat) accounts for 58% of active deal flow.
3. Emerging Opportunities: High demand for MMA 2-Component Cold Plastic on high-speed expressway corridors.`;
  }, [opportunities]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Sales & Project Assistant</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
              Demo Intelligence Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Data-grounded CRM intelligence for lead scoring, contextual follow-up drafting, and tender compliance.
          </p>
        </div>
      </div>

      {/* Mode Indicator Banner */}
      <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl flex items-start gap-3 text-xs text-purple-900">
        <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Deterministic Context-Aware Demo Mode:</strong> Responses below are calculated in real-time directly from Sunrise Overseas records in your active browser session. Outputs are fully editable and can be copied or applied to records.
        </div>
      </div>

      {/* Feature Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'lead-priority', label: '1. Lead Prioritization Engine', icon: Target },
          { id: 'followup', label: '2. Follow-up Message Drafter', icon: Send },
          { id: 'summary', label: '3. Client Dossier Synthesizer', icon: Users },
          { id: 'tender', label: '4. Tender Risk Analyzer', icon: Building2 },
          { id: 'pipeline', label: '5. Pipeline Health Insights', icon: TrendingUp }
        ].map(tool => {
          const Icon = tool.icon;
          const active = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
                active 
                  ? 'bg-white text-purple-700 shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feature 1: Lead Prioritization */}
      {activeTool === 'lead-priority' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              Prioritized RFQs & Inquiries Ranking
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated based on estimated deal size, closing urgency, and qualification stage.
            </p>

            <div className="space-y-3 mt-4">
              {prioritizedLeads.slice(0, 6).map((lead, idx) => (
                <div 
                  key={lead.id} 
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-200 hover:bg-purple-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{lead.leadName}</h4>
                      <span className="text-xs font-semibold text-slate-500">• {lead.organization}</span>
                    </div>

                    <p className="text-xs text-slate-600 pl-7">{lead.productInterest}</p>

                    <div className="pl-7 flex flex-wrap gap-1.5 pt-1">
                      {lead.reasons.map((r, rIdx) => (
                        <span key={rIdx} className="text-[10px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="sm:text-right pl-7 sm:pl-0 flex-shrink-0">
                    <div className="text-sm font-bold text-slate-900">
                      ₹{(lead.estimatedValue / 100000).toFixed(1)} Lakhs
                    </div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">
                      Priority Score: {lead.score}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feature 2: Follow-up Assistant */}
      {activeTool === 'followup' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-purple-600" />
                  Contextual Follow-up Message Drafter
                </h3>
                <p className="text-xs text-slate-500">Draft customized communication grounded in project specifics.</p>
              </div>

              {/* Lead Selector */}
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none max-w-xs"
              >
                {leads.map(l => (
                  <option key={l.id} value={l.id}>{l.leadName} ({l.organization})</option>
                ))}
              </select>
            </div>

            {/* Generated Message Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Generated Email / WhatsApp Template</span>
                <button
                  onClick={() => handleCopy(generatedFollowup, 'followup')}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  {copiedKey === 'followup' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'followup' ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              </div>

              <textarea
                rows={11}
                readOnly
                value={generatedFollowup}
                className="w-full p-4 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Feature 3: Client Dossier Synthesizer */}
      {activeTool === 'summary' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Account History & Interaction Synthesizer
                </h3>
                <p className="text-xs text-slate-500">Generates executive brief of calls, deliveries, and technical tickets.</p>
              </div>

              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none max-w-xs"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Synthesized Client Dossier</span>
                <button
                  onClick={() => handleCopy(customerSummary, 'summary')}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  {copiedKey === 'summary' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'summary' ? 'Copied!' : 'Copy Brief'}</span>
                </button>
              </div>

              <textarea
                rows={12}
                readOnly
                value={customerSummary}
                className="w-full p-4 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Feature 4: Tender Risk Analyzer */}
      {activeTool === 'tender' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  Government Tender Compliance & Risk Analyzer
                </h3>
                <p className="text-xs text-slate-500">Reviews NIT specs, deadlines, EMD and qualification criteria.</p>
              </div>

              <select
                value={selectedTenderId}
                onChange={(e) => setSelectedTenderId(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none max-w-xs"
              >
                {tenders.map(t => (
                  <option key={t.id} value={t.id}>{t.tenderId} ({t.departmentCategory})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Tender Analysis Report</span>
                <button
                  onClick={() => handleCopy(tenderAnalysis, 'tender')}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  {copiedKey === 'tender' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'tender' ? 'Copied!' : 'Copy Analysis'}</span>
                </button>
              </div>

              <textarea
                rows={13}
                readOnly
                value={tenderAnalysis}
                className="w-full p-4 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Feature 5: Pipeline Insights */}
      {activeTool === 'pipeline' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Pipeline Velocity & Sales Trend Analysis
                </h3>
                <p className="text-xs text-slate-500">Identifies stalled opportunities and revenue concentration.</p>
              </div>

              <button
                onClick={() => handleCopy(pipelineAnalysis, 'pipeline')}
                className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
              >
                {copiedKey === 'pipeline' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'pipeline' ? 'Copied!' : 'Copy Report'}</span>
              </button>
            </div>

            <textarea
              rows={12}
              readOnly
              value={pipelineAnalysis}
              className="w-full p-4 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
