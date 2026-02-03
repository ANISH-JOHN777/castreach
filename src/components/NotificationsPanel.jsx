import { useState } from 'react';
import { useNotifications } from '../context/NotificationsContext';
import { Bell, X, CheckCircle, MessageCircle, Star, Calendar, DollarSign, Check } from 'lucide-react';
import './NotificationsPanel.css';

const NotificationsPanel = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const getIcon = (iconName) => {
        const icons = {
            CheckCircle,
            MessageCircle,
            Star,
            Calendar,
            DollarSign
        };
        const IconComponent = icons[iconName] || Bell;
        return IconComponent;
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
        }
    };

    return (
        <div className="notifications-container">
            <button
                className="notifications-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="notifications-badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="notifications-overlay" onClick={() => setIsOpen(false)} />
                    <div className="notifications-panel">
                        <div className="notifications-header">
                            <div>
                                <h3>Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="unread-count">{unreadCount} unread</span>
                                )}
                            </div>
                            <div className="notifications-actions">
                                {unreadCount > 0 && (
                                    <button
                                        className="mark-all-read"
                                        onClick={markAllAsRead}
                                        title="Mark all as read"
                                    >
                                        <Check size={16} />
                                    </button>
                                )}
                                <button
                                    className="close-panel"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="notifications-list">
                            {notifications.length === 0 ? (
                                <div className="notifications-empty">
                                    <Bell size={48} />
                                    <p>No notifications yet</p>
                                    <span>We'll notify you when something arrives</span>
                                </div>
                            ) : (
                                notifications.map(notification => {
                                    const IconComponent = getIcon(notification.icon);
                                    return (
                                        <div
                                            key={notification.id}
                                            className={`notification-item ${!notification.read ? 'unread' : ''} ${notification.color}`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="notification-icon">
                                                <IconComponent size={20} />
                                            </div>
                                            <div className="notification-content">
                                                <div className="notification-title">{notification.title}</div>
                                                <div className="notification-message">{notification.message}</div>
                                                <div className="notification-time">{formatTime(notification.timestamp)}</div>
                                            </div>
                                            <button
                                                className="notification-delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification.id);
                                                }}
                                                aria-label="Delete notification"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationsPanel;
