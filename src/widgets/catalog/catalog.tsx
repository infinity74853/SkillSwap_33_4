import React, { useState, useCallback, useEffect } from 'react';
import { CatalogUI, CatalogUIProps } from './ui/catalogUI';
import { useSelector } from '@/app/providers/store/store';
import { selectCatalogItems } from '@/services/selectors/catalogSelectors';
import { User } from '@/entities/user/model/types';
import { UserSection } from '../userSection/userSection';
import styles from './catalog.module.css';

type CategorySection = {
  title: string;
  profiles: User[]; // Заменили Profile на User
  showAllButton?: boolean;
  onShowAll?: () => void;
};

const Catalog: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const [viewMode, setViewMode] = useState<'default' | 'category'>('default');
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const allUsers = useSelector(selectCatalogItems) as User[];
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);

  // Количество карточек для загрузки
  const getItemsPerLoad = () => {
    const width = window.innerWidth;
    const columns = width < 768 ? 1 : width < 1024 ? 2 : 3;
    return Math.ceil(20 / columns) * columns;
  };

  // Инициализация "Рекомендуем" (все пользователи)
  useEffect(() => {
    const initialItems = allUsers.slice(0, getItemsPerLoad());
    setDisplayedUsers(initialItems);
    setHasMore(initialItems.length < allUsers.length);
  }, [allUsers]);

  // Подгрузка "Рекомендуем"
  const handleLoadMoreRecommended = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      const nextItems = allUsers.slice(
        displayedUsers.length,
        displayedUsers.length + getItemsPerLoad(),
      );

      if (nextItems.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedUsers(prev => [...prev, ...nextItems]);
        setHasMore(displayedUsers.length + nextItems.length < allUsers.length);
      }
      setLoading(false);
    }, 1000);
  }, [displayedUsers.length, loading, hasMore, allUsers]);

  // Заголовки категорий
  const getCategoryTitle = (category: string): string => {
    const titles: Record<string, string> = {
      match: 'Точное соответствие',
      popular: 'Популярное',
      new: 'Новое',
      ideas: 'Новые Идеи',
      recommended: 'Рекомендуем',
    };
    return titles[category] || category;
  };

  // Обработчики навигации (оставляем без изменений)
  const handleShowAll = (category: string) => {
    setViewMode('category');
    setCurrentCategory(category);
  };

  const handleBack = () => {
    setViewMode('default');
    setCurrentCategory(null);
  };

  // Подготовка данных для UI
  const getUIProps = (): Omit<CatalogUIProps, 'sections'> & { sections: CategorySection[] } => {
    if (viewMode === 'category') {
      throw new Error('UI props not available in category mode');
    }

    const firstCategoryType = isAuthenticated ? 'match' : 'popular';
    const secondCategoryType = isAuthenticated ? 'ideas' : 'new';

    // Временное решение: для первых двух категорий берем пустые массивы
    const sections: CategorySection[] = [
      {
        title: getCategoryTitle(firstCategoryType),
        profiles: [], // Пока пусто - будет заполняться при реализации алгоритма
        showAllButton: true,
        onShowAll: () => handleShowAll(firstCategoryType),
      },
      {
        title: getCategoryTitle(secondCategoryType),
        profiles: [], // Пока пусто
        showAllButton: true,
        onShowAll: () => handleShowAll(secondCategoryType),
      },
      {
        title: 'Рекомендуем',
        profiles: displayedUsers,
        showAllButton: false,
      },
    ];

    return {
      sections,
      onLoadMoreRecommended: handleLoadMoreRecommended,
      hasMoreRecommended: hasMore,
      isLoadingRecommended: loading,
    };
  };

  // Режим просмотра категории (временно показываем всех пользователей)
  if (viewMode === 'category' && currentCategory) {
    return (
      <div className={styles.catalog}>
        <button onClick={handleBack} className={styles.backButton}>
          ← Назад к категориям
        </button>
        <UserSection
          title={getCategoryTitle(currentCategory)}
          users={allUsers} // Временно показываем всех
        />
      </div>
    );
  }

  // Основной режим
  return <CatalogUI {...getUIProps()} />;
};

export default Catalog;
