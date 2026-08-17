import { useState, useEffect, useCallback } from 'react';
import {
  Bell, CheckCheck, Trash2, Check, MessageSquare,
  Star, Package, ShoppingCart, HelpCircle, Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { notificationsApi } from '@/services/api';
import AdminLayout from '@/components/admin/AdminLayout';

const typeIcons = {
  review: Star,
  message: MessageSquare,
  product: Package,
  order: ShoppingCart,
  inquiry: HelpCircle,
  system: Info,
};

const typeColors = {
  review: 'text-amber-500 bg-amber-50 border-amber-200',
  message: 'text-blue-500 bg-blue-50 border-blue-200',
  product: 'text-emerald-500 bg-emerald-50 border-emerald-200',
  order: 'text-purple-500 bg-purple-50 border-purple-200',
  inquiry: 'text-pink-500 bg-pink-50 border-pink-200',
  system: 'text-neutral-500 bg-neutral-50 border-neutral-200',
};

const typeBadgeColors = {
  review: 'bg-amber-100 text-amber-700',
  message: 'bg-blue-100 text-blue-700',
  product: 'bg-emerald-100 text-emerald-700',
  order: 'bg-purple-100 text-purple-700',
  inquiry: 'bg-pink-100 text-pink-700',
  system: 'bg-neutral-100 text-neutral-700',
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      const res = await notificationsApi.getAll();
      const data = res.data.data;
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load notifications:', err.message);
      setError(err.message || 'Failed to load notifications');
      if (notifications.length === 0) {
        toast.error('Failed to load notifications');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await notificationsApi.delete(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter !== 'all') return n.type === filter;
    return true;
  });

  return (
    <AdminLayout title="Notifications">
      <div className="max-w-4xl space-y-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {['all', 'unread', 'review', 'message', 'product', 'order', 'inquiry', 'system'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {f === 'all' ? `All (${notifications.length})` : f === 'unread' ? `Unread (${unreadCount})` : f}
            </button>
          ))}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-neutral-400">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="card p-12 text-center">
            <Bell size={48} className="mx-auto mb-3 text-red-300" />
            <p className="text-red-500 font-medium">Failed to load notifications</p>
            <p className="text-neutral-400 text-sm mt-1 mb-4">{error}</p>
            <button
              onClick={() => { setLoading(true); fetchNotifications(); }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Bell size={48} className="mx-auto mb-3 text-neutral-300" />
            <p className="text-neutral-500 font-medium">No notifications</p>
            <p className="text-neutral-400 text-sm mt-1">
              {filter === 'all' ? "You're all caught up!" : `No ${filter} notifications`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((notification) => {
              const Icon = typeIcons[notification.type] || Bell;
              return (
                <div
                  key={notification._id}
                  className={`card p-4 flex items-start gap-4 transition-all ${
                    !notification.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/20' : ''
                  }`}
                >
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${typeColors[notification.type] || typeColors.system}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${!notification.isRead ? 'text-neutral-900' : 'text-neutral-700'}`}>
                        {notification.title}
                      </h3>
                      <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-full ${typeBadgeColors[notification.type] || typeBadgeColors.system}`}>
                        {notification.type}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-600">{notification.message}</p>
                    <p className="text-xs text-neutral-400 mt-1.5">{timeAgo(notification.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkRead(notification._id)}
                        title="Mark as read"
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
