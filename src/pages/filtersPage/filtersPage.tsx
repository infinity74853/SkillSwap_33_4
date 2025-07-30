import React from 'react';
import { FiltersPanel } from '@/widgets/filters-panel/filtersPanel';
import styles from './filtersPage.module.css';
import { mockUsers } from './constants';
import { skillsCategories } from '@/shared/lib/categories';
import { cities } from '@/shared/lib/cities';
import { UserSection } from '@/widgets/userSection/userSection';
import SelectedFilters from '@/shared/ui/selectedFilters/selectedFilters';

export const FiltersPage: React.FC = () => {
  function getUsers(): number {
    // TODO: Предположим, что у нас есть массив пользователей, которые получены после фильтра
    return 9999999;
  }

  return (
    <div className={styles.filtersPage}>
      <div className={styles.filtersPanelPontainer}>
        <FiltersPanel skillsCategories={skillsCategories} cities={cities} />
      </div>

      <div className={styles.filtersGrid}>
        <SelectedFilters />
        <UserSection
          title="Подходящие предложения:"
          users={mockUsers}
          isFiltered={true}
          count={getUsers()}
        />
      </div>
    </div>
  );
};
