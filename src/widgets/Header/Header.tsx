import { Link } from 'react-router-dom';
import { Logo } from '@/shared/ui/Logo/Logo';
import { SearchInput } from '@/shared/ui/SearchInput/SearchInput';
import { UserPanel } from '@/features/auth/ui/UserPanel/UserPanel';
import { GuestPanel } from '@/features/auth/ui/GuestPanel/GuestPanel';
import { useAuth } from '@/features/auth/context/AuthContext';
import styles from './Header.module.css';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from '@/services/store/store';
import { setSearchQuery } from '@/services/slices/catalogSlice';
import { SkillsDropdown } from '@/widgets/skillsDropdown/skillsDropdown';
import { getSkills } from '@/services/slices/skillsSlice';

export const Header = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
  const skillsButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    dispatch(getSkills());
  }, [dispatch]);

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const toggleSkillsDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSkillsDropdownOpen(prev => !prev);
  };

  const closeSkillsDropdown = () => {
    setIsSkillsDropdownOpen(false);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setCurrentTheme(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <header className={styles.header} data-auth={isAuthenticated ? 'true' : 'false'}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Link to="/" className={styles.logoLink}>
            <Logo />
          </Link>
          <nav className={styles.allSkills}>
            <Link to="/about" className={styles.linkAbout}>
              О проекте
            </Link>
            <button
              ref={skillsButtonRef}
              className={`${styles.linkSkills} ${isSkillsDropdownOpen ? styles.active : ''}`}
              onClick={toggleSkillsDropdown}
              aria-expanded={isSkillsDropdownOpen}
            >
              Все навыки
              <span className={styles.chevronIcon} />
            </button>
            {isSkillsDropdownOpen && (
              <SkillsDropdown isOpen={isSkillsDropdownOpen} onClose={closeSkillsDropdown} />
            )}
          </nav>
        </div>
        <SearchInput placeholder="Искать навык" onSearch={handleSearch} />
        <div className={styles.rightSection}>
          <button className={styles.themeToggle} onClick={toggleTheme}>
            <span
              className={`${styles.themeIcon} ${
                currentTheme === 'dark' ? styles.sunIcon : styles.moonIcon
              }`}
            />
          </button>
          {isAuthenticated ? <UserPanel /> : <GuestPanel />}
        </div>
      </div>
    </header>
  );
};
