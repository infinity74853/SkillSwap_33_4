import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { CatalogUI } from './ui/catalogUI';
import { useSelector } from '@/app/providers/store/store';
import { selectCatalogItems } from '@/services/selectors/catalogSelectors';
import { User } from '@/entities/user/model/types';
import { UserSection } from '../userSection/userSection';
import styles from './catalog.module.css';
import { selectLikedItems } from '@/services/selectors/likeSelectors';

type CategorySection = {
  title: string;
  users: User[];
  showAllButton?: boolean;
  onShowAll?: () => void;
};

export type ProfileCategory = 'popular' | 'new' | 'ideas' | 'recommended' | 'match';

const Catalog: React.FC<{ isAuthenticated: boolean; isFiltered: boolean }> = ({
  isAuthenticated,
  isFiltered,
}) => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [currentCategory, setCurrentCategory] = useState<ProfileCategory | null>(null);

  const allUsers = useSelector(selectCatalogItems) as User[];
  const likedItems = useSelector(selectLikedItems);

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

  // Получаем текущий набор пользователей для отображения
  const getCurrentUsers = () => {
    if (isFiltered) {
      return allUsers; // В режиме фильтра используем весь селектор
    }
    return currentCategory ? categorizedUsers[currentCategory] : displayedUsers;
  };

  // Заголовок для текущего режима
  const getCurrentTitle = () => {
    if (isFiltered) return 'Подходящие предложения';
    if (currentCategory) return getCategoryTitle(currentCategory);
    return 'Рекомендуем';
  };

  // Количество карточек для загрузки
  const getItemsPerLoad = () => {
    const width = window.innerWidth;
    const columns = width < 768 ? 1 : width < 1024 ? 2 : 3;
    return Math.ceil(20 / columns) * columns;
  };

  // Инициализация "Рекомендуем" (все пользователи)
  useEffect(() => {
    if (!isFiltered && !currentCategory) {
      const initialItems = categorizedUsers.recommended.slice(0, getItemsPerLoad());
      setDisplayedUsers(initialItems);
      setHasMore(initialItems.length < categorizedUsers.recommended.length);
    }
  }, [isFiltered, currentCategory, categorizedUsers.recommended]);

  // Подгрузка "Рекомендуем"
  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      const nextItems = categorizedUsers.recommended.slice(
        displayedUsers.length,
        displayedUsers.length + getItemsPerLoad(),
      );

      setDisplayedUsers(prev => [...prev, ...nextItems]);
      setHasMore(displayedUsers.length + nextItems.length < categorizedUsers.recommended.length);
      setLoading(false);
    }, 500);
  }, [loading, hasMore, displayedUsers.length, categorizedUsers.recommended]);

  // Заголовки категорий
  const getCategoryTitle = (category: string): string => {
    const titles: Record<string, string> = {
      match: 'Точное соответствие',
      popular: 'Популярное',
      new: 'Новое',
      ideas: 'Новые Идеи',
      recommended: 'Рекомендуем',
    };
    return titles[category];
  };

  // Обработчики навигации (оставляем без изменений)
  const handleShowAll = (category: ProfileCategory) => {
    setCurrentCategory(category);
  };

  const handleBack = () => {
    setCurrentCategory(null);
  };

  // Подготовка данных для UI в обычном режиме
  const getDefaultUIProps = () => {
    const firstCategoryType = isAuthenticated ? 'match' : 'popular';
    const secondCategoryType = isAuthenticated ? 'ideas' : 'new';

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
      onLoadMoreRecommended: handleLoadMore,
      hasMoreRecommended: hasMore,
      isLoadingRecommended: loading,
    };
  };

  // Режим просмотра секции
  if (isFiltered || currentCategory) {
    return (
      <div className={styles.catalog}>
        {!isFiltered && (
          <button onClick={handleBack} className={styles.backButton}>
            ← Назад к категориям
          </button>
        )}
        <UserSection
          title={getCurrentTitle()}
          users={getCurrentUsers()}
          isFiltered={isFiltered || !!currentCategory}
          count={getCurrentUsers().length}
        />
      </div>
    );
  }

  // Основной режим
  return <CatalogUI {...getDefaultUIProps()} />;
};

export default Catalog;
