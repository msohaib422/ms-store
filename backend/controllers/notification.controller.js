const Notification = require('../models/Notification');
const { sendNotificationEmail } = require('../utils/email');
const { success, error } = require('../utils/response');

const getNotifications = async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    const filter = {};
    if (unreadOnly === 'true') filter.isRead = false;

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ isRead: false });

    return success(res, { notifications, unreadCount });
  } catch (err) {
    console.error('getNotifications error:', err.message);
    return error(res, 'Failed to fetch notifications', 500);
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({ isRead: false });
    return success(res, { unreadCount });
  } catch (err) {
    console.error('getUnreadCount error:', err.message);
    return error(res, 'Failed to fetch unread count', 500);
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) return error(res, 'Notification not found', 404);
    return success(res, { notification }, 'Marked as read');
  } catch (err) {
    console.error('markAsRead error:', err.message);
    return error(res, 'Failed to mark notification as read', 500);
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    return success(res, null, 'All notifications marked as read');
  } catch (err) {
    console.error('markAllAsRead error:', err.message);
    return error(res, 'Failed to mark all as read', 500);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return error(res, 'Notification not found', 404);
    return success(res, null, 'Notification deleted');
  } catch (err) {
    console.error('deleteNotification error:', err.message);
    return error(res, 'Failed to delete notification', 500);
  }
};

const createNotification = async ({ type, title, message, link = '', meta = {} }) => {
  try {
    const notification = await Notification.create({ type, title, message, link, meta });

    sendNotificationEmail({ type, title, message, link, meta }).catch(err =>
      console.error('Notification email failed:', err.message)
    );

    return notification;
  } catch (err) {
    console.error('Create notification failed:', err.message);
    return null;
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
};
