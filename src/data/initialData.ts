import { CategoryFolder, NoteItem, PocketAccount, ThemeConfig, Transaction, UdhaarRecord } from '../types/finance';

export const THEMES: Record<string, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'Rupee Mint (Emerald)',
    primary: '#059669',
    primaryHover: '#047857',
    accentBg: '#ECFDF5',
    cardBg: '#FFFFFF',
    badgeBg: '#D1FAE5',
    badgeText: '#065F46',
    bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #E6FBF0 40%, #F8FAFC 100%)',
    isDark: false,
  },
  indigo: {
    id: 'indigo',
    name: 'Royal Indigo',
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    accentBg: '#EEF2FF',
    cardBg: '#FFFFFF',
    badgeBg: '#E0E7FF',
    badgeText: '#3730A3',
    bgGradient: 'linear-gradient(135deg, #EEF2FF 0%, #E5EAFF 40%, #F8FAFC 100%)',
    isDark: false,
  },
  amber: {
    id: 'amber',
    name: 'Chai & Terracotta',
    primary: '#D97706',
    primaryHover: '#B45309',
    accentBg: '#FFFBEB',
    cardBg: '#FFFFFF',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    bgGradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 40%, #FFFDF9 100%)',
    isDark: false,
  },
  slateDark: {
    id: 'slateDark',
    name: 'Midnight Dark',
    primary: '#10B981',
    primaryHover: '#059669',
    accentBg: '#1E293B',
    cardBg: '#0F172A',
    badgeBg: '#1E293B',
    badgeText: '#6EE7B7',
    bgGradient: 'linear-gradient(135deg, #090D16 0%, #0F172A 50%, #060911 100%)',
    isDark: true,
  },
  rose: {
    id: 'rose',
    name: 'Crimson Rose',
    primary: '#E11D48',
    primaryHover: '#BE123C',
    accentBg: '#FFF1F2',
    cardBg: '#FFFFFF',
    badgeBg: '#FFE4E6',
    badgeText: '#9F1239',
    bgGradient: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 40%, #F8FAFC 100%)',
    isDark: false,
  },
};

export const DEFAULT_FOLDERS: CategoryFolder[] = [
  {
    id: 'folder_food',
    name: 'Food & Chai',
    iconName: 'Utensils',
    color: '#EA580C',
    monthlyTargetBudget: 2000,
    description: 'Chai, canteen, snacks, samosa, maggie',
  },
  {
    id: 'folder_travel',
    name: 'Travel & Metro',
    iconName: 'Bus',
    color: '#0284C7',
    monthlyTargetBudget: 1000,
    description: 'Metro card, Auto, Rapido, Bus, Petrol',
  },
  {
    id: 'folder_recharge',
    name: 'Recharge & Net',
    iconName: 'Smartphone',
    color: '#6366F1',
    monthlyTargetBudget: 500,
    description: 'Mobile recharge, data booster, hotspot',
  },
  {
    id: 'folder_hangout',
    name: 'Friends & Outings',
    iconName: 'PartyPopper',
    color: '#D97706',
    monthlyTargetBudget: 1200,
    description: 'Movies, cafes, weekend chill, treats',
  },
  {
    id: 'folder_study',
    name: 'College & Books',
    iconName: 'BookOpen',
    color: '#059669',
    monthlyTargetBudget: 600,
    description: 'Stationery, xerox, assignment prints',
  },
  {
    id: 'folder_shopping',
    name: 'Personal & Shopping',
    iconName: 'ShoppingBag',
    color: '#9333EA',
    monthlyTargetBudget: 800,
    description: 'Clothes, haircut, grooming, earphones',
  },
];

// Pocket Money is received in CASH: Primary Galla (Cash) is the primary default!
export const DEFAULT_POCKET_ACCOUNTS: PocketAccount[] = [
  {
    id: 'acc_primary_galla',
    name: 'Primary Galla (Cash)',
    type: 'primary_galla',
    balance: 0,
    color: '#D97706',
    iconName: 'Wallet',
  },
  {
    id: 'acc_main_galla',
    name: 'Main Galla (Cash Box)',
    type: 'main_galla',
    balance: 0,
    color: '#059669',
    iconName: 'Coins',
  },
  {
    id: 'acc_fampay',
    name: 'Online (FamPay)',
    type: 'online_fampay',
    balance: 0,
    color: '#4F46E5',
    iconName: 'Smartphone',
  },
];

// Initial data starts clean at 0
export const DEFAULT_TRANSACTIONS: Transaction[] = [];

// Initial Udhaar starts clean at 0
export const DEFAULT_UDHAAR: UdhaarRecord[] = [];

// Helpful starter notes for pocket money & hisaab
export const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'note_rule_1',
    title: 'Pocket Money Ka Niyam 💰',
    content: 'Pocket money mujhe cash me milti hai. Roj canteen aur chai par ₹40-50 se jyada bina soche kharch nahi karna. Weekend par thode paise bachane hai.',
    date: '2026-10-20',
    tag: 'Rules',
    color: 'emerald',
    isPinned: true,
  },
  {
    id: 'note_plan_2',
    title: 'College Assignment Xerox & Stationery 📚',
    content: 'Lab manual aur physics assignment print out ke liye ₹70 alag se cash me rakhne hai.',
    date: '2026-10-19',
    tag: 'College',
    color: 'amber',
    isPinned: false,
    amount: 70,
  },
];
