import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ActiveTab, ReportViewMode, Transaction } from '../../types/finance';
import {
  Wallet,
  IndianRupee,
  Plus,
  Sparkles,
  ArrowRightLeft,
  Smartphone,
  Coins,
  ChevronRight,
  TrendingDown,
  Edit2,
  FolderOpen,
  RotateCcw,
  StickyNote,
  Pin,
  CheckCircle2,
} from 'lucide-react';
import { DonutChart, WeeklyBurnChart } from '../common/Charts';

interface OverviewViewProps {
  onNavigate: (tab: ActiveTab, subOptions?: { reportMode?: ReportViewMode }) => void;
  onOpenAddExpense: () => void;
  onOpenDailyPocket: () => void;
  onOpenExtraMoney: () => void;
  onOpenAddGalla: () => void;
  onOpenTransfer: () => void;
  onOpenMoneyEdit: () => void;
  onOpenReset: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onOpenAddExpense,
  onOpenDailyPocket,
  onOpenExtraMoney,
  onOpenAddGalla,
  onOpenTransfer,
  onOpenMoneyEdit,
  onOpenReset,
  onEditTransaction,
}) => {
  const {
    transactions,
    accounts,
    folders,
    notes,
    themeConfig,
    dailyAllowanceSetting,
    addDailyPocketMoney,
    formatRupee,
    cashInHandBalance,
    totalMoneyInGallas,
    totalMoneyToReceive,
    totalMoneyToGive,
    activeReminders,
    currentMonthSummary,
    getFolderById,
    getAccountById,
  } = useFinance();

  // Weekly 7-day spend
  const weeklyDaySpends = useMemo(() => {
    const today = new Date('2026-10-20');
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = dayNames[d.getDay()];

      const daySpend = transactions
        .filter((t) => t.date === dateStr && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      days.push({
        dayName,
        dateStr,
        amount: daySpend,
        isToday: i === 0,
      });
    }

    return days;
  }, [transactions]);

  // Donut chart slices for "Khaha khaha paise gye"
  const categoryFolderSlices = useMemo(() => {
    const folderMap = new Map<string, number>();
    transactions
      .filter((t) => t.date.startsWith('2026-10') && t.type === 'expense')
      .forEach((t) => {
        folderMap.set(t.categoryId, (folderMap.get(t.categoryId) || 0) + t.amount);
      });

    return Array.from(folderMap.entries())
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
  }, [transactions, getFolderById]);

  // Specific quick pocket presets: 40₹, 50₹, 60₹, 70₹
  const pocketPresets = [40, 50, 60, 70];

  return (
    <div className="space-y-6">
      {/* Hero Strip: Pocket Money (Cash in Hand) & Total Balances */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Hammony Finance</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                💵 Pocket Money Cash Tracker
              </span>
              <span aria-hidden="true">·</span>
              <span>October 2026</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Pocket Money & Kharcha Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pocket money cash me milti hai — Daily ₹40, ₹50, ₹60, ₹70, online FamPay, and galla balances track karein.
            </p>
          </div>

          {/* Cash Spotlight & Total Balance */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Cash in Hand Primary Spotlight */}
            <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/80 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>💵 Cash in Hand (नकद जेब खर्च)</span>
              </span>
              <div className="text-3xl font-extrabold text-emerald-800 font-mono tabular-nums my-1">
                {formatRupee(cashInHandBalance)}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                Primary Cash Galla me uplabdh
              </div>
            </div>

            {/* Total Balance Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white/90 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Kul Bache Hue Paise (Total)
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums my-1">
                {formatRupee(totalMoneyInGallas)}
              </div>
              <div className="text-[11px] text-slate-500">
                Online FamPay + Main Galla + Cash
              </div>
            </div>
          </div>
        </div>

        {/* Quick 1-Tap Cash Pocket Presets (40₹, 50₹, 60₹, 70₹) + Money Edit / Reset Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 mr-1 flex items-center gap-1">
            <span>+ Daily Cash:</span>
          </span>

          {pocketPresets.map((amt) => (
            <button
              key={amt}
              onClick={() => addDailyPocketMoney(amt)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-all active:scale-95"
              title={`Add ₹${amt} Cash Pocket Money`}
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>₹{amt}</span>
            </button>
          ))}

          <button
            onClick={onOpenDailyPocket}
            style={{ backgroundColor: themeConfig.primary }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs hover:opacity-95 transition-all ml-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Custom Cash Pocket</span>
          </button>

          <button
            onClick={onOpenExtraMoney}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>+ Extra Money</span>
          </button>

          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
          >
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            <span>- Kharcha Log</span>
          </button>

          {/* Quick Money Edit on Hero Bar */}
          <button
            onClick={onOpenMoneyEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors ml-auto shadow-2xs"
            title="Money Edit (Adjust Balances)"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>Money Edit</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* "IDER PAISA REKHA HAI" FOLDER / CONTAINER */}
      {/* ========================================================================= */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h2 className="text-base font-extrabold text-slate-900">
                Ider Paisa Rekha Hai (Pockets & Galla)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Online (FamPay), Main Galla (Cash Box), and Primary Galla (Cash)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenMoneyEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>Money Edit (Balance)</span>
            </button>

            <button
              onClick={onOpenTransfer}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-600" />
              <span>Transfer</span>
            </button>

            <button
              onClick={onOpenAddGalla}
              style={{ backgroundColor: themeConfig.primary }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs hover:opacity-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Galla</span>
            </button>
          </div>
        </div>

        {/* Gallas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {accounts.map((acc) => {
            const isFamPay = acc.type === 'online_fampay' || acc.name.toLowerCase().includes('fampay');
            const isMain = acc.type === 'main_galla';
            const isPrimaryCash = acc.type === 'primary_galla' || acc.name.toLowerCase().includes('cash');

            return (
              <div
                key={acc.id}
                className={`p-4 rounded-xl border bg-white shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between ${
                  isPrimaryCash ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                          isFamPay
                            ? 'bg-indigo-600'
                            : isMain
                            ? 'bg-emerald-600'
                            : isPrimaryCash
                            ? 'bg-amber-600'
                            : 'bg-slate-700'
                        }`}
                      >
                        {isFamPay ? (
                          <Smartphone className="w-4 h-4" />
                        ) : isMain ? (
                          <Coins className="w-4 h-4" />
                        ) : (
                          <Wallet className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-slate-900 truncate">{acc.name}</h3>
                        <span className="text-[10px] text-slate-400 capitalize block">
                          {isFamPay ? 'FamPay Online' : isMain ? 'Cash Box' : 'Daily Cash Pocket'}
                        </span>
                      </div>
                    </div>

                    {isPrimaryCash ? (
                      <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Cash Pocket
                      </span>
                    ) : isFamPay ? (
                      <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        FamPay
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3">
                    <span className="text-[11px] text-slate-400 font-medium">Bacha Hua Paisa (Balance)</span>
                    <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
                      {formatRupee(acc.balance)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {acc.balance > 0 ? 'Paisa Available' : 'Khali Hai (₹0)'}
                  </span>
                  <button
                    onClick={onOpenMoneyEdit}
                    className="text-xs text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Balance</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes & Hisaab Diary Spotlight on Dashboard */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              Notes & Hisaab Diary
            </h2>
            <span className="text-xs text-slate-400 font-mono">({notes.length} notes)</span>
          </div>
          <button
            onClick={() => onNavigate('notes')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Pura Diary Dekhein</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Koi note nahi hai abhi. "Notes" tab se naya hisaab note likhein!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {notes.slice(0, 3).map((n) => (
              <div
                key={n.id}
                onClick={() => onNavigate('notes')}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {n.tag || 'Note'}
                    </span>
                    {n.amount !== undefined && (
                      <span className="text-[10px] font-extrabold font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                        {formatRupee(n.amount)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 truncate">{n.title}</h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {n.content}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{n.date}</span>
                  {n.isPinned && (
                    <span className="text-amber-600 flex items-center gap-0.5 font-bold">
                      <Pin className="w-2.5 h-2.5" />
                      Pinned
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Udhaar & Khata Reminders Spotlight */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-base font-extrabold text-slate-900">
              Udhaar Hisab & Reminders
            </h2>
          </div>
          <button
            onClick={() => onNavigate('udhaar')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Pura Hisab Dekhein ({activeReminders.length} Active)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-emerald-800">
                Mujhe Wapas Lena Hai (Lene Hai)
              </span>
              <div className="text-xl font-extrabold font-mono text-emerald-700 tabular-nums mt-0.5">
                +{formatRupee(totalMoneyToReceive)}
              </div>
            </div>
            <button
              onClick={() => onNavigate('udhaar')}
              className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200/80 px-2.5 py-1 rounded-lg"
            >
              Check List
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-rose-800">
                Kisko Dena Baki Hai (Dene Hai)
              </span>
              <div className="text-xl font-extrabold font-mono text-rose-700 tabular-nums mt-0.5">
                -{formatRupee(totalMoneyToGive)}
              </div>
            </div>
            <button
              onClick={() => onNavigate('udhaar')}
              className="text-[11px] font-bold text-rose-700 bg-rose-100/80 hover:bg-rose-200/80 px-2.5 py-1 rounded-lg"
            >
              Check List
            </button>
          </div>
        </div>

        {/* Reminder Preview */}
        {activeReminders.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="truncate">
                Pending: <span className="font-bold text-slate-900">{activeReminders[0].personName}</span> (
                {formatRupee(activeReminders[0].amount)}) - Due {activeReminders[0].dueDate}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
              {activeReminders.length} pending
            </span>
          </div>
        )}
      </div>

      {/* Monthly Summary Cards (Received vs Spent) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Mahine Mai Kul Aaye (Received)</span>
          <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            +{formatRupee(currentMonthSummary.totalReceived)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Cash pocket money + extra
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Mahine Mai Kul Kharcha (Spent)</span>
          <div className="mt-2 text-2xl font-bold text-rose-600 font-mono tabular-nums">
            -{formatRupee(currentMonthSummary.totalSpent)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Avg {formatRupee(currentMonthSummary.dailyBurnRate)}/day
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Bacha Hua Paisa (Net Inflow-Outflow)</span>
          <div
            className={`mt-2 text-2xl font-bold font-mono tabular-nums ${
              currentMonthSummary.netRemainingInMonth >= 0 ? 'text-slate-900' : 'text-rose-600'
            }`}
          >
            {formatRupee(currentMonthSummary.netRemainingInMonth)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Total inflow minus total kharcha
          </div>
        </div>
      </div>

      {/* Monthly Breakdown: "Mahine mai khaha khaha paise gye?" & 7-Day Burn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-slate-900">Mahine Mai Khaha Khaha Paise Gye?</h2>
              <button
                onClick={() => onNavigate('reports', { reportMode: 'monthly' })}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1"
              >
                <span>Full Hisab</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Folder-wise distribution of your pocket money expenses for October 2026
            </p>

            <DonutChart
              data={categoryFolderSlices}
              size={210}
              thickness={28}
              centerTitle={formatRupee(currentMonthSummary.totalSpent)}
              centerSubtitle="Total Kharcha"
            />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-slate-900">Pichhle 7 Din Ka Kharcha (Weekly)</h2>
              <button
                onClick={() => onNavigate('reports', { reportMode: 'weekly' })}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1"
              >
                <span>Weekly Pulse</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Daily spend compared against your daily pocket money target (₹{dailyAllowanceSetting}/day)
            </p>

            <WeeklyBurnChart days={weeklyDaySpends} dailyBudget={dailyAllowanceSetting} height={200} />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Daily Average Spending:</span>
            <span className="font-mono font-bold text-slate-800">
              {formatRupee(currentMonthSummary.dailyBurnRate)} / day
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Transactions & Kharcha</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Aapke dwara log kiya gya kharcha aur pocket money
            </p>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View Full Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Abhi tak koi kharcha ya pocket money record nahi hui hai. Upar diye button se pehla transaction add karein!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-medium">
                  <th className="pb-2.5">Date</th>
                  <th className="pb-2.5">What / Details</th>
                  <th className="pb-2.5">Folder</th>
                  <th className="pb-2.5">Galla / Account</th>
                  <th className="pb-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.slice(0, 6).map((tx) => {
                  const folder = getFolderById(tx.categoryId);
                  const acc = getAccountById(tx.accountId);
                  const isExp = tx.type === 'expense';
                  const isTransfer = tx.type === 'transfer';

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => onEditTransaction(tx)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 font-mono text-slate-500 tabular-nums">{tx.date}</td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-900">{tx.title}</span>
                        {tx.notes && (
                          <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                            {tx.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: folder?.color || '#059669' }}
                          />
                          <span>{folder?.name || 'General'}</span>
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{acc?.name || 'Galla'}</td>
                      <td
                        className={`py-3 text-right font-mono font-bold tabular-nums ${
                          isExp
                            ? 'text-slate-900'
                            : isTransfer
                            ? 'text-indigo-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {isExp ? '-' : isTransfer ? '⇄ ' : '+'}
                        {formatRupee(tx.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Prominent Bottom Quick Action Bar for Reset and Money Edit */}
      {/* "ek reset ya money edit bottom rekh ko" */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Money Edit & Reset Controls</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Aap bache hue paise sidhe edit kar sakte hai ya purana hisaab ₹0 par reset kar sakte hai.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenMoneyEdit}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors shadow-2xs"
          >
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>Money Edit (Paisa Edit Karein)</span>
          </button>

          <button
            onClick={onOpenReset}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Pehle Ka Data 0 Krdo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
