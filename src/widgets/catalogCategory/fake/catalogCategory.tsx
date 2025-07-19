/*ВРЕМЕННОЕ РЕШЕНИЕ*/

// Таска на создание категорий еще не взята в работу
import React from 'react';
import styles from './catalogCategory.module.css';
import { Profile } from '@/types/fakeTypes';

interface CatalogCategoryProps {
  title: string;
  profiles: Profile[];
  onShowAll?: () => void;
}

// Полностью фейковый компонент, который включает в себя категорию и сразу карточку профиля
// Он сразу внутри сэбя собирает карточки профилей из массива profiles
// Включает в себя фейковую верстку для карточки профиля (необходимо создать отдельный компонент)
const CatalogCategory: React.FC<CatalogCategoryProps> = ({ title, profiles, onShowAll }) => {
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
      <div className={styles.profilesGrid}>
        {/* Перебираем массив профилей и отображаем их в виде карточек */}
        {profiles.map(profile => (
          /* Верстка фейковой карточки профиля */
          <div key={profile.id} className={styles.profileCard} onClick={() => {}}>
            <div className={styles.avatar}>
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} />
              ) : (
                <div className={styles.avatarPlaceholder} />
              )}
            </div>
            <h3 className={styles.profileName}>{profile.name}</h3>
            <div className={styles.skills}>
              <div className={styles.skillSection}>
                <h4>Может научить:</h4>
                <p>{profile.canTeach}</p>
              </div>
              <div className={styles.skillSection}>
                <h4>Хочет научиться:</h4>
                <p>{profile.wantToLearn}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogCategory;
