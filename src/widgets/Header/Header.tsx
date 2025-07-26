import { Link } from 'react-router-dom';
import { Logo } from '@/shared/ui/Logo/Logo';
import { SearchInput } from '@/shared/ui/SearchInput/SearchInput';
import { MoonIcon } from '@/shared/ui/MoonIcon/MoonIcon';
import { SunIcon } from '@/shared/ui/SunIcon/SunIcon';
import { UserPanel } from '@/features/auth/UserPanel/UserPanel';
import styles from './Header.module.css';
import React, { useState, useEffect } from 'react';

export const Header = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  // Загружаем сохранённую тему при открытии страницы
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
            <Link to="/about" className={styles.link}>
              О проекте
            </Link>
            <Link to="/all_skills" className={styles.link}>
              Все навыки
              <svg
                width="40"
                height="8"
                viewBox="0 0 16 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 7.93539C7.35391 7.93539 6.70782 7.68618 6.21863 7.197L0.20075 1.17912C-0.0669166 0.91145 -0.0669166 0.468416 0.20075 0.20075C0.468416 -0.0669166 0.911451 -0.0669166 1.17912 0.20075L7.197 6.21863C7.64003 6.66167 8.35997 6.66167 8.803 6.21863L14.8209 0.20075C15.0885 -0.0669166 15.5316 -0.0669166 15.7992 0.20075C16.0669 0.468416 16.0669 0.91145 15.7992 1.17912L9.78137 7.197C9.29218 7.68618 8.64609 7.93539 8 7.93539Z"
                  fill="#253017"
                />
              </svg>
            </Link>
          </nav>
        </div>
        <SearchInput placeholder="Искать навык" />
        <div className={styles.rightSection}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Переключить на ${currentTheme === 'light' ? 'тёмную' : 'светлую'} тему`}
            aria-pressed={currentTheme === 'dark'}
          >
            {currentTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
        <UserPanel />
      </div>
    </header>
  );
};
