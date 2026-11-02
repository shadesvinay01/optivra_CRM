import React, { useState } from 'react';
import { 
  FileText, 
  ShoppingCart, 
  Plus, 
  Search, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Trash2, 
  Edit2, 
  Eye, 
  Building2, 
  X,
  Truck,
  IndianRupee,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Quotation, Order, QuotationLineItem, QuotationStatus, OrderStatus } from '../types';

export const QuotationsOrdersView: React.FC = () => {
  const { 
    quotations, 
    orders, 
    addQuotation, 
    updateQuotation, 
    deleteQuotation, 
    updateQuotationStatus, 
    convertQuotationToOrder, 
    updateOrderStatus,
    updateOrderPaymentStatus,
    customers, 
    catalog, 
    employees,
    openCustomerProfile,
    showToast
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'quotations' | 'orders'>('quotations');
  const [searchTerm, setSearchTerm] = useState('');

  // Quotation Modals
  const [isCreateQuoteOpen, setIsCreateQuoteOpen] = useState(false);
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);

  // Filtered lists
  const filteredQuotations = quotations.filter(q => 
    q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quotations & Orders</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Commercial proposals, automated GST calculations, official printouts, and production orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Tabs Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('quotations')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'quotations' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Quotations ({quotations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'orders' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
            </button>
          </div>

          {activeTab === 'quotations' && (
            <button
              onClick={() => setIsCreateQuoteOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Quote</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeTab === 'quotations' ? "Search quotes by number, client..." : "Search orders by number, client..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600"
          />
        </div>
        <span className="text-xs text-slate-400">
          Showing {activeTab === 'quotations' ? filteredQuotations.length : filteredOrders.length} records
        </span>
      </div>

      {/* Quotations View */}
      {activeTab === 'quotations' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Quotation No.</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Taxable Subtotal</th>
                  <th className="py-3 px-3">GST Total</th>
                  <th className="py-3 px-3">Grand Total</th>
                  <th className="py-3 px-3">Validity</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{q.quotationNumber}</td>
                    <td className="py-3.5 px-3">
                      <div 
                        onClick={() => openCustomerProfile(q.customerId)}
                        className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer"
                      >
                        {q.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400">Date: {q.createdAt}</div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">
                      {q.lineItems.length} Products
                    </td>
                    <td className="py-3.5 px-3 text-slate-800">
                      ₹{q.subtotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      ₹{q.taxTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 text-sm">
                      ₹{q.grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {q.validityDate}
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={q.status}
                        onChange={(e) => updateQuotationStatus(q.id, e.target.value as QuotationStatus)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border outline-none ${
                          q.status === 'Accepted' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          q.status === 'Under Review' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          q.status === 'Sent' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          q.status === 'Rejected' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewQuotation(q)}
                          className="px-2.5 py-1 text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="View Official Printable Quotation"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View / Print</span>
                        </button>

                        {q.status === 'Accepted' && (
                          <button
                            onClick={() => convertQuotationToOrder(q.id)}
                            className="px-2.5 py-1 text-white bg-emerald-600 hover:bg-emerald-700 rounded text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                            title="Convert to Confirmed Order"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Book Order</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders View */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Order No.</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Quotation Ref</th>
                  <th className="py-3 px-3">Order Value</th>
                  <th className="py-3 px-3">Fulfillment Status</th>
                  <th className="py-3 px-3">Payment Status</th>
                  <th className="py-3 px-3">Expected Delivery</th>
                  <th className="py-3 px-4 text-right">Site Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                    <td className="py-3.5 px-3">
                      <div 
                        onClick={() => openCustomerProfile(ord.customerId)}
                        className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer"
                      >
                        {ord.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400">Booked: {ord.orderDate}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">
                      {ord.relatedQuotationNumber || 'Direct PO'}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 text-sm">
                      ₹{ord.orderValue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-white outline-none cursor-pointer"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing (Factory)</option>
                        <option value="Dispatched">Dispatched (In Transit)</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={ord.paymentStatus}
                        onChange={(e) => updateOrderPaymentStatus(ord.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border outline-none ${
                          ord.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          ord.paymentStatus === 'Partial' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        <option value="Pending">Payment Pending</option>
                        <option value="Partial">Partial Advance</option>
                        <option value="Paid">Fully Paid</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">
                      {ord.expectedDelivery}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[11px] text-slate-500 truncate block max-w-xs ml-auto">
                        {ord.shippingAddress}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Printable Quotation Modal with Sunrise Overseas Letterhead */}
      {previewQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 space-y-6 max-h-[95vh] overflow-y-auto">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 no-print">
              <span className="text-xs font-semibold text-slate-500 uppercase">Official Commercial Quotation</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setPreviewQuotation(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Area with Letterhead */}
            <div id="printable-area" className="p-4 bg-white text-slate-900 space-y-6 text-xs">
              {/* Letterhead Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">Sunrise Overseas</h2>
                  <p className="text-[11px] font-semibold text-slate-600 mt-0.5">Manufacturers of High Performance Thermoplastic Road Marking Materials & Machinery</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Works: Plot 18-20, GIDC Industrial Estate, Umbergaon, Gujarat - 396171<br/>
                    Corporate Office: 402, Trade Square, Bandra-Kurla Complex, Mumbai, MH - 400051<br/>
                    GSTIN: 24AAACS9981A1ZZ | CIN: U24220MH2012PTC228190 | Web: www.sunriseoverseas.in
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold bg-slate-100 px-3 py-1 rounded inline-block font-mono">
                    {previewQuotation.quotationNumber}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Date: {previewQuotation.createdAt}</p>
                  <p className="text-[10px] font-semibold text-slate-700">Valid Until: {previewQuotation.validityDate}</p>
                </div>
              </div>

              {/* Client & Billing Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Quotation Issued To:</span>
                  <p className="font-bold text-sm text-slate-900 mt-0.5">{previewQuotation.customerName}</p>
                  <p className="text-[11px] text-slate-600">Road Infrastructure & Contracting Division</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sales Executive:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {employees.find(e => e.id === previewQuotation.assignedEmployeeId)?.name || 'Technical Sales Desk'}
                  </p>
                  <p className="text-[11px] text-slate-500">Sunrise Overseas Key Accounts</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <table className="w-full text-left border border-slate-300">
                  <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 border-b border-slate-300">
                    <tr>
                      <th className="py-2 px-2.5">S.No</th>
                      <th className="py-2 px-2.5">Description & Specification</th>
                      <th className="py-2 px-2.5">HSN Code</th>
                      <th className="py-2 px-2.5 text-right">Qty</th>
                      <th className="py-2 px-2.5 text-right">Unit Rate (₹)</th>
                      <th className="py-2 px-2.5 text-right">Disc %</th>
                      <th className="py-2 px-2.5 text-right">GST %</th>
                      <th className="py-2 px-2.5 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    {previewQuotation.lineItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-2.5">{idx + 1}</td>
                        <td className="py-2.5 px-2.5 font-medium">{item.description}</td>
                        <td className="py-2.5 px-2.5 font-mono text-slate-600">{item.hsn}</td>
                        <td className="py-2.5 px-2.5 text-right">{item.quantity} {item.unit}</td>
                        <td className="py-2.5 px-2.5 text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-2.5 text-right">{item.discountPercent}%</td>
                        <td className="py-2.5 px-2.5 text-right">{item.gstRate}%</td>
                        <td className="py-2.5 px-2.5 text-right font-bold">₹{item.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Calculations */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal:</span>
                    <span>₹{previewQuotation.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Discount:</span>
                    <span>- ₹{previewQuotation.discountTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST + SGST (18%):</span>
                    <span>₹{previewQuotation.taxTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-300">
                    <span>Grand Total:</span>
                    <span>₹{previewQuotation.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Certification */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">Commercial Terms & Technical Warranty:</p>
                <p>1. {previewQuotation.terms}</p>
                <p>2. Quality Standards: Conforms to MoRTH Section 803.4 and BS 3262 Class A specification with guaranteed minimum retroreflectivity.</p>
                <p>3. NABL test certificates will accompany each dispatch batch.</p>
              </div>

              {/* Authorized Signature */}
              <div className="pt-6 flex justify-between items-end">
                <div className="text-[10px] text-slate-400">
                  System Generated Quotation Ref: {previewQuotation.id}
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">For Sunrise Overseas</div>
                  <div className="h-10"></div>
                  <div className="text-[11px] font-bold text-slate-900 border-t border-slate-400 pt-1">Authorized Signatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Quotation Modal */}
      {isCreateQuoteOpen && (
        <CreateQuotationModal
          isOpen={isCreateQuoteOpen}
          customers={customers}
          catalog={catalog}
          employees={employees}
          onClose={() => setIsCreateQuoteOpen(false)}
          onSave={(newQuote) => {
            addQuotation(newQuote as any);
            setIsCreateQuoteOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Create Quotation Modal Component
interface CreateQuoteProps {
  isOpen: boolean;
  customers: any[];
  catalog: any[];
  employees: any[];
  onClose: () => void;
  onSave: (quote: any) => void;
}

const CreateQuotationModal: React.FC<CreateQuoteProps> = ({
  customers,
  catalog,
  employees,
  onClose,
  onSave
}) => {
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [validityDate, setValidityDate] = useState(new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(employees[0]?.id || 'emp-1');
  const [terms, setTerms] = useState('1. Prices FOR destination site. 2. 30% advance, balance against dispatch. 3. Warranty 12 months.');

  // Line items state
  const [items, setItems] = useState<Array<{
    catalogId: string;
    description: string;
    hsn: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    discountPercent: number;
    gstRate: number;
  }>>([
    {
      catalogId: catalog[0]?.id || 'prod-1',
      description: catalog[0]?.name || 'Thermoplastic Road Marking Paint',
      hsn: catalog[0]?.hsn || '32089090',
      quantity: 50,
      unit: catalog[0]?.unit || 'MT',
      unitPrice: catalog[0]?.defaultPrice || 58000,
      discountPercent: 3,
      gstRate: 18
    }
  ]);

  const handleAddItem = () => {
    const defaultProd = catalog[1] || catalog[0];
    setItems([
      ...items,
      {
        catalogId: defaultProd?.id || '',
        description: defaultProd?.name || 'Road Marking Material',
        hsn: defaultProd?.hsn || '32089090',
        quantity: 10,
        unit: defaultProd?.unit || 'MT',
        unitPrice: defaultProd?.defaultPrice || 50000,
        discountPercent: 0,
        gstRate: 18
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    if (field === 'catalogId') {
      const selected = catalog.find(p => p.id === value);
      if (selected) {
        updated[index] = {
          ...updated[index],
          catalogId: value,
          description: selected.name,
          hsn: selected.hsn,
          unit: selected.unit,
          unitPrice: selected.defaultPrice,
          gstRate: selected.gstRate
        };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setItems(updated);
  };

  // Calculations
  const processedItems: QuotationLineItem[] = items.map((it, idx) => {
    const gross = it.quantity * it.unitPrice;
    const disc = (gross * it.discountPercent) / 100;
    const taxable = gross - disc;
    const gst = (taxable * it.gstRate) / 100;
    const total = taxable + gst;
    return {
      id: `li-${idx + 1}`,
      description: it.description,
      hsn: it.hsn,
      quantity: Number(it.quantity),
      unit: it.unit,
      unitPrice: Number(it.unitPrice),
      discountPercent: Number(it.discountPercent),
      gstRate: Number(it.gstRate),
      total: Math.round(total)
    };
  });

  const subtotal = processedItems.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
  const discountTotal = processedItems.reduce((sum, it) => sum + ((it.quantity * it.unitPrice * it.discountPercent) / 100), 0);
  const grandTotal = processedItems.reduce((sum, it) => sum + it.total, 0);
  const taxTotal = grandTotal - (subtotal - discountTotal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCust = customers.find(c => c.id === customerId);

    onSave({
      customerId,
      customerName: matchedCust ? matchedCust.name : 'Customer',
      lineItems: processedItems,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
      validityDate,
      status: 'Sent',
      assignedEmployeeId,
      terms
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Generate Commercial Quotation</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer *</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white outline-none"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Validity Date</label>
              <input
                type="date"
                value={validityDate}
                onChange={(e) => setValidityDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Lead</label>
              <select
                value={assignedEmployeeId}
                onChange={(e) => setAssignedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white outline-none"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Line items table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Quotation Line Items & Scope</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg border border-slate-200 text-xs">
                  <div className="col-span-5">
                    <select
                      value={item.catalogId}
                      onChange={(e) => handleItemChange(idx, 'catalogId', e.target.value)}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white text-xs"
                    >
                      {catalog.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full p-1.5 border border-slate-200 rounded text-center text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Rate ₹"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                      className="w-full p-1.5 border border-slate-200 rounded text-right text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Disc %"
                      value={item.discountPercent}
                      onChange={(e) => handleItemChange(idx, 'discountPercent', e.target.value)}
                      className="w-full p-1.5 border border-slate-200 rounded text-center text-xs"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-500">Subtotal: ₹{subtotal.toLocaleString('en-IN')}</span>
              <span className="text-slate-500 ml-4">Tax (18% GST): ₹{taxTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-base font-bold text-slate-900">
              Grand Total: ₹{grandTotal.toLocaleString('en-IN')}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Terms & Delivery Conditions</label>
            <textarea
              rows={2}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
            >
              Issue Quotation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
