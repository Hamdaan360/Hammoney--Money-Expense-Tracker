import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryFolder } from '../../types/finance';
import { Plus, FolderPlus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';

export const FoldersView: React.FC = () => {
  const {
    folders,
    transactions,
    addFolder,
    updateFolder,
    deleteFolder,
    formatRupee,
    themeConfig,
  } = useFinance();

  const [isAdding, setIsAdding] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderBudget, setNewFolderBudget] = useState('1000');
  const [newFolderColor, setNewFolderColor] = useState('#059669');
  const [newFolderDesc, setNewFolderDesc] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBudgetInput, setEditBudgetInput] = useState<string>('');

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    addFolder({
      name: newFolderName.trim(),
      iconName: 'Folder',
      color: newFolderColor,
      monthlyTargetBudget: parseFloat(newFolderBudget) || 1000,
      description: newFolderDesc.trim() || undefined,
    });

    setNewFolderName('');
    setNewFolderBudget('1000');
    setNewFolderDesc('');
    setIsAdding(false);
  };

  const handleSaveBudget = (folderId: string) => {
    const num = parseFloat(editBudgetInput);
    if (!isNaN(num) && num >= 0) {
      updateFolder(folderId, { monthlyTargetBudget: num });
    }
    setEditingId(null);
  };

  const colorPalette = [
    '#EA580C', // Orange
    '#059669', // Emerald
    '#0284C7', // Blue
    '#6366F1', // Indigo
    '#D97706', // Amber
    '#9333EA', // Purple
    '#E11D48', // Rose
    '#10B981', // Teal
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Pocket Categorization</span>
            <span aria-hidden="true">·</span>
            <span>{folders.length} Active Folders</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Expense Folders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize your pocket money kharcha into clean folders like Food, Travel, Friends, and Savings.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          style={{ backgroundColor: themeConfig.primary }}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-lg shadow-xs hover:opacity-95 transition-all whitespace-nowrap self-start md:self-auto"
        >
          <FolderPlus className="w-4 h-4" />
          <span>+ Add New Folder</span>
        </button>
      </div>

      {/* Add New Folder Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateFolder}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 animate-in fade-in duration-150 text-xs"
        >
          <div className="font-bold text-slate-900 text-sm">Create New Expense Folder</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Folder Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Gym, Gaming, Snacks, Books"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Monthly Target Budget (₹)</label>
              <input
                type="number"
                step="50"
                required
                placeholder="1000"
                value={newFolderBudget}
                onChange={(e) => setNewFolderBudget(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Description (Optional)</label>
              <input
                type="text"
                placeholder="What this folder is for"
                value={newFolderDesc}
                onChange={(e) => setNewFolderDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium">Pick a Color</label>
            <div className="flex items-center gap-2">
              {colorPalette.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setNewFolderColor(col)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    newFolderColor === col ? 'ring-2 ring-slate-900 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
            >
              Save Folder
            </button>
          </div>
        </form>
      )}

      {/* Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder) => {
          const spent = transactions
            .filter(
              (t) =>
                t.categoryId === folder.id &&
                t.date.startsWith('2026-10') &&
                t.type === 'expense'
            )
            .reduce((sum, t) => sum + t.amount, 0);

          const limit = folder.monthlyTargetBudget || 1000;
          const percent = Math.round((spent / limit) * 100);
          const isOver = spent > limit;
          const isEditing = editingId === folder.id;

          return (
            <div
              key={folder.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: folder.color }}
                    />
                    <h3 className="font-bold text-slate-900 text-sm truncate">{folder.name}</h3>
                  </div>

                  {folders.length > 3 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete folder "${folder.name}"?`)) {
                          deleteFolder(folder.id);
                        }
                      }}
                      className="text-slate-300 hover:text-rose-600 p-1 rounded"
                      title="Delete folder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {folder.description && (
                  <p className="text-[11px] text-slate-400 mb-3">{folder.description}</p>
                )}

                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {formatRupee(spent)}
                  </div>

                  <div className="text-xs text-slate-500">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="50"
                          value={editBudgetInput}
                          onChange={(e) => setEditBudgetInput(e.target.value)}
                          className="w-20 px-1 py-0.5 text-xs font-mono font-semibold border border-indigo-400 rounded focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveBudget(folder.id)}
                          className="p-1 text-emerald-600 hover:text-emerald-800"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(folder.id);
                          setEditBudgetInput(String(limit));
                        }}
                        className="flex items-center gap-1 hover:text-indigo-600 transition-colors group"
                        title="Edit target"
                      >
                        <span className="font-mono tabular-nums">
                          Cap: {formatRupee(limit)}
                        </span>
                        <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-2">
                  <div
                    style={{
                      width: `${Math.min(100, percent)}%`,
                      backgroundColor: isOver ? '#E11D48' : folder.color,
                    }}
                    className="h-full transition-all"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{percent}% consumed</span>
                {isOver ? (
                  <span className="font-mono tabular-nums text-rose-600 font-medium">
                    +{formatRupee(spent - limit)} over budget
                  </span>
                ) : (
                  <span className="font-mono tabular-nums text-emerald-600 font-medium">
                    {formatRupee(limit - spent)} bache hai
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
