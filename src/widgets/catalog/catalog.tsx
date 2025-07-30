import React, { useState, useCallback } from 'react';
import { CatalogUI, CatalogUIProps } from './ui/catalogUI';
import { Profile, ProfileCategory } from '@/entities/profile/model/types';
import { profilesData } from './profilesData';
import styles from './catalog.module.css';
import { UserSection } from '../userSection/userSection';
import { useSelector } from '@/app/providers/store/store';
import { selectCatalogItems } from '@/services/selectors/catalogSelectors';

type CategorySection = {
  title: string;
  profiles: typeof profilesData;
  showAllButton?: boolean;
  onShowAll?: () => void;
};

// DELETE: Моковая логика, будет масштабный рефаторинг в следующей таске

const Catalog: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const [viewMode, setViewMode] = useState<'default' | 'category'>('default');
  const [currentCategory, setCurrentCategory] = useState<ProfileCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Получаем профили из хранилища
  const profiles = useSelector(selectCatalogItems);
  const [recommendedItems, setRecommendedItems] = useState<Profile[]>([]);

  // Определяем количество карточек для загрузки (≥20)
  const getItemsPerLoad = () => {
    const width = window.innerWidth;
    const columns = width < 768 ? 1 : width < 1024 ? 2 : 3;
    return Math.ceil(20 / columns) * columns;
  };

  // Инициализация "Рекомендуем"
  React.useEffect(() => {
    const initialItems = profiles
      .filter(p => p.category === 'recommended')
      .slice(0, getItemsPerLoad());
    setRecommendedItems(initialItems);
    const allRecommendedCount = profiles.filter(p => p.category === 'recommended').length;
    setHasMore(initialItems.length < allRecommendedCount);
  }, [profiles]);

  // Фильтрация
  const getProfilesByCategory = (category: ProfileCategory) => {
    return profiles.filter(profile => profile.category === category);
  };

  // Заголовки
  const getCategoryTitle = (category: ProfileCategory): string => {
    const titles: Record<ProfileCategory, string> = {
      match: 'Точное соответствие',
      popular: 'Популярное',
      new: 'Новое',
      ideas: 'Новые Идеи',
      recommended: 'Рекомендуем',
    };
    return titles[category];
  };

  const handleShowAll = (category: ProfileCategory) => {
    setViewMode('category');
    setCurrentCategory(category);
  };

  const handleBack = () => {
    setViewMode('default');
    setCurrentCategory(null);
  };

  // Подгрузка "Рекомендуем"
  const handleLoadMoreRecommended = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      const allRecommended = profiles.filter(p => p.category === 'recommended');
      const currentLength = recommendedItems.length;
      const nextItems = allRecommended.slice(currentLength, currentLength + getItemsPerLoad());

      if (nextItems.length === 0) {
        setHasMore(false);
      } else {
        setRecommendedItems(prev => [...prev, ...nextItems]);
        setHasMore(currentLength + nextItems.length < allRecommended.length);
      }
      setLoading(false);
    }, 1000);
  }, [recommendedItems.length, loading, hasMore, profiles]);

  // Подготовка данных
  const getUIProps = (): Omit<CatalogUIProps, 'sections'> & { sections: CategorySection[] } => {
    if (viewMode === 'category') {
      throw new Error('UI props not available in category mode');
    }

    const firstCategoryType = isAuthenticated ? 'match' : 'popular';
    const secondCategoryType = isAuthenticated ? 'ideas' : 'new';

    const sections: CategorySection[] = [
      {
        title: getCategoryTitle(firstCategoryType),
        profiles: getProfilesByCategory(firstCategoryType).slice(0, 3),
        showAllButton: true,
        onShowAll: () => handleShowAll(firstCategoryType),
      },
      {
        title: getCategoryTitle(secondCategoryType),
        profiles: getProfilesByCategory(secondCategoryType).slice(0, 3),
        showAllButton: true,
        onShowAll: () => handleShowAll(secondCategoryType),
      },
      {
        title: 'Рекомендуем',
        profiles: recommendedItems,
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

  // Режим: одна категория
  if (viewMode === 'category' && currentCategory) {
    return (
      <div className={styles.catalog}>
        <button onClick={handleBack} className={styles.backButton}>
          ← Назад к категориям
        </button>
        <UserSection
          title={getCategoryTitle(currentCategory)}
          users={getProfilesByCategory(currentCategory)}
        />
      </div>
    );
  }

  // Режим: все категории
  const uiProps = getUIProps();
  return <CatalogUI {...uiProps} />;
};

export default Catalog;
