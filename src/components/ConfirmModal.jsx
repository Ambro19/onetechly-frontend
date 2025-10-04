// frontend/src/components/ConfirmModal.jsx
// why: shared confirmation modal with *real* disabled attribute for tests & a11y

import React, { useEffect, useState } from 'react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  bullets = [],
  expectedText = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  accent = 'red',          // 'red' | 'amber' | 'blue' etc.
  caseSensitive = true,    // why: enforce exact-typed confirmation by default
}) {
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setInput('');
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalize = (s) => (caseSensitive ? s : s.toUpperCase());
  const mustMatch = expectedText && expectedText.trim().length > 0;
  const isValid = !mustMatch || normalize(input.trim()) === normalize(expectedText.trim());

  const accentBg =
    accent === 'amber'
      ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
      : accent === 'blue'
      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500';

  const handleConfirm = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      await onConfirm?.();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return; // why: avoid closing mid-action
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            {expectedText && (
              <p className="text-sm text-gray-600">
                Type <span className="font-bold">{expectedText}</span> to confirm.
              </p>
            )}
          </div>

          {bullets.length > 0 && (
            <div className={`${accent === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 mb-6`}>
              <h4 className="font-semibold text-gray-800 mb-2">What happens next:</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                {bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {expectedText ? `Type ${expectedText} to confirm:` : 'Confirm action:'}
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type the confirmation text here"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50"
              disabled={submitting}
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={!isValid || submitting} // <-- critical for tests & a11y
            className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${accentBg}`}
          >
            {submitting ? 'Processing…' : confirmLabel}
          </button>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
