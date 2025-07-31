import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { CatalogUI, CatalogUIProps } from './ui/catalogUI';
import { useSelector } from '@/app/providers/store/store';
import { selectCatalogItems } from '@/services/selectors/catalogSelectors';
import { User } from '@/entities/user/model/types';
import { UserSection } from '../userSection/userSection';
import styles from './catalog.module.css';
import { selectLikedItems } from '@/services/selectors/likeSelectors';

type CategorySection = {
  title: string;
  users: User[]; // Заменили Profile на User
  showAllButton?: boolean;
  onShowAll?: () => void;
};

export type ProfileCategory = 'popular' | 'new' | 'ideas' | 'recommended' | 'match';

const Catalog: React.FC<{ isAuthenticated: boolean; isFiltered: boolean }> = ({
  isAuthenticated,
  isFiltered,
}) => {
  const [viewMode, setViewMode] = useState<'default' | 'category'>('default');
  const [currentCategory, setCurrentCategory] = useState<ProfileCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const allUsers = useSelector(selectCatalogItems) as User[];
  const likedItems = useSelector(selectLikedItems);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);

  // Категоризация пользователей
  const categorizedUsers = useMemo(() => {
    return {
      // Для "Точное соответствие" (заглушка)
      match: [] as User[],

      // "Популярное" - пользователи с лайками
      popular: allUsers.filter(user => likedItems[user._id]),

      // "Новое" - 9 самых новых по дате создания
      new: [...allUsers]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 9),

      // "Новые идеи" - аналогично "Новое"
      ideas: [...allUsers]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 9),

      // "Рекомендуем" - все пользователи
      recommended: allUsers,
    };
  }, [allUsers, likedItems]);

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
  const handleShowAll = (category: ProfileCategory) => {
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
        users: categorizedUsers[firstCategoryType].slice(0, 3),
        showAllButton: true,
        onShowAll: () => handleShowAll(firstCategoryType),
      },
      {
        title: getCategoryTitle(secondCategoryType),
        users: categorizedUsers[secondCategoryType].slice(0, 3),
        showAllButton: true,
        onShowAll: () => handleShowAll(secondCategoryType),
      },
      {
        title: 'Рекомендуем',
        users: displayedUsers,
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

  // Режим просмотра категории
  if (viewMode === 'category' && currentCategory) {
    return (
      <div className={styles.catalog}>
        <button onClick={handleBack} className={styles.backButton}>
          ← Назад к категориям
        </button>
        <UserSection
          title={getCategoryTitle(currentCategory)}
          users={categorizedUsers[currentCategory] || []}
          isFiltered={isFiltered}
        />
      </div>
    );
  }

  // Основной режим
  return <CatalogUI {...getUIProps()} />;
};

export default Catalog;
