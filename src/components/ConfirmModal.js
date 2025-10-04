import React, { useMemo, useState } from 'react';

/**
 * Reusable confirmation modal.
 * Supports both `emoji` and `icon` prop names, expected text guard, and color accents.
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  subtitle = null,
  descriptionLines = [],
  bullets = [],
  expectedText = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmClassName = '',
  accent = 'red', // 'red' | 'amber' | 'blue' | 'green' | 'indigo' | 'purple'
  icon,
  emoji,
}) {
  const [input, setInput] = useState('');
  const glyph = icon || emoji || '⚠️';

  const colors = useMemo(() => {
    const map = {
      red:    { ring: 'ring-red-500',    head: 'text-red-800',    chip: 'bg-red-100 text-red-800',    btn: 'bg-red-600 hover:bg-red-700' },
      amber:  { ring: 'ring-amber-500',  head: 'text-amber-800',  chip: 'bg-amber-100 text-amber-800',btn: 'bg-amber-600 hover:bg-amber-700' },
      blue:   { ring: 'ring-blue-500',   head: 'text-blue-800',   chip: 'bg-blue-100 text-blue-800',  btn: 'bg-blue-600 hover:bg-blue-700' },
      green:  { ring: 'ring-green-500',  head: 'text-green-800',  chip: 'bg-green-100 text-green-800',btn: 'bg-green-600 hover:bg-green-700' },
      indigo: { ring: 'ring-indigo-500', head: 'text-indigo-800', chip: 'bg-indigo-100 text-indigo-800', btn: 'bg-indigo-600 hover:bg-indigo-700' },
      purple: { ring: 'ring-purple-500', head: 'text-purple-800', chip: 'bg-purple-100 text-purple-800', btn: 'bg-purple-600 hover:bg-purple-700' },
    };
    return map[accent] || map.red;
  }, [accent]);

  if (!isOpen) return null;

  const canConfirm = expectedText ? input.trim().toUpperCase() === expectedText.trim().toUpperCase() : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* dialog */}
      <div className={`relative w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 ${colors.ring}`}>
        <div className="p-6">
          <div className="flex items-start">
            <div className={`mr-3 text-2xl select-none ${colors.head}`} aria-hidden>{glyph}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {subtitle && <div className="mt-1 text-sm text-gray-600">{subtitle}</div>}
            </div>
          </div>

          {descriptionLines?.length > 0 && (
            <div className="mt-4 space-y-1 text-sm text-gray-700">
              {descriptionLines.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}

          {bullets?.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-gray-700 list-disc pl-5">
              {bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}

          {expectedText && (
            <div className="mt-5">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Type <span className={`px-1 py-0.5 rounded ${colors.chip}`}>{expectedText}</span> to confirm
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={expectedText}
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm bg-white border hover:bg-gray-50"
          >
            {cancelLabel || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`px-4 py-2 rounded-lg text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed ${confirmClassName || colors.btn}`}
          >
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
