export type Role = 'Admin' | 'Sales Manager' | 'Sales Executive';

export type CustomerType = 
  | 'Contractor' 
  | 'Consultant' 
  | 'Applicator' 
  | 'Distributor' 
  | 'Government Department' 
  | 'Infrastructure Company';

export type CustomerStatus = 'Active' | 'Inactive' | 'Prospect' | 'Suspended';

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  contactPerson: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  assignedEmployeeId: string;
  source: string;
  status: CustomerStatus;
  industry: string;
  lastContacted: string;
  nextFollowUp: string;
  gstNumber?: string;
  notes: string;
  createdAt: string;
}

export type LeadStatus = 
  | 'New' 
  | 'Contacted' 
  | 'Qualified' 
  | 'Proposal Required' 
  | 'Negotiation' 
  | 'Converted' 
  | 'Lost';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Lead {
  id: string;
  leadName: string;
  organization: string;
  contactPerson: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  leadSource: string;
  productInterest: string;
  estimatedValue: number;
  assignedEmployeeId: string;
  priority: Priority;
  status: LeadStatus;
  createdDate: string;
  nextFollowUp: string;
  notes: string;
}

export type PipelineStage = 
  | 'New Opportunity' 
  | 'Qualified' 
  | 'Quotation Sent' 
  | 'Negotiation' 
  | 'Won' 
  | 'Lost';

export interface Opportunity {
  id: string;
  name: string;
  customerId: string;
  customerName: string;
  dealValue: number;
  assignedEmployeeId: string;
  expectedClosingDate: string;
  priority: Priority;
  stage: PipelineStage;
  probability: number; // 0 - 100%
  notes?: string;
  createdAt: string;
}

export type ActivityType = 
  | 'Phone Call' 
  | 'Meeting' 
  | 'Field Visit' 
  | 'Email' 
  | 'WhatsApp' 
  | 'Follow-up' 
  | 'Internal Note';

export interface Activity {
  id: string;
  type: ActivityType;
  relatedCustomerId?: string;
  relatedCustomerName?: string;
  relatedLeadId?: string;
  relatedLeadName?: string;
  assignedEmployeeId: string;
  date: string;
  time: string;
  duration: string;
  outcome: string;
  notes: string;
  nextFollowUp?: string;
  completed: boolean;
}

export interface QuotationLineItem {
  id: string;
  description: string;
  hsn: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  gstRate: number; // e.g., 18%
  total: number;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Under Review' | 'Accepted' | 'Rejected' | 'Expired';

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  validityDate: string;
  status: QuotationStatus;
  assignedEmployeeId: string;
  terms: string;
  createdAt: string;
}

export type OrderStatus = 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Partial' | 'Paid';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  relatedQuotationId?: string;
  relatedQuotationNumber?: string;
  orderDate: string;
  expectedDelivery: string;
  orderValue: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  assignedEmployeeId: string;
  shippingAddress: string;
  notes?: string;
}

export type TenderStatus = 
  | 'Identified' 
  | 'Under Evaluation' 
  | 'Documentation' 
  | 'Submitted' 
  | 'Technical Evaluation' 
  | 'Financial Evaluation' 
  | 'Won' 
  | 'Lost';

export interface TenderDocument {
  name: string;
  size: string;
  uploadedAt: string;
}

export interface Tender {
  id: string;
  tenderTitle: string;
  tenderId: string; // e.g. NHAI/RO/LKO/2024/09
  department: string;
  departmentCategory: 'NHAI' | 'MoRTH' | 'State PWD' | 'Smart City' | 'Railways / Metro' | 'State Infrastructure Corp';
  state: string;
  location: string;
  projectDescription: string;
  estimatedValue: number;
  tenderPublicationDate: string;
  submissionDeadline: string;
  approvalStatus: TenderStatus;
  assignedEmployeeId: string;
  priority: Priority;
  earnestMoneyDeposit: number;
  tenderFee: number;
  documents: TenderDocument[];
  notes: string;
}

export interface FieldVisit {
  id: string;
  employeeId: string;
  customerId: string;
  customerName: string;
  visitDate: string;
  location: string;
  purpose: 'Sample Demo' | 'Machine Trial' | 'Material Inspection' | 'Applicator Training' | 'Consultant Presentation' | 'Site Survey';
  outcome: string;
  nextAction: string;
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export type ComplaintStatus = 'Open' | 'Assigned' | 'In Progress' | 'Escalated' | 'Resolved' | 'Closed';

export interface Complaint {
  id: string;
  complaintId: string;
  customerId: string;
  customerName: string;
  category: 
    | 'Retroreflectivity Issue' 
    | 'Drying Time / Curing' 
    | 'Nozzle / Machine Clogging' 
    | 'Adhesion Failure' 
    | 'Skid Resistance' 
    | 'Packaging / Transit' 
    | 'Batch Shade Mismatch' 
    | 'Documentation / Billing';
  description: string;
  priority: Priority;
  assignedEmployeeId: string;
  dateReported: string;
  dueDate: string;
  status: ComplaintStatus;
  resolutionNotes?: string;
  rating?: number; // 1-5 customer rating
  feedbackComment?: string;
}

export type RecoveryStatus = 'Not Due' | 'Due' | 'Overdue' | 'Partially Paid' | 'Paid';

export interface PaymentEntry {
  date: string;
  amount: number;
  method: 'NEFT/RTGS' | 'Cheque' | 'UPI' | 'Letter of Credit';
  reference: string;
}

export interface PaymentRecovery {
  id: string;
  customerId: string;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: number;
  amountReceived: number;
  outstandingAmount: number;
  assignedEmployeeId: string;
  lastFollowUp?: string;
  nextFollowUp?: string;
  recoveryStatus: RecoveryStatus;
  paymentHistory: PaymentEntry[];
}

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  role: Role;
  department: 'Government Tenders' | 'Institutional Sales' | 'Technical & Application' | 'Channel Sales' | 'Key Accounts';
  email: string;
  phone: string;
  assignedStates: string[];
  reportingManager: string;
  monthlyTarget: number;
  salesAchieved: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  avatar?: string;
}

export interface ProductCatalogItem {
  id: string;
  name: string;
  category: 'Thermoplastic Paint' | 'Glass Beads' | 'Cold Plastic' | 'Road Marking Machine' | 'Retroreflectometer' | 'Road Studs & Delineators';
  hsn: string;
  unit: string;
  defaultPrice: number;
  gstRate: number;
  specification: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}
