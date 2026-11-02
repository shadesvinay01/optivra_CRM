# Sunrise CRM (Optivra CRM)

> **An intelligent sales, customer, and project management platform tailored for the road-marking, highway infrastructure, contractor, applicator, distributor, and government tender ecosystem.**

Built for **Sunrise Overseas** — specialized manufacturers & applicators of thermoplastic road marking materials (BS 3262 Class A, AASHTO M249, MoRTH Section 803), cold plastic compounds, glass beads, and road application equipment.

---

## 🚀 Key Modules & Capabilities

1. **Executive Overview Dashboard**
   - High-density KPI cards with real-time SVG sparklines and quarter-over-quarter trend indicators.
   - Interactive 4-in-1 Analytics Suite: Monthly Revenue & Dispatch volume bar charts, Pipeline Velocity Funnel, Product Category revenue mix donut chart, and Sales Leaderboard.
   - Dynamic filtering across Indian states and sales team members.
   - Urgent operational action strip for tender deadlines and critical deliveries.

2. **Customer & Account Management**
   - Comprehensive account tracking across Contractors, Applicators, Consultants, Distributors, Government Departments, and Infrastructure Companies.
   - **9-Tab Customer Profile Dossier**: Overview, Key Contacts, Activity Timeline, Leads & RFQs, Quotations, Orders, Complaints, Payment Recovery History, and Notes.
   - Client CSV import and export with instant data validation.

3. **Lead & Enquiry Management**
   - Full lifecycle management from RFQ to qualification.
   - **1-Click Conversion Workflows**: Convert qualified leads into full Customer accounts or push directly into the Sales Pipeline as active Opportunities.
   - Filtering by status, priority, territory, and lead source.

4. **Kanban Sales Pipeline**
   - Interactive drag-and-drop opportunity board across 5 stages (`New Opportunity`, `Qualified`, `Quotation Sent`, `Negotiation`, `Won`).
   - Weighted pipeline calculations and deal probability forecasting.

5. **Quotations & Orders Engine**
   - Multi-item quotation builder with automated GST calculations, itemized discounts, and HSN codes.
   - **Official Printable Letterhead Preview**: Generates branded Sunrise Overseas quotation documents ready for PDF export or client printing.
   - 1-click **Quote-to-Order Booking** with payment term tracking.

6. **Tenders & Government Projects Workspace**
   - Dedicated highway tender tracker for NHAI, MoRTH, and State PWD projects.
   - EMD (Earnest Money Deposit) tracking, submission countdown timers, tender fee ledger, and document checklists.

7. **Field Visits & Site Inspections**
   - Highway stretch inspection logging, sample demos, applicator training, and retroreflectivity ($R_L$ & $Q_d$) testing reports.

8. **Complaints & Quality Feedback**
   - Quality ticket management covering adhesion, curing time, glass bead retention, and batch shade matching.
   - Customer CSAT ratings and resolution tracking.

9. **Payment Recovery Ledger**
   - Invoice aging analysis, payment collection receipts, and outstanding balance monitoring.

10. **Employees & Territory Management**
    - Multi-territory sales assignments, quota attainment tracking, and an interactive **Role Switcher** (`Admin`, `Sales Manager`, `Sales Executive`) for testing role-based visibility.

11. **Reports & Analytics**
    - Cross-module reporting with CSV exports across commercial revenue, territory density, and tender win rates.

12. **AI Sales Assistant**
    - 5 data-grounded assistant tools: Executive Briefings, Quotation Email Generator, Tender Win-Probability Evaluator, Follow-up Drafter, and Payment Recovery Nudge.

13. **Integrations & Settings**
    - WhatsApp Business, Email, and Google Calendar integration settings with webhook test simulators.
    - Product catalog master and complete demo data reset.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS, PostCSS
- **Icons:** Lucide React
- **Build Tool:** Vite 6
- **Persistence:** Client-side local storage with automatic state hydration and reactive multi-tab sync

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/shadesvinay01/optivra_CRM.git

# Navigate into the project directory
cd optivra_CRM

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
```

The production assets will be compiled into the `dist/` directory.

---

## 🔒 License

Proprietary — Developed for Sunrise Overseas & Optivra CRM.
