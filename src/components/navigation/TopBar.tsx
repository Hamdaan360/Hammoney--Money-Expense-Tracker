import React, { useState } from 'react';
import { ActiveTab, ReportViewMode } from '../../types/finance';
import { useFinance } from '../../context/FinanceContext';
import { THEMES } from '../../data/initialData';
import {
  Wallet,
  Plus,
  Palette,
  ChevronDown,
  Menu,
  Coins,
  RotateCcw,
  Sparkles,
  TrendingDown,
  StickyNote,
} from 'lucide-react';

interface TopBarProps {
  currentTab: ActiveTab;
  currentReportMode?: ReportViewMode;
  onNavigate: (tab: ActiveTab, subOptions?: { reportMode?: ReportViewMode }) => void;
  onOpenAddExpense: () => void;
  onOpenDailyPocket: () => void;
  onOpenExtraMoney: () => void;
  onOpenMoneyEdit: () => void;
  onOpenReset: () => void;
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  currentReportMode,
  onNavigate,
  onOpenAddExpense,
  onOpenDailyPocket,
  onOpenExtraMoney,
  onOpenMoneyEdit,
  onOpenReset,
  onToggleSidebar,
}) => {
  const { currentTheme, setTheme, themeConfig, cashInHandBalance, formatRupee } = useFinance();
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const navItems: { tab: ActiveTab; label: string; href: string }[] = [
    { tab: 'dashboard', label: 'Overview', href: '#/dashboard' },
    { tab: 'transactions', label: 'Kharcha', href: '#/transactions' },
    { tab: 'reports', label: 'Reports', href: '#/reports/weekly' },
    { tab: 'folders', label: 'Folders', href: '#/folders' },
    { tab: 'udhaar', label: 'Udhaar', href: '#/udhaar' },
    { tab: 'notes', label: 'Notes', href: '#/notes' },
    { tab: 'settings', label: 'Settings', href: '#/settings' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Hamburger (Mobile) + Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
            title="Open Side Menu"
            aria-label="Open Side Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a
            href="#/dashboard"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('dashboard');
            }}
            className="flex items-center gap-2.5 text-slate-900 font-extrabold tracking-tight text-lg whitespace-nowrap shrink-0 group"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <div
              style={{ backgroundColor: themeConfig.primary }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs transition-colors"
            >
              <Wallet className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-900 font-extrabold tracking-tight">Hammony</span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold hidden sm:inline">
                Cash: {formatRupee(cashInHandBalance)}
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Navigation Links (hidden on smaller screens where sidebar handles it) */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-600">
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <a
                key={item.tab}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.tab === 'reports') {
                    onNavigate('reports', { reportMode: currentReportMode || 'weekly' });
                  } else {
                    onNavigate(item.tab);
                  }
                }}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive
                    ? 'text-slate-900 font-bold border-b-2 -mb-[2px]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={isActive ? { borderColor: themeConfig.primary } : {}}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Money Edit, Reset, Theme Picker & Quick Add Action */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Money Edit Button */}
          <button
            onClick={onOpenMoneyEdit}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Direct Money Edit (Adjust Balances)"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>Money Edit</span>
          </button>

          {/* Quick Reset to 0 Button */}
          <button
            onClick={onOpenReset}
            className="hidden md:flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
            title="Reset All Data to 0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>Reset 0</span>
          </button>

          {/* Theme Changer Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              title="Change Theme Color"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: themeConfig.primary }} />
              <span className="hidden sm:inline">Theme</span>
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Color Theme
                </div>
                {Object.values(THEMES).map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setTheme(th.id);
                      setShowThemePicker(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 transition-colors ${
                      currentTheme === th.id ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: th.primary }} />
                      <span className="truncate">{th.name}</span>
                    </div>
                    {currentTheme === th.id && (
                      <span className="text-[10px] text-slate-400 font-mono">Active</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Add Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              style={{ backgroundColor: themeConfig.primary }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs hover:opacity-95 transition-all whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Record</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {showAddMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setShowAddMenu(false);
                    onOpenAddExpense();
                  }}
                  className="w-full text-left px-3.5 py-2 text-slate-800 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Log Kharcha (Expense)</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddMenu(false);
                    onOpenDailyPocket();
                  }}
                  className="w-full text-left px-3.5 py-2 text-slate-800 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>+ Daily Cash Pocket Money</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddMenu(false);
                    onOpenExtraMoney();
                  }}
                  className="w-full text-left px-3.5 py-2 text-slate-800 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>+ Extra Money (Gift / Bonus)</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    setShowAddMenu(false);
                    onOpenMoneyEdit();
                  }}
                  className="w-full text-left px-3.5 py-2 text-slate-800 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>Money Edit (Balances)</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddMenu(false);
                    onOpenReset();
                  }}
                  className="w-full text-left px-3.5 py-2 text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                  <span>Pehle Ka Data 0 Krdo (Reset)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
