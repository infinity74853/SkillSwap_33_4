import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CatalogUI } from './ui/catalogUI';
import { useSelector } from '@/services/store/store';
import { selectCatalogItems, selectCatalogLoading } from '@/services/selectors/catalogSelectors';
import { User } from '@/entities/user/model/types';
import { UserSection } from '../userSection/userSection';
import styles from './catalog.module.css';
import { selectLikedItems } from '@/services/selectors/likeSelectors';
import useFilteredUsers from '@/shared/hooks/useFilterCatalog';

type CategorySection = {
  title: string;
  users: User[];
  showAllButton?: boolean;
  onShowAll?: () => void;
};

export type ProfileCategory = 'popular' | 'new' | 'ideas' | 'recommended' | 'match';

const Catalog: React.FC<{ isAuthenticated: boolean; isFiltered: boolean }> = ({
  isAuthenticated,
  isFiltered: initialIsFiltered,
}) => {
  const [currentCategory, setCurrentCategory] = useState<ProfileCategory | null>(null);
  const allUsers = useSelector(selectCatalogItems) as User[];
  const likedItems = useSelector(selectLikedItems);
  const filteredUsers = useFilteredUsers();
  //const [loading, setLoading] = useState(false);
  const loading = useSelector(selectCatalogLoading);
  const [hasMore, setHasMore] = useState(true);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);

  // Автоматически определяем есть ли активная фильтрация
  const isActuallyFiltered = useMemo(() => {
    // Если есть разница между всеми и отфильтрованными пользователями
    return filteredUsers.length !== allUsers.length;
  }, [filteredUsers.length, allUsers.length]);

  // Определяем режим отображения
  const displayMode = useMemo(() => {
    if (currentCategory) return 'category';
    if (initialIsFiltered) return 'forced-filter';
    if (isActuallyFiltered) return 'auto-filter';
    return 'default';
  }, [currentCategory, initialIsFiltered, isActuallyFiltered]);

  // Категоризация пользователей
  // const categorizedUsers = useMemo(() => {
  //   return {
  //     // Для "Точное соответствие" (заглушка)
  //     match: [] as User[],

  //     // "Популярное" - пользователи с лайками
  //     popular: allUsers.filter(user => likedItems[user._id]),

  //     // "Новое" - 9 самых новых по дате создания
  //     new: [...allUsers]
  //       .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  //       .slice(0, 9),

  //     // "Новые идеи" - аналогично "Новое"
  //     ideas: [...allUsers]
  //       .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  //       .slice(0, 9),

  //     // "Рекомендуем" - все пользователи
  //     recommended: allUsers,
  //   };
  // }, [allUsers, likedItems]);

  // Категоризация пользователей
  const categorizedUsers = useMemo(() => {
    const usersToCategorize = displayMode === 'default' ? allUsers : filteredUsers;

    return {
      match: [] as User[],
      popular: usersToCategorize.filter(user => likedItems[user._id]),
      new: [...usersToCategorize]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 9),
      ideas: [...usersToCategorize]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 9),
      recommended: usersToCategorize,
    };
  }, [allUsers, likedItems, displayMode, filteredUsers]);

  // Получаем текущий набор пользователей для отображения
  // const getCurrentUsers = () => {
  //   if (isFiltered) {
  //     return allUsers; // В режиме фильтра используем весь селектор
  //   }
  //   return currentCategory ? categorizedUsers[currentCategory] : displayedUsers;
  // };

  // Получаем текущий набор пользователей для отображения
  const getCurrentUsers = () => {
    switch (displayMode) {
      case 'forced-filter':
      case 'auto-filter':
        return filteredUsers;
      case 'category':
        return categorizedUsers[currentCategory!];
      default:
        return displayedUsers;
    }
  };

  // Количество карточек для загрузки
  const getItemsPerLoad = () => {
    const width = window.innerWidth;
    const columns = width < 768 ? 1 : width < 1024 ? 2 : 3;
    return Math.ceil(20 / columns) * columns;
  };

  // Инициализация "Рекомендуем" (все пользователи)
  useEffect(() => {
    if (displayMode === 'default' && !currentCategory) {
      const initialItems = categorizedUsers.recommended.slice(0, getItemsPerLoad());
      setDisplayedUsers(initialItems);
      setHasMore(initialItems.length < categorizedUsers.recommended.length);
    }
  }, [displayMode, currentCategory, categorizedUsers.recommended]);

  // Подгрузка "Рекомендуем"
  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;

    //setLoading(true);
    setTimeout(() => {
      const nextItems = categorizedUsers.recommended.slice(
        displayedUsers.length,
        displayedUsers.length + getItemsPerLoad(),
      );

      setDisplayedUsers(prev => [...prev, ...nextItems]);
      setHasMore(displayedUsers.length + nextItems.length < categorizedUsers.recommended.length);
      //setLoading(false);
    }, 500);
  }, [loading, hasMore, displayedUsers.length, categorizedUsers.recommended]);

  // Заголовок для текущего режима
  const getCurrentTitle = () => {
    switch (displayMode) {
      case 'forced-filter':
      case 'auto-filter':
        return 'Подходящие предложения';
      case 'category':
        return getCategoryTitle(currentCategory!);
      default:
        return 'Рекомендуем';
    }
  };

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
  if (displayMode !== 'default') {
    return (
      <div className={styles.catalog}>
        {displayMode === 'category' && (
          <button onClick={handleBack} className={styles.backButton}>
            ← Назад к категориям
          </button>
        )}
        <UserSection
          title={getCurrentTitle()}
          users={getCurrentUsers()}
          isFiltered={displayMode !== 'category'}
          count={getCurrentUsers().length}
          showAllButton={false}
        />
      </div>
    );
  }

  // Основной режим
  return <CatalogUI {...getDefaultUIProps()} />;
};

export default Catalog;
