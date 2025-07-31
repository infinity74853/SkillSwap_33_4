import React from 'react';
import { FiltersPanel } from '@/widgets/filters-panel/filtersPanel';
import styles from './catalogPage.module.css';
import { skillsCategories } from '@/shared/lib/categories';
import { cities } from '@/shared/lib/cities';
import SelectedFilters from '@/shared/ui/selectedFilters/selectedFilters';
import Catalog from '@/widgets/catalog/catalog';

export const CatalogPage: React.FC = () => {
  return (
    <div className={styles.filtersPage}>
      <div className={styles.filtersPanelPontainer}>
        <FiltersPanel skillsCategories={skillsCategories} cities={cities} />
      </div>

      <div className={styles.filtersGrid}>
        <SelectedFilters />
        <Catalog isAuthenticated={false} isFiltered={false} />
      </div>
    </div>
  );
};
