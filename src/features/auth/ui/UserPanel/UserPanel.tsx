import { useAuth } from '@/features/auth/context/AuthContext';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import styles from './UserPanel.module.css';
import { useState, useRef } from 'react';

export const UserPanel = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useClickOutside(panelRef, closeMenu);

  return (
    <div className={styles.userPanel} ref={panelRef}>
      <div className={styles.iconsContainer}>
        <div className={styles.iconWrapper}>
          <span className={styles.notificationIcon}></span>
          <span className={styles.notificationBadge}></span>
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
    </div>
  );
};
