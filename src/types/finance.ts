export type TransactionType = 'expense' | 'income' | 'transfer';

export type IncomeSource =
  | 'daily_pocket_money'
  | 'extra_gift'
  | 'parents_bonus'
  | 'relative'
  | 'festival_shagun'
  | 'freelance'
  | 'other';

export interface CategoryFolder {
  id: string;
  name: string;
  iconName: string;
  color: string;
  monthlyTargetBudget?: number;
  description?: string;
}

export type GallaType = 'online_fampay' | 'main_galla' | 'primary_galla' | 'custom_galla';

export interface PocketAccount {
  id: string;
  name: string;
  type: GallaType;
  balance: number;
  color?: string;
  iconName?: string;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  amount: number;
  categoryId: string; // folder ID (Food, Travel, etc.)
  accountId: string; // source galla (Online FamPay, Main Galla, Primary Galla)
  toAccountId?: string; // for transfer between gallas
  title: string; // e.g. "College Canteen Chai", "Metro Recharge"
  notes?: string;
  sourceType?: IncomeSource;
  tags?: string[];
}

// Udhaar / Debt & Loan with Reminders
export type UdhaarType = 'to_receive' | 'to_give';

export interface UdhaarRecord {
  id: string;
  personName: string;
  type: UdhaarType;
  amount: number;
  date: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD reminder date
  notes?: string;
  status: 'pending' | 'settled';
  settledDate?: string;
}

// Personal Notes, Memos & Hisaab Diary
export type NoteColor = 'amber' | 'emerald' | 'blue' | 'rose' | 'purple' | 'slate';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  tag?: string; // e.g. "Hisaab", "Rules", "College", "Shopping", "Reminder"
  color?: NoteColor;
  isPinned?: boolean;
  amount?: number; // optional amount mentioned in note
  updatedAt?: string;
}

export type AppTheme = 'emerald' | 'indigo' | 'amber' | 'slateDark' | 'rose';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  primary: string;
  primaryHover: string;
  accentBg: string;
  cardBg: string;
  badgeBg: string;
  badgeText: string;
  bgGradient: string;
  isDark?: boolean;
}

export type ActiveTab =
  | 'dashboard'
  | 'transactions'
  | 'reports'
  | 'folders'
  | 'udhaar'
  | 'notes'
  | 'settings';

export type ReportViewMode = 'weekly' | 'monthly';
