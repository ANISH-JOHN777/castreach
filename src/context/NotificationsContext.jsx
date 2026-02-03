import { createContext, useContext, useState, useEffect } from 'react';
import { mockNotifications } from '../mock-data/data';

const NotificationsContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationsProvider');
    }
    return context;
};

export const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Calculate unread count
        const count = notifications.filter(n => !n.read).length;
        setUnreadCount(count);
    }, [notifications]);

    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        );
    };

    const deleteNotification = (notificationId) => {
        setNotifications(prev =>
            prev.filter(n => n.id !== notificationId)
        );
    };

    const addNotification = (notification) => {
        const newNotification = {
            id: Date.now(),
            timestamp: new Date(),
            read: false,
            ...notification
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    return (
        <NotificationsContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            addNotification
        }}>
            {children}
        </NotificationsContext.Provider>
    );
};
