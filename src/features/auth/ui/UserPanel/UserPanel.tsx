import { useAuth } from '@/features/auth/context/AuthContext';
import styles from './UserPanel.module.css';
import { useState, useRef, useEffect } from 'react';

export const UserPanel = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.userPanel} ref={menuRef}>
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
          <button className={styles.menuItem}>Личный кабинет</button>
          <button className={styles.menuItem} onClick={logout}>
            Выйти из аккаунта
            <span className={styles.logoutIcon}></span>
          </button>
        </div>
      )}
    </div>
  );
};
