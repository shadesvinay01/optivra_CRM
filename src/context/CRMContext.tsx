import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Customer, 
  Lead, 
  Opportunity, 
  Activity, 
  Quotation, 
  Order, 
  Tender, 
  FieldVisit, 
  Complaint, 
  PaymentRecovery, 
  Employee, 
  ProductCatalogItem,
  Role,
  AppNotification,
  PipelineStage,
  QuotationStatus,
  OrderStatus,
  PaymentStatus,
  TenderStatus
} from '../types';

import {
  INITIAL_CUSTOMERS,
  INITIAL_LEADS,
  INITIAL_OPPORTUNITIES,
  INITIAL_ACTIVITIES,
  INITIAL_QUOTATIONS,
  INITIAL_ORDERS,
  INITIAL_TENDERS,
  INITIAL_FIELD_VISITS,
  INITIAL_COMPLAINTS,
  INITIAL_PAYMENT_RECOVERIES,
  INITIAL_EMPLOYEES,
  INITIAL_CATALOG
} from '../data/mockData';

export type NavigationTab = 
  | 'overview'
  | 'customers'
  | 'leads'
  | 'pipeline'
  | 'activities'
  | 'quotations'
  | 'orders'
  | 'tenders'
  | 'field-visits'
  | 'complaints'
  | 'payment-recovery'
  | 'employees'
  | 'reports'
  | 'ai-assistant'
  | 'integrations'
  | 'settings';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface CRMContextType {
  // Navigation & Role
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: Employee;
  selectedCustomerIdForProfile: string | null;
  openCustomerProfile: (customerId: string) => void;
  closeCustomerProfile: () => void;

  // Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Quick Create
  isQuickCreateOpen: boolean;
  setIsQuickCreateOpen: (open: boolean) => void;
  quickCreateDefaultTab?: string;
  openQuickCreate: (type?: string) => void;

  // Entities
  customers: Customer[];
  leads: Lead[];
  opportunities: Opportunity[];
  activities: Activity[];
  quotations: Quotation[];
  orders: Order[];
  tenders: Tender[];
  fieldVisits: FieldVisit[];
  complaints: Complaint[];
  paymentRecoveries: PaymentRecovery[];
  employees: Employee[];
  catalog: ProductCatalogItem[];
  notifications: AppNotification[];
  toasts: Toast[];

  // CRUD & Operations
  addCustomer: (cust: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  addLead: (lead: Omit<Lead, 'id' | 'createdDate'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  convertLeadToCustomer: (leadId: string) => Customer;
  convertLeadToOpportunity: (leadId: string, customDetails?: Partial<Opportunity>) => Opportunity;

  addOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt'>) => Opportunity;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  updateOpportunityStage: (id: string, newStage: PipelineStage) => void;

  addActivity: (activity: Omit<Activity, 'id'>) => Activity;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  completeActivity: (id: string, outcome: string) => void;

  addQuotation: (quote: Omit<Quotation, 'id' | 'createdAt' | 'quotationNumber'>) => Quotation;
  updateQuotation: (id: string, updates: Partial<Quotation>) => void;
  deleteQuotation: (id: string) => void;
  updateQuotationStatus: (id: string, status: QuotationStatus) => void;
  convertQuotationToOrder: (quotationId: string) => Order;

  addOrder: (order: Omit<Order, 'id' | 'orderNumber'>) => Order;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrderPaymentStatus: (id: string, status: PaymentStatus) => void;

  addTender: (tender: Omit<Tender, 'id'>) => Tender;
  updateTender: (id: string, updates: Partial<Tender>) => void;
  deleteTender: (id: string) => void;
  updateTenderStatus: (id: string, status: TenderStatus) => void;

  addFieldVisit: (visit: Omit<FieldVisit, 'id'>) => FieldVisit;
  updateFieldVisit: (id: string, updates: Partial<FieldVisit>) => void;

  addComplaint: (cmp: Omit<Complaint, 'id' | 'complaintId'>) => Complaint;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  resolveComplaint: (id: string, notes: string) => void;

  addPaymentRecovery: (rec: Omit<PaymentRecovery, 'id'>) => PaymentRecovery;
  recordPayment: (id: string, amount: number, method: 'NEFT/RTGS' | 'Cheque' | 'UPI' | 'Letter of Credit', reference: string) => void;

  addEmployee: (emp: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;

  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  resetDemoData: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    return (localStorage.getItem('sunrise_crm_role') as Role) || 'Admin';
  });
  const [selectedCustomerIdForProfile, setSelectedCustomerIdForProfile] = useState<string | null>(null);

  // Global modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickCreateDefaultTab, setQuickCreateDefaultTab] = useState<string>('customer');

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper for localStorage state initialization
  const usePersistedState = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(() => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (e) {
        console.error(`Error loading ${key} from localStorage`, e);
        return initialValue;
      }
    });

    useEffect(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (e) {
        console.error(`Error saving ${key} to localStorage`, e);
      }
    }, [key, state]);

    return [state, setState];
  };

  const [employees, setEmployees] = usePersistedState<Employee[]>('sunrise_crm_employees', INITIAL_EMPLOYEES);
  const [customers, setCustomers] = usePersistedState<Customer[]>('sunrise_crm_customers', INITIAL_CUSTOMERS);
  const [leads, setLeads] = usePersistedState<Lead[]>('sunrise_crm_leads', INITIAL_LEADS);
  const [opportunities, setOpportunities] = usePersistedState<Opportunity[]>('sunrise_crm_opportunities', INITIAL_OPPORTUNITIES);
  const [activities, setActivities] = usePersistedState<Activity[]>('sunrise_crm_activities', INITIAL_ACTIVITIES);
  const [quotations, setQuotations] = usePersistedState<Quotation[]>('sunrise_crm_quotations', INITIAL_QUOTATIONS);
  const [orders, setOrders] = usePersistedState<Order[]>('sunrise_crm_orders', INITIAL_ORDERS);
  const [tenders, setTenders] = usePersistedState<Tender[]>('sunrise_crm_tenders', INITIAL_TENDERS);
  const [fieldVisits, setFieldVisits] = usePersistedState<FieldVisit[]>('sunrise_crm_field_visits', INITIAL_FIELD_VISITS);
  const [complaints, setComplaints] = usePersistedState<Complaint[]>('sunrise_crm_complaints', INITIAL_COMPLAINTS);
  const [paymentRecoveries, setPaymentRecoveries] = usePersistedState<PaymentRecovery[]>('sunrise_crm_payments', INITIAL_PAYMENT_RECOVERIES);
  const [catalog] = usePersistedState<ProductCatalogItem[]>('sunrise_crm_catalog', INITIAL_CATALOG);

  // Sync role to localStorage
  useEffect(() => {
    localStorage.setItem('sunrise_crm_role', currentRole);
  }, [currentRole]);

  // Current User based on Role
  const currentUser: Employee = React.useMemo(() => {
    if (currentRole === 'Admin') return employees[0];
    if (currentRole === 'Sales Manager') return employees[1];
    return employees[2];
  }, [currentRole, employees]);

  // Dynamic Notifications derived from CRM state
  const notifications: AppNotification[] = React.useMemo(() => {
    const list: AppNotification[] = [];

    // Tenders with deadline within 7 days
    const today = new Date();
    tenders.forEach((t) => {
      const deadline = new Date(t.submissionDeadline);
      const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 7 && t.approvalStatus !== 'Won' && t.approvalStatus !== 'Lost') {
        list.push({
          id: `notif-tnd-${t.id}`,
          title: 'Upcoming Tender Deadline',
          message: `${t.tenderId}: ${t.tenderTitle.slice(0, 48)}... due in ${diffDays === 0 ? 'today' : diffDays + ' days'}!`,
          type: diffDays <= 3 ? 'urgent' : 'warning',
          timestamp: 'Action required',
          read: false,
          linkTab: 'tenders'
        });
      }
    });

    // Overdue payments
    paymentRecoveries.forEach((p) => {
      if (p.recoveryStatus === 'Overdue') {
        list.push({
          id: `notif-rec-${p.id}`,
          title: 'Overdue Invoice Follow-up',
          message: `${p.customerName} has ₹${(p.outstandingAmount / 100000).toFixed(2)} Lakhs overdue on ${p.invoiceNumber}.`,
          type: 'urgent',
          timestamp: 'Overdue',
          read: false,
          linkTab: 'payment-recovery'
        });
      }
    });

    // Upcoming high priority activities
    activities
      .filter((a) => !a.completed)
      .slice(0, 3)
      .forEach((a) => {
        list.push({
          id: `notif-act-${a.id}`,
          title: `Upcoming ${a.type}`,
          message: `${a.type} with ${a.relatedCustomerName || 'Client'} scheduled on ${a.date} at ${a.time}.`,
          type: 'info',
          timestamp: a.date,
          read: false,
          linkTab: 'activities'
        });
      });

    return list;
  }, [tenders, paymentRecoveries, activities]);

  // Customer Management
  const addCustomer = (custData: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newCust: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast(`Customer "${newCust.name}" added successfully.`);
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Customer record updated.');
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast('Customer removed from records.', 'info');
  };

  // Lead Management
  const addLead = (leadData: Omit<Lead, 'id' | 'createdDate'>): Lead => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setLeads((prev) => [newLead, ...prev]);
    showToast(`Lead "${newLead.leadName}" logged.`);
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
    showToast('Lead details updated.');
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    showToast('Lead deleted.', 'info');
  };

  const convertLeadToCustomer = (leadId: string): Customer => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) throw new Error('Lead not found');

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: targetLead.organization || targetLead.leadName,
      type: 'Contractor',
      contactPerson: targetLead.contactPerson,
      email: targetLead.email,
      phone: targetLead.phone,
      state: targetLead.state,
      city: targetLead.city,
      address: `${targetLead.city}, ${targetLead.state}`,
      assignedEmployeeId: targetLead.assignedEmployeeId,
      source: targetLead.leadSource,
      status: 'Active',
      industry: 'Road & Highway Infrastructure',
      lastContacted: new Date().toISOString().split('T')[0],
      nextFollowUp: targetLead.nextFollowUp || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      notes: `Converted from Lead: ${targetLead.leadName}. Interest: ${targetLead.productInterest}. ${targetLead.notes}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    updateLead(leadId, { status: 'Converted' });
    showToast(`Converted "${targetLead.leadName}" into Customer record.`);
    return newCustomer;
  };

  const convertLeadToOpportunity = (leadId: string, customDetails?: Partial<Opportunity>): Opportunity => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) throw new Error('Lead not found');

    // Ensure customer exists or link to matched customer
    let matchedCustomer = customers.find(
      (c) => c.name.toLowerCase() === targetLead.organization.toLowerCase()
    );
    if (!matchedCustomer) {
      matchedCustomer = convertLeadToCustomer(leadId);
    }

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      name: targetLead.leadName,
      customerId: matchedCustomer.id,
      customerName: matchedCustomer.name,
      dealValue: targetLead.estimatedValue || 1500000,
      assignedEmployeeId: targetLead.assignedEmployeeId,
      expectedClosingDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      priority: targetLead.priority,
      stage: 'Qualified',
      probability: 60,
      notes: `Generated from Lead. Product: ${targetLead.productInterest}. ${targetLead.notes}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...customDetails
    };

    setOpportunities((prev) => [newOpp, ...prev]);
    updateLead(leadId, { status: 'Converted' });
    showToast(`Opportunity "${newOpp.name}" created in Sales Pipeline!`);
    return newOpp;
  };

  // Opportunities / Pipeline
  const addOpportunity = (oppData: Omit<Opportunity, 'id' | 'createdAt'>): Opportunity => {
    const newOpp: Opportunity = {
      ...oppData,
      id: `opp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setOpportunities((prev) => [newOpp, ...prev]);
    showToast(`Opportunity "${newOpp.name}" added to pipeline.`);
    return newOpp;
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
    showToast('Opportunity updated.');
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
    showToast('Opportunity removed.', 'info');
  };

  const updateOpportunityStage = (id: string, newStage: PipelineStage) => {
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        let prob = o.probability;
        if (newStage === 'New Opportunity') prob = 20;
        else if (newStage === 'Qualified') prob = 50;
        else if (newStage === 'Quotation Sent') prob = 70;
        else if (newStage === 'Negotiation') prob = 85;
        else if (newStage === 'Won') prob = 100;
        else if (newStage === 'Lost') prob = 0;
        return { ...o, stage: newStage, probability: prob };
      })
    );
    showToast(`Opportunity moved to ${newStage}.`);
  };

  // Activities
  const addActivity = (actData: Omit<Activity, 'id'>): Activity => {
    const newAct: Activity = {
      ...actData,
      id: `act-${Date.now()}`
    };
    setActivities((prev) => [newAct, ...prev]);
    showToast(`${newAct.type} logged.`);
    return newAct;
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    showToast('Activity updated.');
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast('Activity deleted.', 'info');
  };

  const completeActivity = (id: string, outcome: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: true, outcome } : a))
    );
    showToast('Activity marked completed.');
  };

  // Quotations
  const addQuotation = (quoteData: Omit<Quotation, 'id' | 'createdAt' | 'quotationNumber'>): Quotation => {
    const count = quotations.length + 1;
    const newQuote: Quotation = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      quotationNumber: `QT-2024-${count.toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQuotations((prev) => [newQuote, ...prev]);
    showToast(`Quotation ${newQuote.quotationNumber} generated.`);
    return newQuote;
  };

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
    showToast('Quotation updated.');
  };

  const deleteQuotation = (id: string) => {
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    showToast('Quotation deleted.', 'info');
  };

  const updateQuotationStatus = (id: string, status: QuotationStatus) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
    showToast(`Quotation status changed to ${status}.`);
  };

  const convertQuotationToOrder = (quotationId: string): Order => {
    const quote = quotations.find((q) => q.id === quotationId);
    if (!quote) throw new Error('Quotation not found');

    const count = orders.length + 1;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-2024-${count.toString().padStart(3, '0')}`,
      customerId: quote.customerId,
      customerName: quote.customerName,
      relatedQuotationId: quote.id,
      relatedQuotationNumber: quote.quotationNumber,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: new Date(Date.now() + 86400000 * 20).toISOString().split('T')[0],
      orderValue: quote.grandTotal,
      orderStatus: 'Confirmed',
      paymentStatus: 'Pending',
      assignedEmployeeId: quote.assignedEmployeeId,
      shippingAddress: `Site delivery for ${quote.customerName}`,
      notes: `Generated from accepted Quotation ${quote.quotationNumber}. Total value: ₹${quote.grandTotal.toLocaleString('en-IN')}`
    };

    setOrders((prev) => [newOrder, ...prev]);
    updateQuotation(quotationId, { status: 'Accepted' });

    // Also update matched opportunity if any to Won
    const matchedOpp = opportunities.find((o) => o.customerId === quote.customerId);
    if (matchedOpp) {
      updateOpportunityStage(matchedOpp.id, 'Won');
    }

    showToast(`Order ${newOrder.orderNumber} successfully booked from Quotation!`);
    return newOrder;
  };

  // Orders
  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber'>): Order => {
    const count = orders.length + 1;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-2024-${count.toString().padStart(3, '0')}`
    };
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order ${newOrder.orderNumber} recorded.`);
    return newOrder;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
    showToast('Order updated.');
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, orderStatus: status } : o))
    );
    showToast(`Order status updated to ${status}.`);
  };

  const updateOrderPaymentStatus = (id: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, paymentStatus: status } : o))
    );
    showToast(`Payment status updated to ${status}.`);
  };

  // Tenders
  const addTender = (tenderData: Omit<Tender, 'id'>): Tender => {
    const newTender: Tender = {
      ...tenderData,
      id: `tnd-${Date.now()}`
    };
    setTenders((prev) => [newTender, ...prev]);
    showToast(`Tender ${newTender.tenderId} registered.`);
    return newTender;
  };

  const updateTender = (id: string, updates: Partial<Tender>) => {
    setTenders((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('Tender updated.');
  };

  const deleteTender = (id: string) => {
    setTenders((prev) => prev.filter((t) => t.id !== id));
    showToast('Tender deleted.', 'info');
  };

  const updateTenderStatus = (id: string, status: TenderStatus) => {
    setTenders((prev) =>
      prev.map((t) => (t.id === id ? { ...t, approvalStatus: status } : t))
    );
    showToast(`Tender stage changed to ${status}.`);
  };

  // Field Visits
  const addFieldVisit = (visitData: Omit<FieldVisit, 'id'>): FieldVisit => {
    const newVisit: FieldVisit = {
      ...visitData,
      id: `fv-${Date.now()}`
    };
    setFieldVisits((prev) => [newVisit, ...prev]);
    showToast('Field visit scheduled.');
    return newVisit;
  };

  const updateFieldVisit = (id: string, updates: Partial<FieldVisit>) => {
    setFieldVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
    showToast('Field visit report updated.');
  };

  // Complaints
  const addComplaint = (cmpData: Omit<Complaint, 'id' | 'complaintId'>): Complaint => {
    const count = complaints.length + 1;
    const newCmp: Complaint = {
      ...cmpData,
      id: `cmp-${Date.now()}`,
      complaintId: `CMP-2024-${count.toString().padStart(3, '0')}`
    };
    setComplaints((prev) => [newCmp, ...prev]);
    showToast(`Support ticket ${newCmp.complaintId} created.`);
    return newCmp;
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Complaint status updated.');
  };

  const resolveComplaint = (id: string, notes: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'Resolved', resolutionNotes: notes } : c
      )
    );
    showToast('Complaint marked Resolved.');
  };

  // Payment Recovery
  const addPaymentRecovery = (recData: Omit<PaymentRecovery, 'id'>): PaymentRecovery => {
    const newRec: PaymentRecovery = {
      ...recData,
      id: `rec-${Date.now()}`
    };
    setPaymentRecoveries((prev) => [newRec, ...prev]);
    showToast(`Invoice ${newRec.invoiceNumber} tracked for recovery.`);
    return newRec;
  };

  const recordPayment = (
    id: string,
    amount: number,
    method: 'NEFT/RTGS' | 'Cheque' | 'UPI' | 'Letter of Credit',
    reference: string
  ) => {
    setPaymentRecoveries((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const newReceived = r.amountReceived + amount;
        const newOutstanding = Math.max(0, r.invoiceAmount - newReceived);
        const newStatus =
          newOutstanding <= 0
            ? 'Paid'
            : newReceived > 0
            ? 'Partially Paid'
            : r.recoveryStatus;

        return {
          ...r,
          amountReceived: newReceived,
          outstandingAmount: newOutstanding,
          recoveryStatus: newStatus,
          paymentHistory: [
            ...r.paymentHistory,
            {
              date: new Date().toISOString().split('T')[0],
              amount,
              method,
              reference
            }
          ]
        };
      })
    );
    showToast(`Payment of ₹${amount.toLocaleString('en-IN')} recorded successfully.`);
  };

  // Employees
  const addEmployee = (empData: Omit<Employee, 'id'>): Employee => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`
    };
    setEmployees((prev) => [...prev, newEmp]);
    showToast(`Employee ${newEmp.name} added.`);
    return newEmp;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    showToast('Employee details updated.');
  };

  // Navigation helpers
  const openCustomerProfile = (customerId: string) => {
    setSelectedCustomerIdForProfile(customerId);
    setCurrentTab('customers');
  };

  const closeCustomerProfile = () => {
    setSelectedCustomerIdForProfile(null);
  };

  const openQuickCreate = (type?: string) => {
    if (type) setQuickCreateDefaultTab(type);
    setIsQuickCreateOpen(true);
  };

  // Demo Data Reset
  const resetDemoData = () => {
    localStorage.removeItem('sunrise_crm_customers');
    localStorage.removeItem('sunrise_crm_leads');
    localStorage.removeItem('sunrise_crm_opportunities');
    localStorage.removeItem('sunrise_crm_activities');
    localStorage.removeItem('sunrise_crm_quotations');
    localStorage.removeItem('sunrise_crm_orders');
    localStorage.removeItem('sunrise_crm_tenders');
    localStorage.removeItem('sunrise_crm_field_visits');
    localStorage.removeItem('sunrise_crm_complaints');
    localStorage.removeItem('sunrise_crm_payments');
    localStorage.removeItem('sunrise_crm_employees');
    localStorage.removeItem('sunrise_crm_catalog');

    setCustomers(INITIAL_CUSTOMERS);
    setLeads(INITIAL_LEADS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setActivities(INITIAL_ACTIVITIES);
    setQuotations(INITIAL_QUOTATIONS);
    setOrders(INITIAL_ORDERS);
    setTenders(INITIAL_TENDERS);
    setFieldVisits(INITIAL_FIELD_VISITS);
    setComplaints(INITIAL_COMPLAINTS);
    setPaymentRecoveries(INITIAL_PAYMENT_RECOVERIES);
    setEmployees(INITIAL_EMPLOYEES);

    showToast('All demo data has been restored to factory defaults.', 'info');
  };

  return (
    <CRMContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        currentRole,
        setCurrentRole,
        currentUser,
        selectedCustomerIdForProfile,
        openCustomerProfile,
        closeCustomerProfile,
        isSearchOpen,
        setIsSearchOpen,
        isQuickCreateOpen,
        setIsQuickCreateOpen,
        quickCreateDefaultTab,
        openQuickCreate,
        customers,
        leads,
        opportunities,
        activities,
        quotations,
        orders,
        tenders,
        fieldVisits,
        complaints,
        paymentRecoveries,
        employees,
        catalog,
        notifications,
        toasts,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addLead,
        updateLead,
        deleteLead,
        convertLeadToCustomer,
        convertLeadToOpportunity,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,
        updateOpportunityStage,
        addActivity,
        updateActivity,
        deleteActivity,
        completeActivity,
        addQuotation,
        updateQuotation,
        deleteQuotation,
        updateQuotationStatus,
        convertQuotationToOrder,
        addOrder,
        updateOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        addTender,
        updateTender,
        deleteTender,
        updateTenderStatus,
        addFieldVisit,
        updateFieldVisit,
        addComplaint,
        updateComplaint,
        resolveComplaint,
        addPaymentRecovery,
        recordPayment,
        addEmployee,
        updateEmployee,
        showToast,
        removeToast,
        resetDemoData
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
