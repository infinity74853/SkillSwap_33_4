import { useState } from 'react';
import { CheckboxUI } from '../сheckbox/checkbox';
import styles from './checkboxDropdownSection.module.css';
import { TOGGLE_TEXTS } from './constants';

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
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const config = TOGGLE_TEXTS[title] || {
    expand: 'Все категории',
    collapse: 'Свернуть',
    defaultVisibleItems: 5,
  };

  const { expand, collapse, defaultVisibleItems } = config;
  const categoryKeys = Object.keys(categories);
  const visibleCategories = expanded ? categoryKeys : categoryKeys.slice(0, defaultVisibleItems);

  const getDisplayState = (category: string) => {
    const hasSubcategories = categories[category]?.length > 0;
    const isCategorySelected = selectedCategories.includes(category);

    // Для простого списка
    if (isSimpleList) {
      return isCategorySelected ? 'done' : 'empty';
    }

    // Для категорий с субкатегориями
    if (hasSubcategories) {
      const subcategories = categories[category];
      const allSelected = subcategories.every(sub => selectedSubcategories.includes(sub));
      const someSelected = subcategories.some(sub => selectedSubcategories.includes(sub));

      if (allSelected) return 'done';
      if (someSelected) return 'remove';
      if (isCategorySelected) return 'empty'; // Категория выбрана, но нет субкатегорий
    }

    // Для категорий без субкатегорий
    return isCategorySelected ? 'done' : 'empty';
  };

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

  const getToggleText = () => {
    return expanded ? collapse : expand;
  };

  return (
    <div className={styles.filterSection}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.checkboxDropdown}>
        {visibleCategories.map(category => {
          return (
            <div
              key={category}
              className={`${styles.categoryItem} ${
                selectedCategories.includes(category) ? styles.expanded : ''
              }`}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div
                className={styles.categoryHeader}
                onClick={() => !isSimpleList && toggleCategory(category)}
              >
                <div onClick={e => e.stopPropagation()}>
                  <CheckboxUI
                    id={`category-${category}`}
                    name={category || 'checkbox-group'}
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    label={category}
                    displayState={getDisplayState(category)}
                  />
                </div>

                {!isSimpleList && (
                  <span
                    className={`${styles.categoryChevron} ${
                      hoveredCategory === category ? styles.visible : ''
                    }`}
                  />
                )}
              </div>

              {!isSimpleList && selectedCategories.includes(category) && (
                <div className={styles.subcategories}>
                  {categories[category].map(subcategory => (
                    <div key={subcategory} className={styles.simpleContainer}>
                      <CheckboxUI
                        id={`subcategory-${subcategory}`}
                        name={subcategory}
                        checked={selectedSubcategories.includes(subcategory)}
                        onChange={() => toggleSubcategory(subcategory)}
                        label={subcategory}
                        displayState={
                          selectedSubcategories.includes(subcategory) ? 'done' : 'empty'
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {categoryKeys.length >= defaultVisibleItems && (
          <div className={styles.showMoreContainer} onClick={() => setExpanded(!expanded)}>
            <span className={styles.showMoreText}>{getToggleText()}</span>
            <span className={`${styles.chevron} ${expanded ? styles.rotated : ''}`} />
          </div>
        )}
      </div>
    </div>
  );
};
