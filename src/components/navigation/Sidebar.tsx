import React, { useState } from 'react';
import { ActiveTab, AppTheme, ReportViewMode } from '../../types/finance';
import { useFinance } from '../../context/FinanceContext';
import { THEMES } from '../../data/initialData';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  FolderOpen,
  Users,
  StickyNote,
  Settings,
  Plus,
  Coins,
  RotateCcw,
  Wallet,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Palette,
  X,
  IndianRupee,
} from 'lucide-react';

interface SidebarProps {
  currentTab: ActiveTab;
  currentReportMode?: ReportViewMode;
  onNavigate: (tab: ActiveTab, subOptions?: { reportMode?: ReportViewMode }) => void;
  onOpenAddExpense: () => void;
  onOpenDailyPocket: () => void;
  onOpenMoneyEdit: () => void;
  onOpenReset: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  currentReportMode,
  onNavigate,
  onOpenAddExpense,
  onOpenDailyPocket,
  onOpenMoneyEdit,
  onOpenReset,
  isMobileOpen,
  onCloseMobile,
}) => {
  const {
    currentTheme,
    setTheme,
    themeConfig,
    formatRupee,
    cashInHandBalance,
    totalMoneyInGallas,
    activeReminders,
    notes,
  } = useFinance();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const navItems = [
    {
      tab: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      sub: 'Kul Paisa & Overview',
      icon: LayoutDashboard,
    },
    {
      tab: 'transactions' as ActiveTab,
      label: 'Kharcha Ledger',
      sub: 'All Transactions',
      icon: Receipt,
    },
    {
      tab: 'reports' as ActiveTab,
      label: 'Hisab Reports',
      sub: 'Weekly & Monthly',
      icon: BarChart3,
    },
    {
      tab: 'folders' as ActiveTab,
      label: 'Folders & Galla',
      sub: 'Categories & Balances',
      icon: FolderOpen,
    },
    {
      tab: 'udhaar' as ActiveTab,
      label: 'Udhaar Khata',
      sub: 'Lena / Dena Reminders',
      icon: Users,
      badge: activeReminders.length > 0 ? `${activeReminders.length}` : undefined,
    },
    {
      tab: 'notes' as ActiveTab,
      label: 'Notes & Diary',
      sub: 'Hisaab & Reminders',
      icon: StickyNote,
      badge: notes.length > 0 ? `${notes.length}` : undefined,
    },
    {
      tab: 'settings' as ActiveTab,
      label: 'Settings & Backup',
      sub: 'Themes & Preferences',
      icon: Settings,
    },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    if (tab === 'reports') {
      onNavigate('reports', { reportMode: currentReportMode || 'weekly' });
    } else {
      onNavigate(tab);
    }
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between overflow-y-auto select-none">
      {/* Top Branding & Wallet Status */}
      <div className="p-4 space-y-4">
        {/* Brand header */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div
              style={{ backgroundColor: themeConfig.primary }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-900/10 shrink-0 group-hover:scale-105 transition-transform"
            >
              <Wallet className="w-5 h-5" />
            </div>

            {!isCollapsed && (
              <div className="leading-tight">
                <span
                  className="text-base font-extrabold text-slate-900 tracking-tight block"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Hammony
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Pocket Money
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Cash in Hand & Balance Card */}
        {!isCollapsed ? (
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
              <span>Cash in Hand (नकद)</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded font-mono font-bold">
                Cash
              </span>
            </div>
            <div className="text-xl font-extrabold font-mono text-slate-900 tabular-nums">
              {formatRupee(cashInHandBalance)}
            </div>
            <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
              <span>Total Across Galla:</span>
              <span className="font-bold text-slate-700 font-mono">{formatRupee(totalMoneyInGallas)}</span>
            </div>
          </div>
        ) : (
          <div
            className="p-2 rounded-xl bg-slate-100 text-center cursor-pointer"
            title={`Cash in Hand: ${formatRupee(cashInHandBalance)}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <span className="text-[9px] font-bold text-slate-500 block">CASH</span>
            <span className="text-xs font-mono font-extrabold text-slate-900 block truncate">
              {formatRupee(cashInHandBalance)}
            </span>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="space-y-1.5 pt-1">
          <button
            onClick={() => {
              onOpenDailyPocket();
              onCloseMobile();
            }}
            style={{ backgroundColor: themeConfig.primary }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-white rounded-xl shadow-xs hover:opacity-95 transition-all active:scale-95"
            title="Daily Cash Pocket Money"
          >
            <Plus className="w-3.5 h-3.5" />
            {!isCollapsed && <span>+ Cash Pocket Money</span>}
          </button>

          <button
            onClick={() => {
              onOpenAddExpense();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all active:scale-95"
            title="Log Kharcha"
          >
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            {!isCollapsed && <span>- Log Kharcha</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="pt-2 border-t border-slate-200/80">
          {!isCollapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu
            </div>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.tab;
              const Icon = item.icon;

              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  title={item.label}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  />

                  {!isCollapsed && (
                    <div className="flex-1 text-left truncate flex items-center justify-between">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                            isActive
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Sticky Action Area: Money Edit & Reset Button */}
      <div className="p-4 border-t border-slate-200/80 space-y-2 bg-slate-50/50">
        {!isCollapsed && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Money Controls
          </div>
        )}

        <div className="grid grid-cols-1 gap-1.5">
          <button
            onClick={() => {
              onOpenMoneyEdit();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs"
            title="Money Edit (Adjust Balances)"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            {!isCollapsed && <span>Money Edit (Balance)</span>}
          </button>

          <button
            onClick={() => {
              onOpenReset();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-[11px] font-bold text-rose-700 bg-rose-50/60 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all"
            title="Reset Data to 0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            {!isCollapsed && <span>Pehle Ka Data 0 Krdo</span>}
          </button>
        </div>

        {/* Theme Picker trigger */}
        <div className="relative pt-1">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" style={{ color: themeConfig.primary }} />
              {!isCollapsed && <span className="text-[11px] truncate">{themeConfig.name}</span>}
            </div>
            {!isCollapsed && (
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeConfig.primary }} />
            )}
          </button>

          {showThemePicker && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Theme
              </div>
              {Object.values(THEMES).map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    setTheme(th.id);
                    setShowThemePicker(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-slate-50 transition-colors ${
                    currentTheme === th.id ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: th.primary }} />
                    <span className="truncate text-xs">{th.name}</span>
                  </div>
                  {currentTheme === th.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 h-screen sticky top-0 bg-white/95 backdrop-blur-md border-r border-slate-200/90 transition-all duration-300 z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-72 bg-white shadow-2xl border-r border-slate-200 animate-in slide-in-from-left duration-200 z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
