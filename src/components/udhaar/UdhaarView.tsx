import React, { useMemo, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { UdhaarType } from '../../types/finance';
import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Trash2,
  Calendar,
  AlertCircle,
  X,
  UserCheck,
} from 'lucide-react';

export const UdhaarView: React.FC = () => {
  const {
    udhaarList,
    addUdhaar,
    settleUdhaar,
    deleteUdhaar,
    formatRupee,
    totalMoneyToReceive,
    totalMoneyToGive,
    accounts,
    themeConfig,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'all' | 'to_receive' | 'to_give'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [personName, setPersonName] = useState('');
  const [type, setType] = useState<UdhaarType>('to_receive');
  const [amount, setAmount] = useState('50');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [settleModalId, setSettleModalId] = useState<string | null>(null);
  const [selectedAccForSettle, setSelectedAccForSettle] = useState<string>(accounts[0]?.id || '');

  const filteredList = useMemo(() => {
    return udhaarList.filter((u) => {
      if (activeTab === 'all') return true;
      return u.type === activeTab;
    });
  }, [udhaarList, activeTab]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!personName.trim() || isNaN(num) || num <= 0) return;

    addUdhaar(personName.trim(), type, num, dueDate, notes.trim());
    setPersonName('');
    setAmount('50');
    setNotes('');
    setIsModalOpen(false);
  };

  const handleConfirmSettle = () => {
    if (!settleModalId) return;
    settleUdhaar(settleModalId, selectedAccForSettle);
    setSettleModalId(null);
  };

  const getDaysDiff = (dateStr: string) => {
    const today = new Date('2026-10-20');
    const target = new Date(dateStr + 'T00:00:00');
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const settleTargetRecord = udhaarList.find((u) => u.id === settleModalId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Udhaar & Khata Reminders</span>
            <span aria-hidden="true">·</span>
            <span>Kisko dena hai & Kisse wapas lena hai</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Udhaar Hisab & Reminders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track money lent to friends or borrowed with due-date reminders.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: themeConfig.primary }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-95 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Udhaar Entry</span>
        </button>
      </div>

      {/* KPI Cards: Mujhe Lena Hai vs Kisko Dena Baki Hai */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mujhe Wapas Lena Hai */}
        <div className="bg-white/90 backdrop-blur-md border border-emerald-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>Mujhe Wapas Lena Hai (Lene Hai)</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
            +{formatRupee(totalMoneyToReceive)}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">
            {udhaarList.filter((u) => u.type === 'to_receive' && u.status === 'pending').length} logo se wapas lene hai
          </p>
        </div>

        {/* Kisko Dena Baki Hai */}
        <div className="bg-white/90 backdrop-blur-md border border-rose-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-800">
            <span>Kisko Dena Baki Hai (Dene Hai)</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-rose-700 font-mono tabular-nums">
            -{formatRupee(totalMoneyToGive)}
          </div>
          <p className="text-[11px] text-rose-600 mt-1">
            {udhaarList.filter((u) => u.type === 'to_give' && u.status === 'pending').length} logo ko chukta karna hai
          </p>
        </div>

        {/* Net Udhaar Position */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Net Udhaar Difference</span>
          <div
            className={`mt-2 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${
              totalMoneyToReceive - totalMoneyToGive >= 0 ? 'text-slate-900' : 'text-rose-600'
            }`}
          >
            {totalMoneyToReceive - totalMoneyToGive >= 0 ? '+' : ''}
            {formatRupee(totalMoneyToReceive - totalMoneyToGive)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Lene hai minus Dene hai
          </p>
        </div>
      </div>

      {/* Tabs Filter (All / Lene Hai / Dene Hai) */}
      <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({udhaarList.length})
        </button>
        <button
          onClick={() => setActiveTab('to_receive')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'to_receive' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mujhe Lene Hai ({udhaarList.filter((u) => u.type === 'to_receive').length})
        </button>
        <button
          onClick={() => setActiveTab('to_give')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'to_give' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mujhe Dene Hai ({udhaarList.filter((u) => u.type === 'to_give').length})
        </button>
      </div>

      {/* Udhaar Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-400">
          Abhi koi udhaar record nahi hai. "+ Add Udhaar Entry" button se friend ya dukaan ka hisab add karein!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => {
            const isToReceive = item.type === 'to_receive';
            const daysDiff = getDaysDiff(item.dueDate);
            const isOverdue = daysDiff < 0 && item.status === 'pending';
            const isToday = daysDiff === 0 && item.status === 'pending';
            const isPending = item.status === 'pending';

            return (
              <div
                key={item.id}
                className={`bg-white/90 backdrop-blur-md border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                  item.status === 'settled'
                    ? 'opacity-60 border-slate-200'
                    : isOverdue
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : isToday
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isToReceive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {isToReceive ? 'Wapas Lena Hai (Lene Hai)' : 'Dena Baki Hai (Dene Hai)'}
                    </span>

                    {/* Reminder Status Badge */}
                    {isPending ? (
                      <span
                        className={`text-[11px] font-mono font-bold flex items-center gap-1 ${
                          isOverdue
                            ? 'text-rose-600'
                            : isToday
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {isOverdue
                            ? `${Math.abs(daysDiff)}d overdue`
                            : isToday
                            ? 'Reminder Today'
                            : `${daysDiff}d left`}
                        </span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Chukta / Settled</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">{item.personName}</h3>

                  <div className="my-2 text-2xl font-black font-mono tabular-nums">
                    <span className={isToReceive ? 'text-emerald-700' : 'text-rose-700'}>
                      {isToReceive ? '+' : '-'}
                      {formatRupee(item.amount)}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-500 mb-2 bg-slate-50 p-2 rounded">
                      {item.notes}
                    </p>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Diya/Liya tha: {item.date}</span>
                    <span>Reminder: {item.dueDate}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {isPending ? (
                    <button
                      onClick={() => setSettleModalId(item.id)}
                      className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        isToReceive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isToReceive ? 'Wapas Mil Gaya' : 'Chukta Kar Diya'}</span>
                    </button>
                  ) : (
                    <span className="text-slate-400 font-medium">Settled on {item.settledDate}</span>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete record for ${item.personName}?`)) {
                        deleteUdhaar(item.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD UDHAAR RECORD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">Add Udhaar / Khata Record</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              {/* Type Switcher */}
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setType('to_receive')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    type === 'to_receive'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mujhe Wapas Lena Hai (Lene Hai)
                </button>
                <button
                  type="button"
                  onClick={() => setType('to_give')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    type === 'to_give'
                      ? 'bg-white text-rose-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kisko Dena Baki Hai (Dene Hai)
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Kiska Naam Hai? (Person / Shop Name)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul, Aman, Canteen Bhaiya, Priya"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Kitna Amount? (₹)</label>
                  <input
                    type="number"
                    step="5"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Reminder Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Reason / Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Movie ticket split, Tapri chai udhaar"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  Save Udhaar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SETTLE / MARK AS PAID OR RECEIVED */}
      {settleModalId && settleTargetRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">
                {settleTargetRecord.type === 'to_receive'
                  ? 'Paise Wapas Mil Gaye?'
                  : 'Udhaar Chukta Kar Diya?'}
              </h2>
              <button onClick={() => setSettleModalId(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                <span className="font-bold text-slate-900">{settleTargetRecord.personName}</span> ka{' '}
                <span className="font-bold font-mono text-slate-900">{formatRupee(settleTargetRecord.amount)}</span>{' '}
                {settleTargetRecord.type === 'to_receive'
                  ? 'aapke kis galla/wallet mai add karein?'
                  : 'aapke kis galla/wallet se kata jaye?'}
              </p>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Galla / Account</label>
                <select
                  value={selectedAccForSettle}
                  onChange={(e) => setSelectedAccForSettle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatRupee(a.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSettleModalId(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSettle}
                  className="px-4 py-1.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Confirm Settle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
