import React, { useState, useEffect } from 'react';
import CatalogCategory from '../../catalogCategory/fake/catalogCategory';
import styles from './catalog.module.css';
import { Profile } from '@/types/fakeTypes';

//Временная структура категорий в каталоге, пока не будет API
type CatalogUIProps = {
  sections?: CategorySection[];
} & (DefaultModeProps | CategoryModeProps);

// Из чего состоит категория
interface CategorySection {
  title: string;
  profiles: Profile[];
  showAllButton: boolean;
  onShowAll?: () => void;
}

// Режим по умолчанию
interface DefaultModeProps {
  mode: 'default';
  sections: CategorySection[];
}

// Режим категории
interface CategoryModeProps {
  mode: 'category';
  categoryData: {
    title: string;
    profiles: Profile[];
    onBack: () => void;
  };
}

// Режим фильтра
/*
interface FilterModeProps {
  //...
}
*/

// Рабочий компонент для каталога
const CatalogUI: React.FC<CatalogUIProps> = props => {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [displayedItemsMap, setDisplayedItemsMap] = useState<{ [key: string]: Profile[] }>({});

  useEffect(() => {
    if (props.mode === 'default') {
      const recommendedSection = props.sections.find(section => section.title === 'Рекомендуем');
      if (recommendedSection) {
        const getColumnsCount = () => {
          if (window.innerWidth < 768) return 1;
          if (window.innerWidth < 1024) return 2;
          return 3;
        };
        const columnsCount = getColumnsCount();
        const minItemsPerLoad = 20;
        const itemsNeeded = Math.ceil(minItemsPerLoad / columnsCount) * columnsCount;
        const initialItems = recommendedSection.profiles.slice(0, itemsNeeded);
        setDisplayedItemsMap(prev => ({
          ...prev,
          Рекомендуем: initialItems,
        }));
      }
    }
  }, [props.mode, props.sections]);
  {
    /* Если передана категория, то отрисовываем ее */
  }
  if (props.mode === 'category') {
    return (
      <div className={styles.catalog}>
        {/* Функционал кнопки временный, такой кнопки быть не должно */}
        <button onClick={props.categoryData.onBack} className={styles.backButton}>
          ← Назад к категориям
        </button>
        {/* Используем фейковый компонент категории */}
        <CatalogCategory title={props.categoryData.title} profiles={props.categoryData.profiles} />
      </div>
    );
  }

  {
    /* Если передан режим по умолчанию, то отрисовываем все категории */
  }
  return (
    <div className={styles.catalog}>
      {props.sections?.map(section => {
        const isRecommended = section.title === 'Рекомендуем';
        // Добавляем уникальные идентификаторы для элементов
        const displayedItems = isRecommended
          ? displayedItemsMap[section.title] || section.profiles.slice(0, 20)
          : section.profiles;

        return (
          <CatalogCategory
            key={section.title}
            title={section.title}
            profiles={displayedItems}
            onShowAll={section.showAllButton ? section.onShowAll : undefined}
            isRecommended={isRecommended}
            hasMore={isRecommended && displayedItems.length < section.profiles.length}
            onLoadMore={() => {
              if (isRecommended) {
                const currentItems = displayedItemsMap[section.title] || [];

                // Проверяем, есть ли еще карточки для загрузки
                if (currentItems.length >= section.profiles.length) {
                  return;
                }

                setLoadingStates(prev => ({ ...prev, [section.title]: true }));
                setTimeout(() => {
                  // Определяем количество колонок в зависимости от ширины экрана
                  const getColumnsCount = () => {
                    if (window.innerWidth < 768) return 1;
                    if (window.innerWidth < 1024) return 2;
                    return 3;
                  };

                  // Вычисляем количество элементов для следующей загрузки
                  const columnsCount = getColumnsCount();
                  const minItemsPerLoad = 20;
                  const itemsNeeded = Math.ceil(minItemsPerLoad / columnsCount) * columnsCount;

                  const nextItems = section.profiles.slice(
                    currentItems.length,
                    currentItems.length + itemsNeeded,
                  );

                  // Проверяем, получили ли мы новые элементы
                  if (nextItems.length === 0) {
                    setLoadingStates(prev => ({ ...prev, [section.title]: false }));
                    return;
                  }

                  setDisplayedItemsMap(prev => ({
                    ...prev,
                    [section.title]: [...(prev[section.title] || []), ...nextItems],
                  }));
                  setLoadingStates(prev => ({ ...prev, [section.title]: false }));
                }, 1000);
              }
            }}
            loading={loadingStates[section.title] || false}
          />
        );
      })}
    </div>
  );
};

export default CatalogUI;
