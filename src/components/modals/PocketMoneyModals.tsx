import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { GallaType, IncomeSource } from '../../types/finance';
import { X, Check, Plus, Sparkles, ArrowRightLeft, Wallet, Smartphone, Coins } from 'lucide-react';

// --- MODAL 1: ADD DAILY POCKET MONEY (Cash In Hand, Presets: 40₹, 50₹, 60₹, 70₹) ---
export const DailyPocketMoneyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addDailyPocketMoney, dailyAllowanceSetting, accounts, formatRupee } = useFinance();
  const [customAmount, setCustomAmount] = useState<string>(String(dailyAllowanceSetting || 50));
  
  // Default to Primary Galla (Cash)
  const defaultCashAcc = accounts.find((a) => a.type === 'primary_galla')?.id || accounts[0]?.id || 'acc_primary_galla';
  const [targetAccount, setTargetAccount] = useState<string>(defaultCashAcc);

  React.useEffect(() => {
    if (isOpen) {
      const cashAcc = accounts.find((a) => a.type === 'primary_galla')?.id || accounts[0]?.id || 'acc_primary_galla';
      setTargetAccount(cashAcc);
    }
  }, [isOpen, accounts]);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(customAmount);
    if (!isNaN(amt) && amt > 0) {
      addDailyPocketMoney(amt, targetAccount);
      onClose();
    }
  };

  // Requested specific presets: 40₹, 50₹, 60₹, 70₹
  const pocketPresets = [40, 50, 60, 70];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add Daily Pocket Money</h2>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <span>💵 Received in Cash (नकद मिला)</span>
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleAdd} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kitne Rupaye Mile? (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
              <input
                type="number"
                step="5"
                required
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-base font-bold font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Requested specific presets: 40₹, 50₹, 60₹, 70₹ */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
              Quick Pocket Money Presets
            </label>
            <div className="grid grid-cols-4 gap-2">
              {pocketPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCustomAmount(String(preset))}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    customAmount === String(preset)
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kisme jodein? (Default: Cash Primary Galla)
            </label>
            <select
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
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
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              Add ₹{customAmount} Cash Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MODAL 2: ADD EXTRA MONEY (Gift, Shagun, Bonus, Reward) ---
export const ExtraMoneyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addExtraMoney, accounts, formatRupee } = useFinance();
  const [amount, setAmount] = useState<string>('100');
  const [title, setTitle] = useState<string>('Gift from Relatives');
  const [source, setSource] = useState<IncomeSource>('relative');
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id || 'acc_fampay');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!isNaN(num) && num > 0) {
      addExtraMoney(num, source, title, accountId, notes);
      onClose();
    }
  };

  const presetSources = [
    { title: 'Festival Shagun (Eid / Diwali / Rakhi)', source: 'festival_shagun' as IncomeSource },
    { title: 'Gift from Relatives / Dadi / Nani', source: 'relative' as IncomeSource },
    { title: 'Parents Extra Good Marks Bonus', source: 'parents_bonus' as IncomeSource },
    { title: 'Freelance / Small Task Earnings', source: 'freelance' as IncomeSource },
    { title: 'Old Cash Found in Pocket / Bag', source: 'other' as IncomeSource },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900">Add Extra Money</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Extra Amount Received (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
              <input
                type="number"
                step="10"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-base font-bold font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Quick Source Preset</label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {presetSources.map((p) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => {
                    setTitle(p.title);
                    setSource(p.source);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded border transition-colors ${
                    title === p.title
                      ? 'border-amber-500 bg-amber-50/80 font-semibold text-amber-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Description / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kisme daalein?
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({formatRupee(a.balance)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. for treat or festival"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              Add Extra Money
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MODAL 3: LOG KHARCHA (Presets: 40₹, 50₹, 60₹, 70₹) ---
export const QuickExpenseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addExpense, folders, accounts, formatRupee } = useFinance();
  const [amount, setAmount] = useState<string>('50');
  const [title, setTitle] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(folders[0]?.id || 'folder_food');
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id || 'acc_primary_galla');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!isNaN(num) && num > 0) {
      addExpense(num, categoryId, title.trim() || 'Kharcha', accountId, notes.trim());
      onClose();
    }
  };

  // Presets: 40₹, 50₹, 60₹, 70₹ plus 100, 200
  const expensePresets = [40, 50, 60, 70, 100, 200];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <h2 className="text-sm font-bold text-slate-900">Record Kharcha (Expense)</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Kitna Kharcha Hua? (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
              <input
                type="number"
                step="5"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-base font-bold font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              />
            </div>
          </div>

          {/* Presets: 40₹, 50₹, 60₹, 70₹ */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {expensePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(String(preset))}
                className={`py-1 px-3 text-xs font-bold rounded-md border transition-all ${
                  amount === String(preset)
                    ? 'border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Kya Liya? (Title)</label>
            <input
              type="text"
              required
              placeholder="e.g. Chai + Samosa, Metro Recharge, Maggie, Xerox"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Folder / Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Kaha se pay kiya?</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({formatRupee(a.balance)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Note (Optional)</label>
            <input
              type="text"
              placeholder="e.g. With friends at canteen"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
            >
              Log Kharcha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MODAL 4: ADD NEW GALLA / WALLET ---
export const AddGallaModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addGallaAccount } = useFinance();
  const [gallaName, setGallaName] = useState('');
  const [initialBal, setInitialBal] = useState('0');
  const [color, setColor] = useState('#059669');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gallaName.trim()) return;

    addGallaAccount(gallaName.trim(), 'custom_galla', parseFloat(initialBal) || 0, color);
    setGallaName('');
    setInitialBal('0');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Naya Galla / Wallet Add Karo</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleAdd} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Galla / Pocket Ka Naam</label>
            <input
              type="text"
              required
              placeholder="e.g. Secret Cash Galla, Paytm, Emergency Stash"
              value={gallaName}
              onChange={(e) => setGallaName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Initial Balance (₹)</label>
            <input
              type="number"
              step="10"
              value={initialBal}
              onChange={(e) => setInitialBal(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
            >
              Save Galla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MODAL 5: TRANSFER BETWEEN GALLAS ---
export const TransferGallaModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { accounts, transferBetweenGallas, formatRupee } = useFinance();
  const [fromId, setFromId] = useState(accounts[0]?.id || '');
  const [toId, setToId] = useState(accounts[1]?.id || accounts[0]?.id || '');
  const [amount, setAmount] = useState('50');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!isNaN(num) && num > 0 && fromId && toId && fromId !== toId) {
      transferBetweenGallas(fromId, toId, num, notes);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Transfer Between Gallas</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleTransfer} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Kaha se nikalein? (From)</label>
            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({formatRupee(a.balance)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Kisme dalein? (To)</label>
            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id} disabled={a.id === fromId}>
                  {a.name} ({formatRupee(a.balance)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Kitna Amount? (₹)</label>
            <input
              type="number"
              step="5"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm font-bold font-mono rounded-lg border border-slate-300"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={fromId === toId}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs disabled:opacity-40"
            >
              Transfer Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
