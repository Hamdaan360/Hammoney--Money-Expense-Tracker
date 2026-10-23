import React, { useMemo, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { NoteColor, NoteItem } from '../../types/finance';
import {
  FileText,
  Plus,
  Pin,
  Trash2,
  Edit2,
  Search,
  Sparkles,
  Calendar,
  X,
  Check,
  Tag,
  IndianRupee,
  StickyNote,
} from 'lucide-react';

export const NotesView: React.FC = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    formatRupee,
    themeConfig,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Hisaab');
  const [color, setColor] = useState<NoteColor>('emerald');
  const [amountStr, setAmountStr] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // Tags available
  const availableTags = ['all', 'Hisaab', 'Rules', 'College', 'Reminders', 'Shopping', 'Personal'];

  const colorStyles: Record<NoteColor, { bg: string; border: string; header: string; text: string; badge: string }> = {
    amber: {
      bg: 'bg-amber-50/90',
      border: 'border-amber-200',
      header: 'text-amber-900',
      text: 'text-amber-800',
      badge: 'bg-amber-200/80 text-amber-900',
    },
    emerald: {
      bg: 'bg-emerald-50/90',
      border: 'border-emerald-200',
      header: 'text-emerald-900',
      text: 'text-emerald-800',
      badge: 'bg-emerald-200/80 text-emerald-900',
    },
    blue: {
      bg: 'bg-sky-50/90',
      border: 'border-sky-200',
      header: 'text-sky-900',
      text: 'text-sky-800',
      badge: 'bg-sky-200/80 text-sky-900',
    },
    rose: {
      bg: 'bg-rose-50/90',
      border: 'border-rose-200',
      header: 'text-rose-900',
      text: 'text-rose-800',
      badge: 'bg-rose-200/80 text-rose-900',
    },
    purple: {
      bg: 'bg-purple-50/90',
      border: 'border-purple-200',
      header: 'text-purple-900',
      text: 'text-purple-800',
      badge: 'bg-purple-200/80 text-purple-900',
    },
    slate: {
      bg: 'bg-slate-50/90',
      border: 'border-slate-200',
      header: 'text-slate-900',
      text: 'text-slate-800',
      badge: 'bg-slate-200 text-slate-800',
    },
  };

  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        if (selectedTag !== 'all' && n.tag?.toLowerCase() !== selectedTag.toLowerCase()) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = n.title.toLowerCase().includes(q);
          const matchesContent = n.content.toLowerCase().includes(q);
          const matchesTag = n.tag?.toLowerCase().includes(q);
          return matchesTitle || matchesContent || matchesTag;
        }
        return true;
      })
      .sort((a, b) => {
        // Pinned notes first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [notes, selectedTag, searchQuery]);

  const openNewNoteModal = (template?: { title: string; content: string; tag: string; color: NoteColor }) => {
    setEditingNote(null);
    if (template) {
      setTitle(template.title);
      setContent(template.content);
      setTag(template.tag);
      setColor(template.color);
    } else {
      setTitle('');
      setContent('');
      setTag('Hisaab');
      setColor('emerald');
    }
    setAmountStr('');
    setIsPinned(false);
    setIsModalOpen(true);
  };

  const openEditNoteModal = (note: NoteItem) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTag(note.tag || 'Hisaab');
    setColor(note.color || 'emerald');
    setAmountStr(note.amount !== undefined ? String(note.amount) : '');
    setIsPinned(!!note.isPinned);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedAmount = amountStr.trim() ? parseFloat(amountStr) : undefined;

    if (editingNote) {
      updateNote(editingNote.id, {
        title: title.trim(),
        content: content.trim(),
        tag: tag.trim() || undefined,
        color,
        amount: !isNaN(parsedAmount as number) ? parsedAmount : undefined,
        isPinned,
      });
    } else {
      addNote({
        title: title.trim(),
        content: content.trim(),
        tag: tag.trim() || undefined,
        color,
        amount: !isNaN(parsedAmount as number) ? parsedAmount : undefined,
        isPinned,
      });
    }

    setIsModalOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Pocket Money Diary</span>
            <span aria-hidden="true">·</span>
            <span>Personal Hisaab & Notes</span>
            <span aria-hidden="true">·</span>
            <span>Indian Rupee</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Hisaab Diary & Notes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pocket money hisaab, canteen reminders, college dues, and personal memos note karein.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => openNewNoteModal()}
            style={{ backgroundColor: themeConfig.primary }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Naya Note Likhein</span>
          </button>
        </div>
      </div>

      {/* Quick Templates Bar */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Note Templates:</span>
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              openNewNoteModal({
                title: 'Canteen / Chai Dues ☕',
                content: 'Canteen bhaiya ko kal ke samosa & chai ke paise dene hai.',
                tag: 'Hisaab',
                color: 'amber',
              })
            }
            className="px-2.5 py-1 text-[11px] font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
          >
            ☕ Canteen Dues
          </button>

          <button
            onClick={() =>
              openNewNoteModal({
                title: 'College Xerox & Books 📖',
                content: 'Lab records xerox aur chemistry notebook lene ke liye cash alag rakhna.',
                tag: 'College',
                color: 'blue',
              })
            }
            className="px-2.5 py-1 text-[11px] font-medium text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
          >
            📖 College Xerox
          </button>

          <button
            onClick={() =>
              openNewNoteModal({
                title: 'Hostel / Room Contribution 🏠',
                content: 'Room rent / Wi-Fi bill me se mera hissa cash me nikal ke rakh diya.',
                tag: 'Hisaab',
                color: 'purple',
              })
            }
            className="px-2.5 py-1 text-[11px] font-medium text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
          >
            🏠 Room Expense
          </button>

          <button
            onClick={() =>
              openNewNoteModal({
                title: 'Shopping / Recharge Reminder 📱',
                content: 'Month end data pack renewal aur travel pass recharge karna hai.',
                tag: 'Reminders',
                color: 'emerald',
              })
            }
            className="px-2.5 py-1 text-[11px] font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
          >
            📱 Recharge Reminder
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes, hisaab, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Tags Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {availableTags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                selectedTag === t
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'All Notes' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <StickyNote className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Koi Notes Nahi Mile</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Aapne abhi tak koi note add nahi kiya hai ya search query se koi match nahi hua.
          </p>
          <button
            onClick={() => openNewNoteModal()}
            style={{ backgroundColor: themeConfig.primary }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Pehla Note Banayein</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const cStyle = colorStyles[note.color || 'emerald'];

            return (
              <div
                key={note.id}
                className={`p-5 rounded-2xl border ${cStyle.border} ${cStyle.bg} shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group`}
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {note.tag && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cStyle.badge}`}>
                          {note.tag}
                        </span>
                      )}

                      {note.amount !== undefined && (
                        <span className="text-[10px] font-extrabold font-mono text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200">
                          {formatRupee(note.amount)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePinNote(note.id)}
                        className={`p-1 rounded-md transition-colors ${
                          note.isPinned
                            ? 'text-amber-600 bg-amber-100/80'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title={note.isPinned ? 'Unpin note' : 'Pin to top'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openEditNoteModal(note)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
                        title="Edit note"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`font-bold text-sm tracking-tight ${cStyle.header}`}>
                    {note.title}
                  </h3>

                  {/* Content */}
                  <p className={`text-xs mt-2 whitespace-pre-wrap leading-relaxed ${cStyle.text}`}>
                    {note.content}
                  </p>
                </div>

                {/* Footer of card */}
                <div className="mt-4 pt-3 border-t border-slate-200/40 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{note.date}</span>
                  {note.isPinned && (
                    <span className="font-semibold text-amber-700 flex items-center gap-0.5">
                      <Pin className="w-2.5 h-2.5" />
                      <span>Pinned</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  {editingNote ? 'Note Edit Karein' : 'Naya Note / Hisaab Likhein'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Canteen chai dues ya College trip hisaab"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note Details / Memo
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Hisaab ya details yahan likhein..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tag / Category
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Hisaab">Hisaab</option>
                    <option value="Rules">Rules</option>
                    <option value="College">College</option>
                    <option value="Reminders">Reminders</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Rupaye (Optional Amount)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      value={amountStr}
                      onChange={(e) => setAmountStr(e.target.value)}
                      className="w-full pl-6 pr-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                  Card Color
                </label>
                <div className="flex items-center gap-2">
                  {(['emerald', 'amber', 'blue', 'rose', 'purple', 'slate'] as NoteColor[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        color === c ? 'scale-110 ring-2 ring-slate-400' : 'opacity-80'
                      }`}
                      style={{
                        backgroundColor:
                          c === 'emerald'
                            ? '#10B981'
                            : c === 'amber'
                            ? '#F59E0B'
                            : c === 'blue'
                            ? '#0EA5E9'
                            : c === 'rose'
                            ? '#F43F5E'
                            : c === 'purple'
                            ? '#A855F7'
                            : '#64748B',
                        borderColor: color === c ? '#0F172A' : 'transparent',
                      }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Pin Checkbox */}
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Upar Pin karke rakhein (Pin to top)</span>
              </label>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: themeConfig.primary }}
                  className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-95"
                >
                  {editingNote ? 'Save Note' : 'Note Add Karein'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
