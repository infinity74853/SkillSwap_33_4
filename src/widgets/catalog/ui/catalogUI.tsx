import React from 'react';
import styles from '../catalog.module.css';
import { Profile } from '@/entities/profile/model/types';
import CatalogCategory from '@/widgets/catalogCategory/fake/catalogCategory';

// Типы можно оставить как есть или упростить, если компонент всегда получает все пропсы
interface CategorySection {
  title: string;
  profiles: Profile[];
  showAllButton?: boolean;
  onShowAll?: () => void;
}

// Этот компонент должен просто получать все нужные данные и коллбэки как props
// и не хранить собственное состояние.
export type CatalogUIProps = {
  sections: CategorySection[];
  onLoadMoreRecommended: () => void; // Коллбэк для загрузки "Рекомендуем"
  hasMoreRecommended: boolean; // Есть ли еще данные для "Рекомендуем"
  isLoadingRecommended: boolean; // Идет ли загрузка "Рекомендуем"
};

/**
 * "Глупый" компонент UI для каталога.
 * Не содержит логики загрузки данных, а только получает их через props.
 */
export const CatalogUI: React.FC<CatalogUIProps> = ({
  sections,
  onLoadMoreRecommended,
  hasMoreRecommended,
  isLoadingRecommended,
}) => (
  <div className={styles.catalog}>
    {sections.map(section => {
      // Определяем, является ли текущая секция той самой, с бесконечной прокруткой
      const isRecommended = section.title === 'Рекомендуем';

      return (
        <CatalogCategory
          key={section.title}
          title={section.title}
          profiles={section.profiles}
          onShowAll={section.onShowAll}
          // Пропсы для бесконечной прокрутки передаем только нужной категории
          isRecommended={isRecommended}
          onLoadMore={isRecommended ? onLoadMoreRecommended : undefined}
          hasMore={isRecommended ? hasMoreRecommended : false}
          loading={isRecommended ? isLoadingRecommended : false}
        />
      );
    })}
  </div>
);
