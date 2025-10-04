// src/components/ConfirmDialog.jsx
import React from 'react';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-4 rounded-lg border bg-white hover:bg-gray-50"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="h-10 px-4 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? 'Working…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
