const ApiResponse = require('../utils/apiResponse');
const { mockStore } = require('../models/store');

const getNotifications = async (req, res, next) => {
  try {
    const userNotifications = mockStore.notifications.filter(n => n.user_id === req.user.id);
    userNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const unreadCount = userNotifications.filter(n => n.is_read === 0).length;

    return ApiResponse.success(res, 'Notifications retrieved.', {
      notifications: userNotifications,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = mockStore.notifications.find(n => n.id === parseInt(id, 10) && n.user_id === req.user.id);

    if (!notification) return ApiResponse.error(res, 'Notification not found.', 404);

    notification.is_read = 1;
    return ApiResponse.success(res, 'Notification marked as read.', notification);
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    mockStore.notifications.forEach(n => {
      if (n.user_id === req.user.id) n.is_read = 1;
    });

    return ApiResponse.success(res, 'All notifications marked as read.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
