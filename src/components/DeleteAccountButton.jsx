import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const guessApiBase = () => {
  const { origin } = window.location;
  // dev: 3000 → 8000 (192.168.x.x supported), prod: keep origin
  if (origin.includes(':3000')) return origin.replace(':3000', ':8000');
  return origin;
};

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  guessApiBase();

const normalized = (s) => (s || '').trim().toUpperCase();
const isConfirmed = (s) => {
  const t = normalized(s);
  return t === 'DELETE MY ACCOUNT' || t === 'DELETE ACCOUNT' || t === 'DELETE';
};

export default function DeleteAccountButton({ className = '', onDeleted }) {
  const { token, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);

  const reallyDelete = async () => {
    if (!token) return toast.error('Please log in again.');
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE_URL}/user/delete-account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.success(data?.message || 'Account deleted.');
        setOpen(false);
        onDeleted?.();
        setTimeout(() => logout(), 200); // safety logout
      } else if (res.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
      } else {
        const body = await res.text();
        toast.error(`Delete failed (${res.status}). ${body.slice(0, 140)}`);
      }
    } catch {
      toast.error('Network error while deleting account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        Delete Account
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Your Account</h3>
            <p className="text-sm text-gray-600 mb-3">
              This action <strong>cannot</strong> be undone. All your data (profile, downloads, history, activity) will be removed.
            </p>
            <p className="text-sm text-gray-600">
              Type <span className="px-1 py-0.5 bg-gray-100 rounded border font-mono">DELETE MY ACCOUNT</span> to confirm.
            </p>
            <input
              className="mt-3 w-full rounded border px-3 py-2 text-sm"
              placeholder="DELETE MY ACCOUNT"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={busy}
            />
            <div className="mt-1 text-xs text-gray-500">
              {isConfirmed(confirmText) ? '✓ Ready' : 'Type exactly "DELETE MY ACCOUNT" (or just "DELETE")'}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button className="px-4 py-2 rounded border text-gray-700" onClick={() => setOpen(false)} disabled={busy}>
                Keep My Account
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${busy ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}
                onClick={reallyDelete}
                disabled={busy || !isConfirmed(confirmText)}
              >
                {busy ? 'Deleting…' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


