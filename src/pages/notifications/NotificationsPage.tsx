import React from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiTrendingUp, FiEdit3, FiFileText, FiShield, FiFolderPlus, FiInfo, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useNotificationsStore } from '../../store/notificationsStore';
import type { AdminNotification } from '../../types/notification.types';
import styles from './NotificationsPage.module.css';

const getIcon = (type: AdminNotification['type']) => {
  switch (type) {
    case 'comment': return <FiMessageSquare />;
    case 'traffic': return <FiTrendingUp />;
    case 'draft': return <FiEdit3 />;
    case 'document': return <FiFileText />;
    case 'legal': return <FiShield />;
    case 'category': return <FiFolderPlus />;
    default: return <FiInfo />;
  }
};

const NotificationsPage: React.FC = () => {
  const { notifications, markAllAsRead, markAsRead } = useNotificationsStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={styles.container}
    >
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Notifications</h1>
          <p className={styles.pageDescription}>
            View your complete notification history and alerts.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.outlineBtn} 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <FiCheck /> Mark all as read
          </button>
          <button className={styles.dangerBtn} onClick={() => alert("Notification history cleared.")}>
            <FiTrash2 /> Clear history
          </button>
        </div>
      </header>

      <div className={styles.card}>
        <div className={styles.list}>
          {notifications.length === 0 ? (
            <div className={styles.empty}>No notifications found.</div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`${styles.item} ${notif.isRead ? styles.read : styles.unread}`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className={styles.iconWrapper} data-type={notif.type}>
                  {getIcon(notif.type)}
                </div>
                <div className={styles.content}>
                  <div className={styles.itemHeader}>
                    <h4 className={styles.itemTitle}>{notif.title}</h4>
                    <span className={styles.time}>{notif.time}</span>
                  </div>
                  {notif.message && <p className={styles.itemMessage}>{notif.message}</p>}
                </div>
                {!notif.isRead && <div className={styles.unreadDot} />}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationsPage;
