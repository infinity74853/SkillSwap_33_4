import { Link } from 'react-router-dom';
import { Logo } from '@/shared/ui/Logo/Logo';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Секция 1: Лого и копирайт */}
        <div className={styles.logoSection}>
          <Logo />
          <p className={styles.copyright}>SkillSwap — {new Date().getFullYear()}</p>
        </div>

        {/* Секция 2: Навигация с точками */}
        <div className={styles.section}>
          <ul className={`${styles.linksList} ${styles.withBullets}`}>
            <li>
              <Link to="/about">О проекте</Link>
            </li>
            <li>
              <Link to="/all_skills">Все навыки</Link>
            </li>
          </ul>
        </div>

        {/* Секция 3: Контакты */}
        <div className={styles.section}>
          <ul className={styles.linksList}>
            <li>
              <Link to="/contacts">Контакты</Link>
            </li>
            <li>
              <Link to="/blog">Блог</Link>
            </li>
          </ul>
        </div>

        {/* Секция 4: Политика */}
        <div className={styles.section}>
          <ul className={styles.linksList}>
            <li>
              <Link to="/privacy">Политика конфиденциальности</Link>
            </li>
            <li>
              <Link to="/terms">Пользовательское соглашение</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
