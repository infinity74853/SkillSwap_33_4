import { useAuth } from '@/features/auth/context/AuthContext';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { useState, useRef, useEffect } from 'react';
import { NotificationMenu } from '../NotificationMenu/NotificationMenu';
import styles from './UserPanel.module.css';

export const UserPanel = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);
  const closeAll = () => {
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
  };

  useClickOutside(panelRef, closeAll);

  useEffect(() => {
    if (isNotificationsOpen || isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isNotificationsOpen, isMenuOpen]);

  return (
    <div className={styles.userPanel} ref={panelRef}>
      <div className={styles.iconsContainer}>
        <div className={styles.iconWrapper} onClick={toggleNotifications}>
          <span className={styles.notificationIcon}></span>
          <span className={styles.notificationBadge}>4</span>
        </div>
        <div className={styles.iconWrapper}>
          <span className={styles.likeIcon}></span>
        </div>
        <div className={styles.userInfo} onClick={toggleMenu}>
          <span className={styles.userName}>{user?.name}</span>
          <div className={styles.avatar}>
            {user?.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className={styles.modalMenu}>
          <button className={styles.menuItemLk}>Личный кабинет</button>
          <button className={styles.menuItemOut} onClick={logout}>
            Выйти из аккаунта
            <span className={styles.logoutIcon}></span>
          </button>
        </div>
      )}

      <NotificationMenu isOpen={isNotificationsOpen} />
    </div>
  );
};
