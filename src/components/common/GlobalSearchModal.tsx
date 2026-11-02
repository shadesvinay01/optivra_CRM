import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Users, 
  Target, 
  Building2, 
  FileText, 
  ShoppingCart, 
  UserCheck, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useCRM, NavigationTab } from '../../context/CRMContext';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    customers, 
    leads, 
    tenders, 
    quotations, 
    orders, 
    employees, 
    setCurrentTab,
    openCustomerProfile
  } = useCRM();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'customers' | 'leads' | 'tenders' | 'quotations' | 'orders' | 'team'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Global keydown listener for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter datasets
  const matchedCustomers = !q ? [] : customers.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.city.toLowerCase().includes(q) || 
    c.state.toLowerCase().includes(q) ||
    c.contactPerson.toLowerCase().includes(q)
  );

  const matchedLeads = !q ? [] : leads.filter(l => 
    l.leadName.toLowerCase().includes(q) || 
    l.organization.toLowerCase().includes(q) || 
    l.productInterest.toLowerCase().includes(q) ||
    l.state.toLowerCase().includes(q)
  );

  const matchedTenders = !q ? [] : tenders.filter(t => 
    t.tenderTitle.toLowerCase().includes(q) || 
    t.tenderId.toLowerCase().includes(q) || 
    t.department.toLowerCase().includes(q) ||
    t.location.toLowerCase().includes(q)
  );

  const matchedQuotations = !q ? [] : quotations.filter(qt => 
    qt.quotationNumber.toLowerCase().includes(q) || 
    qt.customerName.toLowerCase().includes(q)
  );

  const matchedOrders = !q ? [] : orders.filter(o => 
    o.orderNumber.toLowerCase().includes(q) || 
    o.customerName.toLowerCase().includes(q)
  );

  const matchedEmployees = !q ? [] : employees.filter(e => 
    e.name.toLowerCase().includes(q) || 
    e.department.toLowerCase().includes(q) || 
    e.assignedStates.some(s => s.toLowerCase().includes(q))
  );

  const totalResults = matchedCustomers.length + matchedLeads.length + matchedTenders.length + 
                       matchedQuotations.length + matchedOrders.length + matchedEmployees.length;

  const navigateTo = (tab: NavigationTab, customerId?: string) => {
    setCurrentTab(tab);
    if (customerId) openCustomerProfile(customerId);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search clients, leads, tenders, quotes, orders..."
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-base font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-200/60 hover:bg-slate-200 rounded-md transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-50 border-b border-slate-200 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all' ? 'bg-white text-blue-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Results ({totalResults})
          </button>
          <button
            onClick={() => setActiveCategory('customers')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'customers' ? 'bg-white text-blue-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Customers ({matchedCustomers.length})
          </button>
          <button
            onClick={() => setActiveCategory('leads')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'leads' ? 'bg-white text-blue-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Leads ({matchedLeads.length})
          </button>
          <button
            onClick={() => setActiveCategory('tenders')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'tenders' ? 'bg-white text-blue-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tenders ({matchedTenders.length})
          </button>
          <button
            onClick={() => setActiveCategory('quotations')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'quotations' ? 'bg-white text-blue-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Quotes ({matchedQuotations.length})
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {!q ? (
            <div className="py-12 text-center">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Quick Global Search</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Search across all 28+ road-marking clients, 36+ leads, NHAI & PWD tenders, orders, and sales targets.
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-slate-700">No matching records found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "NHAI", "Dilip", "Thermoplastic", "Pune", or "Paint".</p>
            </div>
          ) : (
            <>
              {/* Customers Section */}
              {(activeCategory === 'all' || activeCategory === 'customers') && matchedCustomers.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Customers ({matchedCustomers.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedCustomers.map(c => (
                      <div
                        key={c.id}
                        onClick={() => navigateTo('customers', c.id)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50/60 cursor-pointer border border-transparent hover:border-blue-100 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 truncate">{c.name}</p>
                          <p className="text-xs text-slate-500 truncate">{c.type} • {c.city}, {c.state} • Contact: {c.contactPerson}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {c.status}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leads Section */}
              {(activeCategory === 'all' || activeCategory === 'leads') && matchedLeads.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>Leads & Enquiries ({matchedLeads.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedLeads.map(l => (
                      <div
                        key={l.id}
                        onClick={() => navigateTo('leads')}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-emerald-50/60 cursor-pointer border border-transparent hover:border-emerald-100 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 truncate">{l.leadName}</p>
                          <p className="text-xs text-slate-500 truncate">{l.organization} • {l.productInterest}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <span className="text-xs font-semibold text-slate-700">₹{(l.estimatedValue / 100000).toFixed(1)}L</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                            {l.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tenders Section */}
              {(activeCategory === 'all' || activeCategory === 'tenders') && matchedTenders.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Tenders & Projects ({matchedTenders.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedTenders.map(t => (
                      <div
                        key={t.id}
                        onClick={() => navigateTo('tenders')}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-purple-50/60 cursor-pointer border border-transparent hover:border-purple-100 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-purple-700 truncate">{t.tenderTitle}</p>
                          <p className="text-xs text-slate-500 truncate">{t.tenderId} • {t.department} • Due: {t.submissionDeadline}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <span className="text-xs font-semibold text-slate-800">₹{(t.estimatedValue / 10000000).toFixed(2)} Cr</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">
                            {t.approvalStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quotations Section */}
              {(activeCategory === 'all' || activeCategory === 'quotations') && matchedQuotations.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Quotations ({matchedQuotations.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedQuotations.map(qt => (
                      <div
                        key={qt.id}
                        onClick={() => navigateTo('quotations')}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-50/60 cursor-pointer border border-transparent hover:border-amber-100 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-amber-700 truncate">{qt.quotationNumber} — {qt.customerName}</p>
                          <p className="text-xs text-slate-500 truncate">{qt.lineItems.length} items • Valid until {qt.validityDate}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <span className="text-xs font-bold text-slate-900">₹{(qt.grandTotal / 100000).toFixed(2)}L</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                            {qt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Section */}
              {(activeCategory === 'all' || activeCategory === 'orders') && matchedOrders.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Orders ({matchedOrders.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedOrders.map(o => (
                      <div
                        key={o.id}
                        onClick={() => navigateTo('orders')}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50/60 cursor-pointer border border-transparent hover:border-blue-100 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 truncate">{o.orderNumber} — {o.customerName}</p>
                          <p className="text-xs text-slate-500 truncate">Delivery: {o.expectedDelivery}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <span className="text-xs font-bold text-slate-900">₹{(o.orderValue / 100000).toFixed(2)}L</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                            {o.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Section */}
              {(activeCategory === 'all' || activeCategory === 'team') && matchedEmployees.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Team Members ({matchedEmployees.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedEmployees.map(e => (
                      <div
                        key={e.id}
                        onClick={() => navigateTo('employees')}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{e.name}</p>
                          <p className="text-xs text-slate-500 truncate">{e.role} • {e.department} • Territories: {e.assignedStates.join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <span className="text-xs text-slate-600">{e.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Navigate with arrows or click to open</span>
          <span className="font-semibold text-slate-700">Sunrise Overseas Enterprise DB</span>
        </div>
      </div>
    </div>
  );
};
