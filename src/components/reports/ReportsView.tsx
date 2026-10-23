import React, { useMemo, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ActiveTab, ReportViewMode, Transaction } from '../../types/finance';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  PieChart,
} from 'lucide-react';
import { DonutChart, IncomeVsExpenseChart, WeeklyBurnChart } from '../common/Charts';

interface ReportsViewProps {
  initialMode?: ReportViewMode;
  onNavigate: (tab: ActiveTab, subOptions?: { reportMode?: ReportViewMode }) => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  initialMode = 'weekly',
  onNavigate,
  onEditTransaction,
}) => {
  const {
    transactions,
    folders,
    formatRupee,
    exportTransactionsAsCsv,
    getFolderById,
    dailyAllowanceSetting,
    totalMoneyInGallas,
    themeConfig,
  } = useFinance();

  const [mode, setMode] = useState<ReportViewMode>(initialMode);

  React.useEffect(() => {
    if (initialMode && initialMode !== mode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  const switchMode = (newMode: ReportViewMode) => {
    setMode(newMode);
    onNavigate('reports', { reportMode: newMode });
  };

  // --- WEEKLY LOGIC ---
  const weeksList = [
    { id: 'w4', label: 'Oct 18 – Oct 24, 2026 (Yeh Hafta)', start: '2026-10-18', end: '2026-10-24' },
    { id: 'w3', label: 'Oct 11 – Oct 17, 2026 (Pichhla Hafta)', start: '2026-10-11', end: '2026-10-17' },
    { id: 'w2', label: 'Oct 04 – Oct 10, 2026', start: '2026-10-04', end: '2026-10-10' },
    { id: 'w1', label: 'Sep 27 – Oct 03, 2026', start: '2026-09-27', end: '2026-10-03' },
  ];
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  const currentWeek = weeksList[selectedWeekIndex];

  const weeklyTransactions = useMemo(() => {
    return transactions.filter(
      (t) => t.date >= currentWeek.start && t.date <= currentWeek.end
    );
  }, [transactions, currentWeek]);

  const weeklyExpenses = useMemo(() => {
    return weeklyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [weeklyTransactions]);

  const weeklyReceived = useMemo(() => {
    return weeklyTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [weeklyTransactions]);

  const weeklyDaySpends = useMemo(() => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const startDate = new Date(currentWeek.start + 'T00:00:00');

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = dayNames[d.getDay()];

      const daySpend = weeklyTransactions
        .filter((t) => t.date === dateStr && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      days.push({
        dayName,
        dateStr,
        amount: daySpend,
        isToday: dateStr === '2026-10-20',
      });
    }

    return days;
  }, [weeklyTransactions, currentWeek]);

  const weeklyTopFolders = useMemo(() => {
    const map = new Map<string, number>();
    weeklyTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
      });

    return Array.from(map.entries())
      .map(([fId, amt]) => {
        const f = getFolderById(fId);
        return {
          id: fId,
          name: f?.name || fId,
          color: f?.color || '#059669',
          amount: amt,
          percent: weeklyExpenses > 0 ? (amt / weeklyExpenses) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [weeklyTransactions, weeklyExpenses, getFolderById]);

  // --- MONTHLY LOGIC ---
  const monthsList = [
    { id: '2026-10', label: 'October 2026 (Is Mahine)' },
    { id: '2026-09', label: 'September 2026' },
  ];
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');

  const monthlyTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const monthlyExpenses = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthlyTransactions]);

  const monthlyReceived = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthlyTransactions]);

  const monthlyCategorySlices = useMemo(() => {
    const map = new Map<string, number>();
    monthlyTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
      });

    return Array.from(map.entries())
      .map(([folderId, value]) => {
        const folder = getFolderById(folderId);
        return {
          id: folderId,
          label: folder?.name || folderId,
          value,
          color: folder?.color || '#059669',
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [monthlyTransactions, getFolderById]);

  const multiMonthTrend = useMemo(() => {
    return [
      {
        period: 'September 2026',
        income: transactions.filter((t) => t.date.startsWith('2026-09') && t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expense: transactions.filter((t) => t.date.startsWith('2026-09') && t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      },
      {
        period: 'October 2026',
        income: transactions.filter((t) => t.date.startsWith('2026-10') && t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expense: transactions.filter((t) => t.date.startsWith('2026-10') && t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      },
    ];
  }, [transactions]);

  // Top 5 single largest spends this month
  const topSingleSpends = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [monthlyTransactions]);

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Tradition Pocket Reports</span>
            <span aria-hidden="true">·</span>
            <span>Indian Rupee (₹)</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {mode === 'weekly' ? 'Weekly Kharcha Report' : 'Mahine Ka Pura Hisab'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {mode === 'weekly'
              ? 'Check how your 7-day spending compares to your daily pocket target'
              : 'Tradition analysis: Mahine mai khaha paise gye or kitne bache hai'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => switchMode('weekly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Report
            </button>
            <button
              onClick={() => switchMode('monthly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Report
            </button>
          </div>

          <button
            onClick={exportTransactionsAsCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WEEKLY REPORT */}
      {/* ========================================================================= */}
      {mode === 'weekly' && (
        <div className="space-y-6">
          {/* Week Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">Select Week:</span>
              <select
                value={selectedWeekIndex}
                onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 text-slate-800"
              >
                {weeksList.map((w, idx) => (
                  <option key={w.id} value={idx}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={selectedWeekIndex >= weeksList.length - 1}
                onClick={() => setSelectedWeekIndex((prev) => Math.min(weeksList.length - 1, prev + 1))}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md border border-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={selectedWeekIndex <= 0}
                onClick={() => setSelectedWeekIndex((prev) => Math.max(0, prev - 1))}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md border border-slate-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekly KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Hafte Ka Kul Kharcha</span>
              <div className="mt-2 text-2xl font-bold text-rose-600 font-mono tabular-nums">
                -{formatRupee(weeklyExpenses)}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Avg {formatRupee(weeklyExpenses / 7)} per day
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Hafte Mai Aaye Paise</span>
              <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono tabular-nums">
                +{formatRupee(weeklyReceived)}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Pocket money additions
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Weekly Net Balance</span>
              <div
                className={`mt-2 text-2xl font-bold font-mono tabular-nums ${
                  weeklyReceived - weeklyExpenses >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {weeklyReceived - weeklyExpenses >= 0 ? '+' : ''}
                {formatRupee(weeklyReceived - weeklyExpenses)}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Is hafte ka bacha hua paisa
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Target Pace</span>
              <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {formatRupee(dailyAllowanceSetting)}/day
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Daily allowance target
              </div>
            </div>
          </div>

          {/* Weekly Velocity Chart & Top Folders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-1">Day-by-Day Kharcha</h2>
              <p className="text-xs text-slate-500 mb-4">
                Comparison of daily spends against your ₹{dailyAllowanceSetting} target
              </p>
              <WeeklyBurnChart days={weeklyDaySpends} dailyBudget={dailyAllowanceSetting} height={200} />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-1">Top Folders This Week</h2>
              <p className="text-xs text-slate-500 mb-4">
                Khaha khaha sabse zyada kharcha hua
              </p>

              {weeklyTopFolders.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Is hafte koi kharcha nahi hua
                </div>
              ) : (
                <div className="space-y-3">
                  {weeklyTopFolders.slice(0, 5).map((f) => (
                    <div key={f.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                          <span className="font-medium text-slate-800 truncate">{f.name}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">{formatRupee(f.amount)}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div style={{ width: `${f.percent}%`, backgroundColor: f.color }} className="h-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MONTHLY REPORT (TRADITION: KHAHA PAISA GYA ORR KITNA BACHA HAI) */}
      {/* ========================================================================= */}
      {mode === 'monthly' && (
        <div className="space-y-6">
          {/* Month Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">Chuna Hua Mahina:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 text-slate-800"
              >
                {monthsList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-slate-500">
              {monthlyTransactions.length} entries recorded
            </span>
          </div>

          {/* Big Tradition Spotlight Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Tradition Report Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Kitna Paisa Aaya */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-xs font-semibold text-emerald-800 block">
                  1. Kul Kitne Paise Mile (Total Received)
                </span>
                <span className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums my-1 block">
                  +{formatRupee(monthlyReceived)}
                </span>
                <span className="text-[11px] text-emerald-600">Daily Pocket Money + Extra Shagun</span>
              </div>

              {/* Khaha Khaha Gaya */}
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100">
                <span className="text-xs font-semibold text-rose-800 block">
                  2. Kul Kitna Kharcha Hua (Total Spent)
                </span>
                <span className="text-2xl font-extrabold text-rose-700 font-mono tabular-nums my-1 block">
                  -{formatRupee(monthlyExpenses)}
                </span>
                <span className="text-[11px] text-rose-600">Across Food, Travel, Friends, etc.</span>
              </div>

              {/* Kitna Paisa Bacha Hai */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <span className="text-xs font-semibold text-indigo-800 block">
                  3. Kitne Paise Bache Hai (Net Balance)
                </span>
                <span className="text-2xl font-extrabold text-indigo-700 font-mono tabular-nums my-1 block">
                  {formatRupee(totalMoneyInGallas)}
                </span>
                <span className="text-[11px] text-indigo-600">Available to spend in Galla & FamPay</span>
              </div>
            </div>
          </div>

          {/* "Khaha Khaha Paise Gye" Donut & Category List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  Mahine Mai Khaha Khaha Paise Gye?
                </h2>
                <p className="text-xs text-slate-500 mb-6">
                  Folder breakdown of all expenses this month
                </p>
                <DonutChart
                  data={monthlyCategorySlices}
                  size={210}
                  thickness={30}
                  centerTitle={formatRupee(monthlyExpenses)}
                  centerSubtitle="Total Kharcha"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  Pichhle Mahine Se Comparison (Trend)
                </h2>
                <p className="text-xs text-slate-500 mb-6">
                  Compare September vs October money received & expenses
                </p>
                <IncomeVsExpenseChart data={multiMonthTrend} height={200} />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Kul {formatRupee(totalMoneyInGallas)} bacha hua paisa aapke Galla aur FamPay mai hai.
                </span>
              </div>
            </div>
          </div>

          {/* Sabse Bade Kharche (Top single expenses) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">Is Mahine Ke Sabse Bade Kharche</h2>
            <p className="text-xs text-slate-500 mb-4">
              Top 5 single expenses that consumed maximum pocket money
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-medium">
                    <th className="pb-2.5">Date</th>
                    <th className="pb-2.5">Item / Detail</th>
                    <th className="pb-2.5">Folder</th>
                    <th className="pb-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topSingleSpends.map((tx) => {
                    const f = getFolderById(tx.categoryId);
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 font-mono text-slate-500">{tx.date}</td>
                        <td className="py-2.5 font-semibold text-slate-900">{tx.title}</td>
                        <td className="py-2.5 text-slate-600">{f?.name || 'General'}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-rose-600">
                          -{formatRupee(tx.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
