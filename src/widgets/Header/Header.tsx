import { Link } from 'react-router-dom';
import { Logo } from '@/shared/ui/Logo/Logo';
import { SearchInput } from '@/shared/ui/SearchInput/SearchInput';
import { UserPanel } from '@/features/auth/UserPanel/UserPanel';
import styles from './Header.module.css';
import { useState, useEffect } from 'react';

export const Header = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setCurrentTheme(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Link to="/" className={styles.logoLink}>
            <Logo />
          </Link>
          <nav className={styles.allSkills}>
            <Link to="/about" className={styles.linkAbout}>
              О проекте
            </Link>
            <Link to="/all_skills" className={styles.linkSkills}>
              Все навыки
            </Link>
            <div className={styles.chevronIcon}> </div>
          </nav>
        </div>
        <SearchInput placeholder="Искать навык" />
        <div className={styles.rightSection}>
          <button className={styles.themeToggle} onClick={toggleTheme}>
            <span
              className={`${styles.themeIcon} ${
                currentTheme === 'dark' ? styles.sunIcon : styles.moonIcon
              }`}
            />
          </button>
          <UserPanel />
        </div>
      </div>
    </header>
  );
};
