import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Bell,
  Shield,
  LogOut,
  Trash2,
  Check,
} from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { useAuth } from '@/context/AuthContext';

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [notifications, setNotifications] = useState({
    lowStock: true,
    newSales: true,
    weeklyReport: true,
    productUpdates: false,
  });

  const handleProfile = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('biz_manager_db');
    localStorage.removeItem('biz_manager_session');
    signOut();
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account and preferences.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <div className="mb-5 flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900">
            Profile Information
          </h2>
        </div>

        <form onSubmit={handleProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white shadow-sm">
              {name.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-medium text-slate-900">{name}</p>
              <p className="text-sm text-slate-500">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit">Save Changes</Button>

            {saved && (
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 animate-fade-in">
                <Check className="h-4 w-4" />
                Saved successfully
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="mb-5 flex items-center gap-2">
          <Bell className="h-5 w-5 text-slate-400" />

          <h2 className="text-base font-semibold text-slate-900">
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-1">
          {[
            {
              key: 'lowStock',
              label: 'Low stock alerts',
              desc: 'Get notified when products are running low',
            },
            {
              key: 'newSales',
              label: 'New sale notifications',
              desc: 'Receive a notification for every new sale',
            },
            {
              key: 'weeklyReport',
              label: 'Weekly summary report',
              desc: 'A weekly digest of your business performance',
            },
            {
              key: 'productUpdates',
              label: 'Product updates',
              desc: 'News about new features and improvements',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {item.label}
                </p>

                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>

              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key],
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifications[item.key]
                    ? 'bg-blue-600'
                    : 'bg-slate-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    notifications[item.key]
                      ? 'translate-x-5.5'
                      : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="mb-5 flex items-center gap-2">
          <Shield className="h-5 w-5 text-slate-400" />

          <h2 className="text-base font-semibold text-slate-900">
            Security
          </h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Change Password
              </p>
              <p className="text-xs text-slate-500">
                Update your account password
              </p>
            </div>

            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-slate-500">
                Add an extra layer of security
              </p>
            </div>

            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="border-red-200">
        <div className="mb-5 flex items-center gap-2">
          <LogOut className="h-5 w-5 text-red-500" />

          <h2 className="text-base font-semibold text-slate-900">
            Account Actions
          </h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Sign out
              </p>

              <p className="text-xs text-slate-500">
                Sign out of your current session
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/60 p-4">
            <div>
              <p className="text-sm font-medium text-red-900">
                Delete all data
              </p>

              <p className="text-xs text-red-600">
                Permanently delete your account and all business data
              </p>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete All Data"
        size="sm"
      >
        <p className="text-sm text-slate-600">
          This will permanently delete your account, products, customers,
          and sales data. This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleDeleteAccount}
          >
            Delete everything
          </Button>
        </div>
      </Modal>
    </div>
  );
}
