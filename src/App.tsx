import React, { useState } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { QuickCreateModal } from './components/common/QuickCreateModal';
import { ToastContainer } from './components/common/ToastContainer';

// Views
import { OverviewDashboard } from './views/OverviewDashboard';
import { CustomersView } from './views/CustomersView';
import { LeadsView } from './views/LeadsView';
import { SalesPipelineView } from './views/SalesPipelineView';
import { ActivitiesView } from './views/ActivitiesView';
import { QuotationsOrdersView } from './views/QuotationsOrdersView';
import { TendersView } from './views/TendersView';
import { FieldVisitsView } from './views/FieldVisitsView';
import { ComplaintsView } from './views/ComplaintsView';
import { PaymentRecoveryView } from './views/PaymentRecoveryView';
import { EmployeesView } from './views/EmployeesView';
import { ReportsView } from './views/ReportsView';
import { AIAssistantView } from './views/AIAssistantView';
import { IntegrationsView } from './views/IntegrationsView';
import { SettingsView } from './views/SettingsView';

const MainAppLayout: React.FC = () => {
  const { currentTab } = useCRM();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'customers':
        return <CustomersView />;
      case 'leads':
        return <LeadsView />;
      case 'pipeline':
        return <SalesPipelineView />;
      case 'activities':
        return <ActivitiesView />;
      case 'quotations':
      case 'orders':
        return <QuotationsOrdersView />;
      case 'tenders':
        return <TendersView />;
      case 'field-visits':
        return <FieldVisitsView />;
      case 'complaints':
        return <ComplaintsView />;
      case 'payment-recovery':
        return <PaymentRecoveryView />;
      case 'employees':
        return <EmployeesView />;
      case 'reports':
        return <ReportsView />;
      case 'ai-assistant':
        return <AIAssistantView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        mobileOpen={mobileSidebarOpen} 
        setMobileOpen={setMobileSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <TopNavbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals & Overlays */}
      <GlobalSearchModal />
      <QuickCreateModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <CRMProvider>
      <MainAppLayout />
    </CRMProvider>
  );
}
