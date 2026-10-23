import React, { useRef, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { AppTheme } from '../../types/finance';
import { THEMES } from '../../data/initialData';
import {
  Palette,
  IndianRupee,
  Wallet,
  Smartphone,
  Coins,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  ShieldCheck,
  Check,
  Plus,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currentTheme,
    setTheme,
    themeConfig,
    dailyAllowanceSetting,
    setDailyAllowanceSetting,
    accounts,
    updateGallaBalance,
    addGallaAccount,
    formatRupee,
    exportDataAsJson,
    exportTransactionsAsCsv,
    importDataFromJson,
    resetDataToZero,
  } = useFinance();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [allowanceInput, setAllowanceInput] = useState<string>(String(dailyAllowanceSetting));

  const [editingAccId, setEditingAccId] = useState<string | null>(null);
  const [accBalanceInput, setAccBalanceInput] = useState<string>('');

  const [showAddGalla, setShowAddGalla] = useState(false);
  const [newGallaName, setNewGallaName] = useState('');
  const [newGallaBalance, setNewGallaBalance] = useState('0');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSaveAllowance = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(allowanceInput);
    if (!isNaN(num) && num > 0) {
      setDailyAllowanceSetting(num);
      setFeedback(`Daily pocket money allowance set to ${formatRupee(num)}.`);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleSaveAccountBalance = (accId: string) => {
    const num = parseFloat(accBalanceInput);
    if (!isNaN(num)) {
      updateGallaBalance(accId, num);
      setFeedback('Galla balance updated.');
      setTimeout(() => setFeedback(''), 3000);
    }
    setEditingAccId(null);
  };

  const handleCreateGalla = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallaName.trim()) return;
    addGallaAccount(newGallaName.trim(), 'custom_galla', parseFloat(newGallaBalance) || 0);
    setNewGallaName('');
    setNewGallaBalance('0');
    setShowAddGalla(false);
    setFeedback('Naya Galla add ho gaya.');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataFromJson(content);
      if (success) {
        setFeedback('Pocket money records successfully restored from backup.');
      } else {
        setFeedback('Failed to parse file. Please verify formatting.');
      }
      setTimeout(() => setFeedback(''), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {feedback && (
        <div className="p-3 bg-slate-900 text-white text-xs font-medium rounded-lg flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Hammony App Settings</span>
          <span aria-hidden="true">·</span>
          <span>Indian Rupee (₹) Only</span>
        </div>
        <h1
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Preferences & Galla Settings
        </h1>
      </div>

      {/* Theme Changer */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Palette className="w-4 h-4" style={{ color: themeConfig.primary }} />
          <h2>Theme Changer (Colour Combination)</h2>
        </div>
        <p className="text-xs text-slate-500">
          Select a vibrant, clean theme tailored for Hammony.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {Object.values(THEMES).map((th) => (
            <button
              key={th.id}
              onClick={() => {
                setTheme(th.id as AppTheme);
                setFeedback(`Switched theme to ${th.name}`);
                setTimeout(() => setFeedback(''), 2500);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                currentTheme === th.id
                  ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-900">{th.name}</span>
                {currentTheme === th.id && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md" style={{ backgroundColor: th.primary }} />
                <div className="w-5 h-5 rounded-md border" style={{ backgroundColor: th.cardBg }} />
                <div className="w-5 h-5 rounded-md" style={{ backgroundColor: th.accentBg }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ider Paisa Rekha Hai (Gallas & FamPay) */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <h2>Ider Paisa Rekha Hai (Galla & FamPay)</h2>
          </div>
          <button
            onClick={() => setShowAddGalla(!showAddGalla)}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Naya Galla</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Manage where your pocket money is kept: Online (FamPay), Main Galla, Primary Galla, or add custom cash pockets.
        </p>

        {showAddGalla && (
          <form
            onSubmit={handleCreateGalla}
            className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs"
          >
            <div className="font-semibold text-slate-900">Naya Galla Detail</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Galla / Pocket Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Host Cash, Metro Wallet"
                  value={newGallaName}
                  onChange={(e) => setNewGallaName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Starting Balance (₹)</label>
                <input
                  type="number"
                  step="10"
                  value={newGallaBalance}
                  onChange={(e) => setNewGallaBalance(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddGalla(false)}
                className="px-3 py-1 text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-slate-900 text-white rounded font-medium"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <div className="divide-y divide-slate-100">
          {accounts.map((acc) => (
            <div key={acc.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  {acc.type === 'online_fampay' ? (
                    <Smartphone className="w-3.5 h-3.5" />
                  ) : acc.type === 'main_galla' ? (
                    <Coins className="w-3.5 h-3.5" />
                  ) : (
                    <Wallet className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{acc.name}</p>
                  <p className="text-slate-400 text-[10px] capitalize">{acc.type.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {editingAccId === acc.id ? (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs">₹</span>
                    <input
                      type="number"
                      step="10"
                      value={accBalanceInput}
                      onChange={(e) => setAccBalanceInput(e.target.value)}
                      className="w-24 px-2 py-1 font-mono font-bold text-xs border rounded"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveAccountBalance(acc.id)}
                      className="p-1 text-emerald-600 hover:text-emerald-800"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingAccId(acc.id);
                      setAccBalanceInput(String(acc.balance));
                    }}
                    className="flex items-center gap-2 font-mono font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors"
                    title="Click to calibrate balance"
                  >
                    <span>{formatRupee(acc.balance)}</span>
                    <span className="text-[10px] text-slate-400 font-sans font-normal">(Edit)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Pocket Money Allowance */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <IndianRupee className="w-4 h-4 text-emerald-600" />
          <h2>Default Pocket Money Setting</h2>
        </div>
        <p className="text-xs text-slate-500">
          Baseline daily allowance (Recommended: 40₹, 50₹, 60₹, 70₹).
        </p>

        <form onSubmit={handleSaveAllowance} className="flex items-center gap-3 pt-1 max-w-sm">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
            <input
              type="number"
              step="5"
              required
              value={allowanceInput}
              onChange={(e) => setAllowanceInput(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm font-bold font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            style={{ backgroundColor: themeConfig.primary }}
            className="px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-xs hover:opacity-95"
          >
            Save Target
          </button>
        </form>
      </div>

      {/* Backup & Zero Reset */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <h2>Data Portability & Zero Reset</h2>
        </div>
        <p className="text-xs text-slate-500">
          Download records or reset all balances and transactions cleanly to 0.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={exportDataAsJson}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            <Download className="w-4 h-4" />
            <span>Export Complete JSON Backup</span>
          </button>

          <button
            onClick={exportTransactionsAsCsv}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            <Download className="w-4 h-4" />
            <span>Export Kharcha Spreadsheet (CSV)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            <Upload className="w-4 h-4" />
            <span>Restore From JSON Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />

          {showConfirmReset ? (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-xs font-bold text-rose-800">
                Pakka pura data ₹0 par reset karna chahte hai?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetDataToZero();
                    setShowConfirmReset(false);
                    setFeedback('Pura data 0 kar diya gaya hai.');
                    setTimeout(() => setFeedback(''), 3000);
                  }}
                  className="px-3 py-1 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded shadow-xs"
                >
                  Haan, Reset 0
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center justify-center gap-2 p-3 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-800 text-xs font-semibold"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Pehle Ka Data 0 Krdo (Reset to 0)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
