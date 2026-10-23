import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  X,
  Coins,
  RotateCcw,
  Wallet,
  Smartphone,
  Save,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface MoneyEditAndResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'edit' | 'reset';
}

export const MoneyEditAndResetModal: React.FC<MoneyEditAndResetModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'edit',
}) => {
  const {
    accounts,
    updateGallaBalance,
    resetDataToZero,
    formatRupee,
    themeConfig,
    totalMoneyInGallas,
  } = useFinance();

  const [mode, setMode] = useState<'edit' | 'reset'>(initialMode);
  const [balanceEdits, setBalanceEdits] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    accounts.forEach((a) => {
      initial[a.id] = String(a.balance);
    });
    return initial;
  });

  const [confirmStep, setConfirmStep] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Keep state in sync when opened
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setConfirmStep(false);
      setSuccessMessage('');
      const initial: Record<string, string> = {};
      accounts.forEach((a) => {
        initial[a.id] = String(a.balance);
      });
      setBalanceEdits(initial);
    }
  }, [isOpen, accounts, initialMode]);

  if (!isOpen) return null;

  const handleSaveAllBalances = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(balanceEdits).forEach(([id, val]) => {
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) {
        updateGallaBalance(id, Math.max(0, parsed));
      }
    });

    setSuccessMessage('Sabhi Galla & Cash balance update ho gaye!');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1200);
  };

  const handleConfirmReset = () => {
    resetDataToZero();
    setConfirmStep(false);
    setSuccessMessage('Pura data safaltapoorvak ₹0 par reset kar diya gya!');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Mode Switcher */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMode('edit');
                setConfirmStep(false);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                mode === 'edit'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Money Edit (Balance)</span>
            </button>

            <button
              onClick={() => {
                setMode('reset');
                setConfirmStep(false);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                mode === 'reset'
                  ? 'bg-rose-50 text-rose-800 shadow-xs border border-rose-200'
                  : 'text-slate-500 hover:text-rose-700'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>Reset to 0</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 mx-4 mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-5">
          {mode === 'edit' ? (
            <form onSubmit={handleSaveAllBalances} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-extrabold text-slate-900">
                    Aapke Paas Kitna Paisa Hai? (Direct Balance Edit)
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    Total: {formatRupee(totalMoneyInGallas)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Aap cash ya galla me bacha hua paisa sidhe yaha se adjust kar sakte hai:
                </p>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {accounts.map((acc) => {
                  const isFamPay = acc.type === 'online_fampay' || acc.name.toLowerCase().includes('fampay');
                  const isMain = acc.type === 'main_galla';

                  return (
                    <div
                      key={acc.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 ${
                            isFamPay ? 'bg-indigo-600' : isMain ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}
                        >
                          {isFamPay ? (
                            <Smartphone className="w-3.5 h-3.5" />
                          ) : isMain ? (
                            <Coins className="w-3.5 h-3.5" />
                          ) : (
                            <Wallet className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-800 block truncate">
                            {acc.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Current: {formatRupee(acc.balance)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="relative w-24">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={balanceEdits[acc.id] ?? '0'}
                            onChange={(e) =>
                              setBalanceEdits((prev) => ({
                                ...prev,
                                [acc.id]: e.target.value,
                              }))
                            }
                            className="w-full pl-6 pr-2 py-1 text-xs font-bold font-mono text-right rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        {/* Quick 0 button */}
                        <button
                          type="button"
                          onClick={() =>
                            setBalanceEdits((prev) => ({
                              ...prev,
                              [acc.id]: '0',
                            }))
                          }
                          className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-md hover:bg-slate-100"
                          title="Reset this to ₹0"
                        >
                          ₹0
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Cash Set Presets */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block mb-1.5">
                  Quick Primary Cash Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[50, 100, 200, 500].map((amt) => {
                    const primaryCashAcc = accounts.find((a) => a.type === 'primary_galla') || accounts[0];
                    if (!primaryCashAcc) return null;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() =>
                          setBalanceEdits((prev) => ({
                            ...prev,
                            [primaryCashAcc.id]: String(amt),
                          }))
                        }
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200"
                      >
                        Cash ₹{amt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: themeConfig.primary }}
                  className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-95 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Balances</span>
                </button>
              </div>
            </form>
          ) : (
            /* Reset to 0 mode */
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-bold text-xs">Pehle Ka Data 0 Krdo (Full Zero Reset)</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Is option se aapke sabhi puraane records, kharcha, udhaar hisab, aur galla balances
                  saaf karke <strong className="font-extrabold">₹0</strong> kar diye jayenge.
                </p>
              </div>

              {!confirmStep ? (
                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 space-y-1">
                    <div className="font-semibold text-slate-800">Current Records:</div>
                    <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-0.5">
                      <li>Total Galla Balance: {formatRupee(totalMoneyInGallas)}</li>
                      <li>Online FamPay + Main Galla + Primary Galla will be reset to ₹0</li>
                      <li>Transaction history will be cleared cleanly</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setConfirmStep(true)}
                    className="w-full py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Haan, Pehle Ka Data 0 Krdo</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl border-2 border-rose-400 bg-white space-y-3">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                    <HelpCircle className="w-4 h-4 text-rose-600" />
                    <span>Kya aap sach me confirm karte hai?</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Yeh action irreversible hai. Sabhi purane kharche aur paise 0 ho jayenge.
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setConfirmStep(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Nahi, Cancel
                    </button>
                    <button
                      onClick={handleConfirmReset}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs"
                    >
                      Confirm Reset to ₹0
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
