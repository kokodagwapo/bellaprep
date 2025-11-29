import React, { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  channel: 'email' | 'sms' | 'push' | 'in-app';
  recipient: string;
  status: 'sent' | 'pending' | 'failed';
  createdAt: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Document Uploaded', message: 'John Smith uploaded W-2 for loan #12345', type: 'success', channel: 'in-app', recipient: 'jane.doe@lender.com', status: 'sent', createdAt: '2 hours ago', read: false },
  { id: '2', title: 'Application Submitted', message: 'New loan application from Sarah Wilson', type: 'info', channel: 'email', recipient: 'team@lender.com', status: 'sent', createdAt: '3 hours ago', read: false },
  { id: '3', title: 'Rate Lock Expiring', message: 'Rate lock for loan #12340 expires in 24 hours', type: 'warning', channel: 'sms', recipient: '+1555123456', status: 'sent', createdAt: '5 hours ago', read: true },
  { id: '4', title: 'Verification Failed', message: 'Income verification failed for borrower Mike Johnson', type: 'error', channel: 'email', recipient: 'processor@lender.com', status: 'sent', createdAt: '1 day ago', read: true },
  { id: '5', title: 'Appointment Reminder', message: 'Consultation with Tom Brown tomorrow at 10 AM', type: 'info', channel: 'push', recipient: 'john.smith@lender.com', status: 'pending', createdAt: '1 day ago', read: true },
];

const NotificationsModule: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState({ type: '', channel: '', status: '' });
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newNotification, setNewNotification] = useState({ title: '', message: '', channel: 'email' as Notification['channel'], recipient: '' });

  const typeColors: Record<string, string> = { info: 'bg-blue-100 text-blue-700', success: 'bg-green-100 text-green-700', warning: 'bg-yellow-100 text-yellow-700', error: 'bg-red-100 text-red-700' };
  const channelIcons: Record<string, string> = { email: '📧', sms: '📱', push: '🔔', 'in-app': '💬' };
  const statusColors: Record<string, string> = { sent: 'text-green-600', pending: 'text-yellow-600', failed: 'text-red-600' };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const sendNotification = () => {
    const notification: Notification = {
      id: Date.now().toString(),
      ...newNotification,
      type: 'info',
      status: 'pending',
      createdAt: 'Just now',
      read: true,
    };
    setNotifications([notification, ...notifications]);
    setShowComposeModal(false);
    setNewNotification({ title: '', message: '', channel: 'email', recipient: '' });
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter.type && n.type !== filter.type) return false;
    if (filter.channel && n.channel !== filter.channel) return false;
    if (filter.status && n.status !== filter.status) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="mt-1 text-gray-500">Manage and send notifications across channels.</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">Mark all as read</button>
          )}
          <button onClick={() => setShowComposeModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Send Notification</button>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Sent</p>
          <p className="text-2xl font-semibold text-gray-900">{notifications.filter(n => n.status === 'sent').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-semibold text-yellow-600">{notifications.filter(n => n.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Unread</p>
          <p className="text-2xl font-semibold text-blue-600">{unreadCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Failed</p>
          <p className="text-2xl font-semibold text-red-600">{notifications.filter(n => n.status === 'failed').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">All Types</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <select value={filter.channel} onChange={(e) => setFilter({ ...filter, channel: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">All Channels</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="push">Push</option>
            <option value="in-app">In-App</option>
          </select>
          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">All Status</option>
            <option value="sent">Sent</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredNotifications.map(notification => (
            <div key={notification.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50/50' : ''}`} onClick={() => markAsRead(notification.id)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{channelIcons[notification.channel]}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>{notification.title}</h3>
                      {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{notification.recipient}</span>
                      <span>•</span>
                      <span>{notification.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${typeColors[notification.type]}`}>{notification.type}</span>
                  <span className={`text-xs ${statusColors[notification.status]}`}>{notification.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Notification</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                <select value={newNotification.channel} onChange={(e) => setNewNotification({ ...newNotification, channel: e.target.value as Notification['channel'] })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push Notification</option>
                  <option value="in-app">In-App</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                <input type="text" value={newNotification.recipient} onChange={(e) => setNewNotification({ ...newNotification, recipient: e.target.value })} placeholder={newNotification.channel === 'sms' ? 'Phone number' : 'Email address'} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={newNotification.title} onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea value={newNotification.message} onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowComposeModal(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancel</button>
                <button onClick={sendNotification} disabled={!newNotification.title || !newNotification.recipient} className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsModule;
