import React, { useMemo, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction } from '../../types/finance';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Download,
  ArrowUpDown,
  Filter,
  X,
  IndianRupee,
} from 'lucide-react';

interface TransactionsViewProps {
  onOpenAddExpense: () => void;
  onEditTransaction: (tx: Transaction) => void;
  initialTypeFilter?: string;
  initialQuery?: string;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenAddExpense,
  onEditTransaction,
  initialTypeFilter,
  initialQuery,
}) => {
  const {
    transactions,
    folders,
    accounts,
    deleteTransaction,
    bulkDeleteTransactions,
    formatRupee,
    exportTransactionsAsCsv,
    getFolderById,
    getAccountById,
    themeConfig,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [typeFilter, setTypeFilter] = useState<string>(initialTypeFilter || 'all');
  const [folderFilter, setFolderFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string>('');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = tx.title.toLowerCase().includes(q);
          const matchNotes = (tx.notes || '').toLowerCase().includes(q);
          if (!matchTitle && !matchNotes) return false;
        }

        if (typeFilter !== 'all') {
          if (typeFilter === 'expense' && tx.type !== 'expense') return false;
          if (typeFilter === 'income' && tx.type !== 'income') return false;
          if (typeFilter === 'transfer' && tx.type !== 'transfer') return false;
        }

        if (folderFilter !== 'all' && tx.categoryId !== folderFilter) return false;
        if (accountFilter !== 'all' && tx.accountId !== accountFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
          return sortDirection === 'desc' ? dateDiff : -dateDiff;
        }
        if (sortField === 'amount') {
          return sortDirection === 'desc' ? b.amount - a.amount : a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, searchQuery, typeFilter, folderFilter, accountFilter, sortField, sortDirection]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredTransactions.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    bulkDeleteTransactions(selectedIds);
    setToastMessage(`Deleted ${selectedIds.length} transactions.`);
    setSelectedIds([]);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDeleteSingle = (id: string, title: string) => {
    deleteTransaction(id);
    setToastMessage(`Deleted entry for "${title}".`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-slate-900 text-white text-xs font-medium rounded-lg flex items-center justify-between shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Pocket Ledger</span>
            <span aria-hidden="true">·</span>
            <span>{filteredTransactions.length} of {transactions.length} Records</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Kharcha & Pocket Money Records
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportTransactionsAsCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddExpense}
            style={{ backgroundColor: themeConfig.primary }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs hover:opacity-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Record Kharcha</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search chai, samosa, metro, gifts, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex p-1 bg-slate-100 rounded-lg shrink-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'expense', label: 'Kharcha' },
              { id: 'income', label: 'Pocket Money / Aaye' },
              { id: 'transfer', label: 'Transfer' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all whitespace-nowrap ${
                  typeFilter === t.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Folder:</span>
            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700"
            >
              <option value="all">All Folders</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Account:</span>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700"
            >
              <option value="all">All Accounts</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {selectedIds.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-slate-500 font-mono text-[11px]">
                {selectedIds.length} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No pocket money records found for the active filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === filteredTransactions.length &&
                        filteredTransactions.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-emerald-600"
                    />
                  </th>
                  <th
                    className="py-3 px-3 cursor-pointer select-none hover:text-slate-900"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Date</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3">Title / Item</th>
                  <th className="py-3 px-3">Folder</th>
                  <th className="py-3 px-3">Account</th>
                  <th
                    className="py-3 px-3 text-right cursor-pointer select-none hover:text-slate-900"
                    onClick={() => toggleSort('amount')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Amount</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => {
                  const folder = getFolderById(tx.categoryId);
                  const acc = getAccountById(tx.accountId);
                  const isExp = tx.type === 'expense';
                  const isTransfer = tx.type === 'transfer';
                  const isSelected = selectedIds.includes(tx.id);

                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(tx.id)}
                          className="rounded border-slate-300 text-emerald-600"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{tx.title}</div>
                        {tx.notes && (
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{tx.notes}</div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: folder?.color || '#059669' }}
                          />
                          <span>{folder?.name || 'General'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{acc?.name || 'Cash'}</td>
                      <td
                        className={`py-3 px-3 text-right font-mono font-bold tabular-nums whitespace-nowrap ${
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
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSingle(tx.id, tx.title)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
