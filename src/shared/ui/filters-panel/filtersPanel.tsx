import { useState } from 'react';
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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Фильтры</h2>
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
          defaultVisibleItems={6}
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
          selectedSubcategories={[]}
          onCategoryChange={setSelectedCities}
          onSubcategoryChange={() => {}}
          defaultVisibleItems={5}
          isSimpleList={true}
        />
      </div>
    </div>
  );
};
