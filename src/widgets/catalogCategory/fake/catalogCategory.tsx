import React from 'react';
import styles from './catalogCategory.module.css';
import { Profile } from '@/types/fakeTypes';
import { ProfileCard } from '@/widgets/profileCard/profileCard';
import { InfiniteScroll } from '../../catalog/ui/infiniteScroll/infiniteScroll';

interface CatalogCategoryProps {
  title: string;
  profiles: Profile[];
  onShowAll?: () => void;
  onLoadMore?: () => void;
  loading?: boolean;
  isRecommended?: boolean;
  hasMore?: boolean; // Теперь используется!
}

const CatalogCategory: React.FC<CatalogCategoryProps> = ({
  title,
  profiles,
  onShowAll,
  onLoadMore,
  loading = false,
  isRecommended = false,
  hasMore = false, // По умолчанию false — безопасно
}) => {
  if (profiles.length === 0) return null;

  return (
    <div className={styles.category}>
      <div className={styles.categoryHeader}>
        <h2>{title}</h2>
        {onShowAll && (
          <button onClick={onShowAll} className={styles.showAllButton}>
            Смотреть все
          </button>
        )}
      </div>

      {isRecommended ? (
        <InfiniteScroll
          items={profiles}
          renderItem={profile => <ProfileCard profile={profile} />}
          hasMore={hasMore} // ✅ Динамическое значение
          onLoadMore={onLoadMore ?? (() => {})} // ✅ Безопасный fallback
          loading={loading}
          minItems={20}
        />
      ) : (
        <div className={styles.profilesGrid}>
          {profiles.map(profile => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogCategory;
