import React from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiTrendingUp, FiEdit3, FiFileText, FiShield, FiFolderPlus, FiInfo, FiCheck } from 'react-icons/fi';
import { useNotificationsStore } from '../../../store/notificationsStore';
import { AdminNotification } from '../../../types/notification.types';
import styles from './NotificationPanel.module.css';

interface NotificationPanelProps {
  onClose: () => void;
}

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

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications, markAllAsRead, markAsRead } = useNotificationsStore();

  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.18 }}
    >
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Notifications</h3>
          <p className={styles.subtitle}>Latest activity from your blog dashboard</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={markAllAsRead}>
            <FiCheck /> Mark all as read
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>No notifications yet.</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`${styles.item} ${notif.isRead ? styles.read : styles.unread}`}
              onClick={() => {
                markAsRead(notif.id);
                // In a real app we might navigate here, so we could call onClose()
              }}
            >
              <div className={styles.iconWrapper} data-type={notif.type}>
                {getIcon(notif.type)}
              </div>
              <div className={styles.content}>
                <h4 className={styles.itemTitle}>{notif.title}</h4>
                {notif.message && <p className={styles.itemMessage}>{notif.message}</p>}
                <span className={styles.time}>{notif.time}</span>
              </div>
              {!notif.isRead && <div className={styles.unreadDot} />}
            </div>
          ))
        )}
      </div>

      <div className={styles.footer}>
        <button className={styles.viewAllBtn}>View notification history</button>
      </div>
    </motion.div>
  );
};

export default NotificationPanel;
