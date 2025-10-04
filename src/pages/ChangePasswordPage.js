import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.185:8000';

export default function ChangePasswordPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return toast.error('Fill all fields');
    if (newPassword !== confirm) return toast.error('New passwords do not match');

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/user/change_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const js = await res.json();
      if (!res.ok) throw new Error(js?.detail || 'Failed to change password');

      localStorage.removeItem('must_change_password');
      toast.success('Password updated! Please sign in again.');
      await logout();
      navigate('/login', { replace: true });
    } catch (e) {
      toast.error(e?.message || 'Could not change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Change Password</h1>
        <p className="text-sm text-gray-600 mb-4">
          For security, you must set a new password before continuing.
        </p>
        <form onSubmit={submit} className="bg-white rounded-xl shadow border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Current password</label>
            <input className="mt-1 w-full border rounded p-2"
              type="password" value={currentPassword}
              onChange={(e)=>setCurrentPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">New password</label>
            <input className="mt-1 w-full border rounded p-2"
              type="password" value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm new password</label>
            <input className="mt-1 w-full border rounded p-2"
              type="password" value={confirm}
              onChange={(e)=>setConfirm(e.target.value)} required />
          </div>
          <button
            className="w-full h-11 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save new password'}
          </button>
          <div className="text-center text-xs text-gray-500">
            <Link to="/login" className="text-blue-600">Back to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
