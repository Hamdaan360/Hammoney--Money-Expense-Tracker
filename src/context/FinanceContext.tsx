import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_FOLDERS,
  DEFAULT_NOTES,
  DEFAULT_POCKET_ACCOUNTS,
  DEFAULT_TRANSACTIONS,
  DEFAULT_UDHAAR,
  THEMES,
} from '../data/initialData';
import {
  AppTheme,
  CategoryFolder,
  GallaType,
  IncomeSource,
  NoteItem,
  PocketAccount,
  ThemeConfig,
  Transaction,
  UdhaarRecord,
  UdhaarType,
} from '../types/finance';

interface FinanceContextType {
  transactions: Transaction[];
  folders: CategoryFolder[];
  accounts: PocketAccount[];
  udhaarList: UdhaarRecord[];
  notes: NoteItem[];
  currentTheme: AppTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: AppTheme) => void;
  dailyAllowanceSetting: number;
  setDailyAllowanceSetting: (val: number) => void;

  // Indian Rupee Formatter
  formatRupee: (amount: number) => string;

  // Pocket Money Actions (Pocket money received in CASH by default)
  addDailyPocketMoney: (amount?: number, accountId?: string) => void;
  addExtraMoney: (amount: number, source: IncomeSource, title: string, accountId?: string, notes?: string) => void;
  addExpense: (amount: number, categoryId: string, title: string, accountId?: string, notes?: string) => void;
  transferBetweenGallas: (fromAccountId: string, toAccountId: string, amount: number, notes?: string) => void;

  // Udhaar & Khata Reminders
  addUdhaar: (personName: string, type: UdhaarType, amount: number, dueDate: string, notes?: string) => void;
  settleUdhaar: (id: string, accountId?: string) => void;
  deleteUdhaar: (id: string) => void;

  // Notes & Hisaab Diary
  addNote: (note: Omit<NoteItem, 'id' | 'date'>) => void;
  updateNote: (id: string, updates: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  // Galla Actions & Quick Money Edit
  addGallaAccount: (name: string, type: GallaType, initialBalance?: number, color?: string) => void;
  updateGallaBalance: (id: string, newBalance: number) => void;
  setAllGallaBalances: (balances: Record<string, number>) => void;
  deleteGallaAccount: (id: string) => void;

  // Generic Transaction actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  bulkDeleteTransactions: (ids: string[]) => void;

  // Folder actions
  addFolder: (folder: Omit<CategoryFolder, 'id'>) => void;
  updateFolder: (id: string, updates: Partial<CategoryFolder>) => void;
  deleteFolder: (id: string) => void;

  // Reset & Clear (Zero Reset)
  resetDataToZero: () => void;
  exportDataAsJson: () => void;
  exportTransactionsAsCsv: () => void;
  importDataFromJson: (jsonString: string) => boolean;

  // Total Calculations
  totalMoneyInGallas: number; // Kul bache hue paise
  cashInHandBalance: number; // Primary cash galla balance
  totalMoneyToReceive: number; // Jisse wapas lena hai (Udhaar diya tha)
  totalMoneyToGive: number; // Kisko dena baki hai (Udhaar liya tha)
  activeReminders: UdhaarRecord[]; // Due / upcoming reminders

  currentMonthSummary: {
    totalReceived: number;
    totalSpent: number;
    netRemainingInMonth: number;
    dailyBurnRate: number;
    daysRemainingInMonth: number;
    safeDailySpendLimit: number;
  };
  getFolderById: (id: string) => CategoryFolder | undefined;
  getAccountById: (id: string) => PocketAccount | undefined;
}

const STORAGE_KEYS = {
  TX: 'hammony_tx_v6',
  FOLDERS: 'hammony_folders_v6',
  ACCOUNTS: 'hammony_accounts_v6',
  UDHAAR: 'hammony_udhaar_v6',
  NOTES: 'hammony_notes_v6',
  THEME: 'hammony_theme_v6',
  DAILY_ALLOWANCE: 'hammony_daily_allowance_v6',
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved && THEMES[saved] ? (saved as AppTheme) : 'emerald';
    } catch {
      return 'emerald';
    }
  });

  const [dailyAllowanceSetting, setDailyAllowanceSetting] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_ALLOWANCE);
      return saved ? Number(saved) : 50;
    } catch {
      return 50;
    }
  });

  const [folders, setFolders] = useState<CategoryFolder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOLDERS);
      return saved ? JSON.parse(saved) : DEFAULT_FOLDERS;
    } catch {
      return DEFAULT_FOLDERS;
    }
  });

  const [accounts, setAccounts] = useState<PocketAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return saved ? JSON.parse(saved) : DEFAULT_POCKET_ACCOUNTS;
    } catch {
      return DEFAULT_POCKET_ACCOUNTS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TX);
      return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
    } catch {
      return DEFAULT_TRANSACTIONS;
    }
  });

  const [udhaarList, setUdhaarList] = useState<UdhaarRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UDHAAR);
      return saved ? JSON.parse(saved) : DEFAULT_UDHAAR;
    } catch {
      return DEFAULT_UDHAAR;
    }
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  });

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, currentTheme);
    } catch (e) {
      console.error(e);
    }
  }, [currentTheme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_ALLOWANCE, String(dailyAllowanceSetting));
    } catch (e) {
      console.error(e);
    }
  }, [dailyAllowanceSetting]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TX, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    } catch (e) {
      console.error(e);
    }
  }, [folders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.UDHAAR, JSON.stringify(udhaarList));
    } catch (e) {
      console.error(e);
    }
  }, [udhaarList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes]);

  const themeConfig = THEMES[currentTheme] || THEMES.emerald;

  const formatRupee = (amount: number): string => {
    const isNegative = amount < 0;
    const absVal = Math.abs(amount);
    const formatted = absVal.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    return `${isNegative ? '-' : ''}₹${formatted}`;
  };

  const getFolderById = (id: string) => folders.find((f) => f.id === id);
  const getAccountById = (id: string) => accounts.find((a) => a.id === id);

  // Cash account helper: finds Primary Cash Galla or first cash account
  const defaultCashAccountId = useMemo(() => {
    const cashAcc = accounts.find((a) => a.type === 'primary_galla' || a.name.toLowerCase().includes('cash'));
    return cashAcc ? cashAcc.id : accounts[0]?.id || 'acc_primary_galla';
  }, [accounts]);

  // Galla Account Actions
  const addGallaAccount = (
    name: string,
    type: GallaType = 'custom_galla',
    initialBalance: number = 0,
    color: string = '#0284C7'
  ) => {
    const newAcc: PocketAccount = {
      id: `acc_galla_${Date.now()}`,
      name: name.trim(),
      type,
      balance: initialBalance,
      color,
      iconName: 'Wallet',
    };
    setAccounts((prev) => [...prev, newAcc]);
  };

  const updateGallaBalance = (id: string, newBalance: number) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, balance: newBalance } : a)));
  };

  const setAllGallaBalances = (balances: Record<string, number>) => {
    setAccounts((prev) =>
      prev.map((a) => (balances[a.id] !== undefined ? { ...a, balance: balances[a.id] } : a))
    );
  };

  const deleteGallaAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  // Transaction mutations
  const addTransaction = (tx: Omit<Transaction, 'id'>): Transaction => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update account balances
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (acc.id === newTx.accountId) {
          if (newTx.type === 'expense') {
            return { ...acc, balance: acc.balance - newTx.amount };
          }
          if (newTx.type === 'income') {
            return { ...acc, balance: acc.balance + newTx.amount };
          }
          if (newTx.type === 'transfer') {
            return { ...acc, balance: acc.balance - newTx.amount };
          }
        }
        if (newTx.type === 'transfer' && acc.id === newTx.toAccountId) {
          return { ...acc, balance: acc.balance + newTx.amount };
        }
        return acc;
      })
    );

    return newTx;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));

    // Revert balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === target.accountId) {
          if (target.type === 'expense') return { ...acc, balance: acc.balance + target.amount };
          if (target.type === 'income') return { ...acc, balance: acc.balance - target.amount };
          if (target.type === 'transfer') return { ...acc, balance: acc.balance + target.amount };
        }
        if (target.type === 'transfer' && acc.id === target.toAccountId) {
          return { ...acc, balance: acc.balance - target.amount };
        }
        return acc;
      })
    );
  };

  const bulkDeleteTransactions = (ids: string[]) => {
    setTransactions((prev) => prev.filter((tx) => !ids.includes(tx.id)));
  };

  // Pocket Money Actions: Pocket money is received in CASH by default
  const addDailyPocketMoney = (amount?: number, accountId?: string) => {
    const pocketAmt = amount !== undefined ? amount : dailyAllowanceSetting;
    const today = new Date().toISOString().slice(0, 10);
    // Explicitly target Cash (Primary Galla)
    const targetAcc = accountId || defaultCashAccountId;

    addTransaction({
      date: today,
      type: 'income',
      amount: pocketAmt,
      categoryId: 'folder_food',
      accountId: targetAcc,
      title: 'Daily Pocket Money (Cash)',
      notes: `Daily cash pocket money added of ₹${pocketAmt}`,
      sourceType: 'daily_pocket_money',
    });
  };

  const addExtraMoney = (
    amount: number,
    source: IncomeSource,
    title: string,
    accountId?: string,
    notes?: string
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    const targetAcc = accountId || defaultCashAccountId;
    addTransaction({
      date: today,
      type: 'income',
      amount,
      categoryId: 'folder_food',
      accountId: targetAcc,
      title: title.trim() || 'Extra Money',
      notes: notes || 'Extra money added',
      sourceType: source,
    });
  };

  const addExpense = (
    amount: number,
    categoryId: string,
    title: string,
    accountId?: string,
    notes?: string
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    const targetAcc = accountId || defaultCashAccountId;
    addTransaction({
      date: today,
      type: 'expense',
      amount,
      categoryId,
      accountId: targetAcc,
      title: title.trim() || 'Kharcha',
      notes,
    });
  };

  const transferBetweenGallas = (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    notes?: string
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    const fromName = getAccountById(fromAccountId)?.name || 'Galla';
    const toName = getAccountById(toAccountId)?.name || 'Galla';

    addTransaction({
      date: today,
      type: 'transfer',
      amount,
      categoryId: 'folder_food',
      accountId: fromAccountId,
      toAccountId,
      title: `Transfer: ${fromName} ➔ ${toName}`,
      notes: notes || `Transferred from ${fromName} to ${toName}`,
    });
  };

  // --- UDHAAR & KHATA REMINDERS ---
  const addUdhaar = (
    personName: string,
    type: UdhaarType,
    amount: number,
    dueDate: string,
    notes?: string
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    const newRecord: UdhaarRecord = {
      id: `udh_${Date.now()}`,
      personName: personName.trim(),
      type,
      amount,
      date: today,
      dueDate: dueDate || today,
      notes: notes?.trim() || undefined,
      status: 'pending',
    };
    setUdhaarList((prev) => [newRecord, ...prev]);
  };

  const settleUdhaar = (id: string, accountId?: string) => {
    const target = udhaarList.find((u) => u.id === id);
    if (!target) return;
    const today = new Date().toISOString().slice(0, 10);
    const targetAcc = accountId || defaultCashAccountId;

    setUdhaarList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'settled', settledDate: today } : u))
    );

    // If money received back, log as income in cash or chosen galla
    if (target.type === 'to_receive') {
      addTransaction({
        date: today,
        type: 'income',
        amount: target.amount,
        categoryId: 'folder_food',
        accountId: targetAcc,
        title: `Udhaar Wapas Mila: ${target.personName}`,
        notes: `Received pending ₹${target.amount} from ${target.personName}`,
        sourceType: 'other',
      });
    } else {
      // If paid back debt, log as expense
      addTransaction({
        date: today,
        type: 'expense',
        amount: target.amount,
        categoryId: 'folder_food',
        accountId: targetAcc,
        title: `Udhaar Chukta Kiya: ${target.personName}`,
        notes: `Paid back ₹${target.amount} to ${target.personName}`,
      });
    }
  };

  const deleteUdhaar = (id: string) => {
    setUdhaarList((prev) => prev.filter((u) => u.id !== id));
  };

  // --- NOTES & HISAAB DIARY ---
  const addNote = (noteData: Omit<NoteItem, 'id' | 'date'>) => {
    const today = new Date().toISOString().slice(0, 10);
    const newNote: NoteItem = {
      ...noteData,
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date: today,
      updatedAt: today,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<NoteItem>) => {
    const today = new Date().toISOString().slice(0, 10);
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: today } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  // Folder Actions
  const addFolder = (folder: Omit<CategoryFolder, 'id'>) => {
    const newFolder: CategoryFolder = {
      ...folder,
      id: `folder_${Date.now()}`,
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  const updateFolder = (id: string, updates: Partial<CategoryFolder>) => {
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFolder = (id: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  // Reset to 0 (Pehle ka data 0 krdo)
  const resetDataToZero = () => {
    setTransactions([]);
    setUdhaarList([]);
    setAccounts([
      { id: 'acc_primary_galla', name: 'Primary Galla (Cash)', type: 'primary_galla', balance: 0, color: '#D97706', iconName: 'Wallet' },
      { id: 'acc_main_galla', name: 'Main Galla (Cash Box)', type: 'main_galla', balance: 0, color: '#059669', iconName: 'Coins' },
      { id: 'acc_fampay', name: 'Online (FamPay)', type: 'online_fampay', balance: 0, color: '#4F46E5', iconName: 'Smartphone' },
    ]);
    setFolders(DEFAULT_FOLDERS);
    setDailyAllowanceSetting(50);
  };

  // Export / Import
  const exportDataAsJson = () => {
    const payload = {
      app: 'Hammony',
      currency: 'INR',
      exportedAt: new Date().toISOString(),
      dailyAllowanceSetting,
      currentTheme,
      transactions,
      folders,
      accounts,
      udhaarList,
      notes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hammony_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTransactionsAsCsv = () => {
    const headers = ['Date', 'Type', 'Amount (INR)', 'Folder', 'Title', 'Galla Account', 'Notes'];
    const rows = transactions.map((t) => [
      t.date,
      t.type,
      t.amount,
      `"${getFolderById(t.categoryId)?.name || t.categoryId}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${getAccountById(t.accountId)?.name || t.accountId}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hammony_records_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataFromJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.transactions)) setTransactions(data.transactions);
      if (Array.isArray(data.folders)) setFolders(data.folders);
      if (Array.isArray(data.accounts)) setAccounts(data.accounts);
      if (Array.isArray(data.udhaarList)) setUdhaarList(data.udhaarList);
      if (Array.isArray(data.notes)) setNotes(data.notes);
      if (data.currentTheme && THEMES[data.currentTheme]) setCurrentTheme(data.currentTheme);
      if (data.dailyAllowanceSetting) setDailyAllowanceSetting(Number(data.dailyAllowanceSetting));
      return true;
    } catch {
      return false;
    }
  };

  // Calculations
  const totalMoneyInGallas = useMemo(() => {
    return accounts.reduce((sum, a) => sum + a.balance, 0);
  }, [accounts]);

  const cashInHandBalance = useMemo(() => {
    const cashAcc = accounts.find((a) => a.type === 'primary_galla');
    return cashAcc ? cashAcc.balance : 0;
  }, [accounts]);

  const totalMoneyToReceive = useMemo(() => {
    return udhaarList
      .filter((u) => u.type === 'to_receive' && u.status === 'pending')
      .reduce((sum, u) => sum + u.amount, 0);
  }, [udhaarList]);

  const totalMoneyToGive = useMemo(() => {
    return udhaarList
      .filter((u) => u.type === 'to_give' && u.status === 'pending')
      .reduce((sum, u) => sum + u.amount, 0);
  }, [udhaarList]);

  const activeReminders = useMemo(() => {
    return udhaarList
      .filter((u) => u.status === 'pending')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [udhaarList]);

  const currentMonthSummary = useMemo(() => {
    const currentMonth = '2026-10';
    const monthTx = transactions.filter((t) => t.date.startsWith(currentMonth));

    const totalReceived = monthTx
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpent = monthTx
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netRemainingInMonth = totalReceived - totalSpent;
    const daysElapsed = 20;
    const daysRemainingInMonth = 31 - daysElapsed;
    const dailyBurnRate = daysElapsed > 0 ? totalSpent / daysElapsed : 0;

    const safeDailySpendLimit =
      daysRemainingInMonth > 0 && totalMoneyInGallas > 0
        ? Math.floor(totalMoneyInGallas / daysRemainingInMonth)
        : 0;

    return {
      totalReceived,
      totalSpent,
      netRemainingInMonth,
      dailyBurnRate,
      daysRemainingInMonth,
      safeDailySpendLimit,
    };
  }, [transactions, totalMoneyInGallas]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        folders,
        accounts,
        udhaarList,
        notes,
        currentTheme,
        themeConfig,
        setTheme: setCurrentTheme,
        dailyAllowanceSetting,
        setDailyAllowanceSetting,
        formatRupee,
        addDailyPocketMoney,
        addExtraMoney,
        addExpense,
        transferBetweenGallas,
        addUdhaar,
        settleUdhaar,
        deleteUdhaar,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        addGallaAccount,
        updateGallaBalance,
        setAllGallaBalances,
        deleteGallaAccount,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        bulkDeleteTransactions,
        addFolder,
        updateFolder,
        deleteFolder,
        resetDataToZero,
        exportDataAsJson,
        exportTransactionsAsCsv,
        importDataFromJson,
        totalMoneyInGallas,
        cashInHandBalance,
        totalMoneyToReceive,
        totalMoneyToGive,
        activeReminders,
        currentMonthSummary,
        getFolderById,
        getAccountById,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
