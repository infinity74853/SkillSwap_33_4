import { useMemo, useState } from 'react';
import { RadioGroupSection } from '../radioGroupSection/radioGroupSection';
import { CheckboxDropdownSection } from '../checkboxDropdownSection/checkboxDropdownSection';
import { experienceOptions, genderOptions } from './constants';
import { SkillsCategories, City } from './types';
import styles from './filtersPanel.module.css';

interface FiltersPanelProps {
  skillsCategories: SkillsCategories;
  cities: City;
}

export const FiltersPanel = ({ skillsCategories, cities }: FiltersPanelProps) => {
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('any');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  // Вычисляем количество активных фильтров
  const activeFiltersCount = useMemo(() => {
    let count = 0;

    if (experienceFilter !== 'all') count++;
    if (genderFilter !== 'any') count++;
    count += selectedSubcategories.length;
    count += selectedCities.length;

    return count;
  }, [experienceFilter, genderFilter, selectedSubcategories, selectedCities]);

  const resetFilters = () => {
    setExperienceFilter('all');
    setGenderFilter('any');
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedCities([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </h2>
        {activeFiltersCount > 0 && (
          <button onClick={resetFilters} className={styles.resetButton} type="button">
            Сбросить
          </button>
        )}
      </div>
      <div className={styles.section}>
        <RadioGroupSection
          title=""
          options={experienceOptions}
          selectedValue={experienceFilter}
          onChange={setExperienceFilter}
        />

        <CheckboxDropdownSection
          title="Навыки"
          categories={skillsCategories}
          selectedCategories={selectedCategories}
          selectedSubcategories={selectedSubcategories}
          onCategoryChange={setSelectedCategories}
          onSubcategoryChange={setSelectedSubcategories}
        />

        <RadioGroupSection
          title="Пол автора"
          options={genderOptions}
          selectedValue={genderFilter}
          onChange={setGenderFilter}
        />

        <CheckboxDropdownSection
          title="Город"
          categories={cities}
          selectedCategories={selectedCities}
          onCategoryChange={setSelectedCities}
          isSimpleList={true}
        />
      </div>
    </div>
  );
};
