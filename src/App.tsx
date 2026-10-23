import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { useUrlRouting } from './hooks/useUrlRouting';
import { TopBar } from './components/navigation/TopBar';
import { Sidebar } from './components/navigation/Sidebar';
import { OverviewView } from './components/dashboard/OverviewView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { ReportsView } from './components/reports/ReportsView';
import { FoldersView } from './components/folders/FoldersView';
import { UdhaarView } from './components/udhaar/UdhaarView';
import { NotesView } from './components/notes/NotesView';
import { SettingsView } from './components/settings/SettingsView';
import {
  AddGallaModal,
  DailyPocketMoneyModal,
  ExtraMoneyModal,
  QuickExpenseModal,
  TransferGallaModal,
} from './components/modals/PocketMoneyModals';
import { MoneyEditAndResetModal } from './components/modals/MoneyEditAndResetModal';
import { Transaction } from './types/finance';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  StickyNote,
  PlusCircle,
  Users,
  Coins,
} from 'lucide-react';

function AppContent() {
  const { route, navigateTo } = useUrlRouting();
  const { currentTheme, themeConfig } = useFinance();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isDailyPocketModalOpen, setIsDailyPocketModalOpen] = useState(false);
  const [isExtraMoneyModalOpen, setIsExtraMoneyModalOpen] = useState(false);
  const [isAddGallaModalOpen, setIsAddGallaModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isMoneyEditModalOpen, setIsMoneyEditModalOpen] = useState(false);
  const [moneyEditInitialMode, setMoneyEditInitialMode] = useState<'edit' | 'reset'>('edit');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsExpenseModalOpen(true);
  };

  const handleOpenMoneyEdit = () => {
    setMoneyEditInitialMode('edit');
    setIsMoneyEditModalOpen(true);
  };

  const handleOpenReset = () => {
    setMoneyEditInitialMode('reset');
    setIsMoneyEditModalOpen(true);
  };

  return (
    <div
      style={{ background: themeConfig.bgGradient }}
      className={`min-h-screen flex transition-colors duration-300 ${
        currentTheme === 'slateDark' ? 'theme-dark' : ''
      }`}
    >
      {/* Sleek Side Menu / Drawer */}
      <Sidebar
        currentTab={route.tab}
        currentReportMode={route.reportMode}
        onNavigate={navigateTo}
        onOpenAddExpense={() => setIsExpenseModalOpen(true)}
        onOpenDailyPocket={() => setIsDailyPocketModalOpen(true)}
        onOpenMoneyEdit={handleOpenMoneyEdit}
        onOpenReset={handleOpenReset}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar with Brand, Theme Switcher, Quick Record, and Hamburger for Side Menu */}
        <TopBar
          currentTab={route.tab}
          currentReportMode={route.reportMode}
          onNavigate={navigateTo}
          onOpenAddExpense={() => setIsExpenseModalOpen(true)}
          onOpenDailyPocket={() => setIsDailyPocketModalOpen(true)}
          onOpenExtraMoney={() => setIsExtraMoneyModalOpen(true)}
          onOpenMoneyEdit={handleOpenMoneyEdit}
          onOpenReset={handleOpenReset}
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Viewport Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-20 md:mb-8">
          {route.tab === 'dashboard' && (
            <OverviewView
              onNavigate={navigateTo}
              onOpenAddExpense={() => setIsExpenseModalOpen(true)}
              onOpenDailyPocket={() => setIsDailyPocketModalOpen(true)}
              onOpenExtraMoney={() => setIsExtraMoneyModalOpen(true)}
              onOpenAddGalla={() => setIsAddGallaModalOpen(true)}
              onOpenTransfer={() => setIsTransferModalOpen(true)}
              onOpenMoneyEdit={handleOpenMoneyEdit}
              onOpenReset={handleOpenReset}
              onEditTransaction={handleEditTransaction}
            />
          )}

          {route.tab === 'transactions' && (
            <TransactionsView
              onOpenAddExpense={() => setIsExpenseModalOpen(true)}
              onEditTransaction={handleEditTransaction}
              initialTypeFilter={route.transactionFilter}
              initialQuery={route.searchQuery}
            />
          )}

          {route.tab === 'reports' && (
            <ReportsView
              initialMode={route.reportMode}
              onNavigate={navigateTo}
              onEditTransaction={handleEditTransaction}
            />
          )}

          {route.tab === 'folders' && <FoldersView />}

          {route.tab === 'udhaar' && <UdhaarView />}

          {route.tab === 'notes' && <NotesView />}

          {route.tab === 'settings' && <SettingsView />}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 py-1.5 flex items-center justify-around text-[10px] font-medium text-slate-500 shadow-lg">
          <button
            onClick={() => navigateTo('dashboard')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 ${
              route.tab === 'dashboard' ? 'font-bold' : 'hover:text-slate-900'
            }`}
            style={route.tab === 'dashboard' ? { color: themeConfig.primary } : {}}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => navigateTo('transactions')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 ${
              route.tab === 'transactions' ? 'font-bold' : 'hover:text-slate-900'
            }`}
            style={route.tab === 'transactions' ? { color: themeConfig.primary } : {}}
          >
            <Receipt className="w-4 h-4" />
            <span>Kharcha</span>
          </button>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            style={{ backgroundColor: themeConfig.primary }}
            className="flex flex-col items-center gap-0.5 -mt-5 text-white rounded-full p-3 shadow-xl active:scale-95 transition-transform"
            aria-label="Kharcha Add Karo"
          >
            <PlusCircle className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigateTo('notes')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 ${
              route.tab === 'notes' ? 'font-bold' : 'hover:text-slate-900'
            }`}
            style={route.tab === 'notes' ? { color: themeConfig.primary } : {}}
          >
            <StickyNote className="w-4 h-4" />
            <span>Notes</span>
          </button>

          <button
            onClick={() => navigateTo('udhaar')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 ${
              route.tab === 'udhaar' ? 'font-bold' : 'hover:text-slate-900'
            }`}
            style={route.tab === 'udhaar' ? { color: themeConfig.primary } : {}}
          >
            <Users className="w-4 h-4" />
            <span>Udhaar</span>
          </button>
        </nav>

        {/* Modals */}
        <QuickExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => {
            setIsExpenseModalOpen(false);
            setEditingTransaction(null);
          }}
        />

        <DailyPocketMoneyModal
          isOpen={isDailyPocketModalOpen}
          onClose={() => setIsDailyPocketModalOpen(false)}
        />

        <ExtraMoneyModal
          isOpen={isExtraMoneyModalOpen}
          onClose={() => setIsExtraMoneyModalOpen(false)}
        />

        <AddGallaModal
          isOpen={isAddGallaModalOpen}
          onClose={() => setIsAddGallaModalOpen(false)}
        />

        <TransferGallaModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
        />

        <MoneyEditAndResetModal
          isOpen={isMoneyEditModalOpen}
          initialMode={moneyEditInitialMode}
          onClose={() => setIsMoneyEditModalOpen(false)}
        />

        {/* Professional Footer */}
        <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-5 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800">Hammony</span>
              <span aria-hidden="true">·</span>
              <span>Pocket Money (Cash in Hand)</span>
              <span aria-hidden="true">·</span>
              <span>Online FamPay & Galla</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenMoneyEdit}
                className="hover:text-amber-700 font-semibold transition-colors flex items-center gap-1"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Money Edit</span>
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={handleOpenReset}
                className="hover:text-rose-700 font-semibold transition-colors"
              >
                Reset to 0
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => navigateTo('notes')}
                className="hover:text-slate-900 transition-colors"
              >
                Notes Diary
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
