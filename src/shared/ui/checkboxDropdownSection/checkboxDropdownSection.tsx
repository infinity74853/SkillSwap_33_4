import { useState } from 'react';
import { CheckboxUI } from '../сheckbox/checkbox';
import styles from './checkboxDropdownSection.module.css';

interface CheckboxDropdownSectionProps {
  title: string;
  categories: Record<string, readonly string[]>;
  selectedCategories: string[];
  selectedSubcategories: string[];
  onCategoryChange: (categories: string[]) => void;
  onSubcategoryChange: (subcategories: string[]) => void;
  isSimpleList?: boolean;
}

export const CheckboxDropdownSection: React.FC<CheckboxDropdownSectionProps> = ({
  title,
  categories,
  selectedCategories,
  selectedSubcategories,
  onCategoryChange,
  onSubcategoryChange,
  isSimpleList = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const categoryKeys = Object.keys(categories);
  const visibleCategories = expanded ? categoryKeys : categoryKeys.slice(0, 5);

  const toggleCategory = (category: string) => {
    onCategoryChange(
      selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories, category],
    );
  };

  const toggleSubcategory = (subcategory: string) => {
    onSubcategoryChange(
      selectedSubcategories.includes(subcategory)
        ? selectedSubcategories.filter(s => s !== subcategory)
        : [...selectedSubcategories, subcategory],
    );
  };

  return (
    <div className={styles.filterSection}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.checkboxDropdown}>
        {visibleCategories.map(category => (
          <div key={category} className={styles.categoryItem}>
            {!isSimpleList ? (
              <>
                <CheckboxUI
                  id={`category-${category}`}
                  name={category || 'checkbox-group'}
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  label={category}
                />

                {selectedCategories.includes(category) && (
                  <div className={styles.subcategories}>
                    {categories[category].map(subcategory => (
                      <CheckboxUI
                        key={subcategory}
                        id={`subcategory-${subcategory}`}
                        name={subcategory}
                        checked={selectedSubcategories.includes(subcategory)}
                        onChange={() => toggleSubcategory(subcategory)}
                        label={subcategory}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <CheckboxUI
                id={`simple-${category}`}
                name={category}
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                label={category}
              />
            )}
          </div>
        ))}

        {categoryKeys.length > 5 && (
          <a className={styles.showMore} onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Свернуть' : 'Все категории'}
          </a>
        )}
      </div>
    </div>
  );
};
