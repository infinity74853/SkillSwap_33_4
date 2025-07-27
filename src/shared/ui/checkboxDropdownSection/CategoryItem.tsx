import { CheckboxUI } from '../сheckbox/checkbox';
import { CustomCheckboxMask } from '../сheckbox/type';
import styles from './checkboxDropdownSection.module.css';

interface CategoryItemProps {
  category: string;
  checked: boolean;
  withChevron?: boolean;
  onChange?: (isChecked: boolean) => void;
  onChevronClick?: () => void;
  customCheckboxMask?: CustomCheckboxMask;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  checked,
  withChevron = false,
  onChange,
  onChevronClick,
  customCheckboxMask = 'empty',
}) => {
  return (
    <div className={`${!withChevron ? styles.simpleContainer : styles.categoryHeader}`}>
      <CheckboxUI
        id={`category-${category}`}
        name={category || 'checkbox-group'}
        checked={checked}
        label={category}
        customCheckboxMask={customCheckboxMask}
        onChange={() => onChange?.(!checked)}
      />

      {withChevron && (
        <button
          className={styles.categoryChevron}
          onClick={e => {
            e.preventDefault();
            onChevronClick?.();
          }}
          aria-label={checked ? 'Свернуть подкатегории' : 'Развернуть подкатегории'}
          type="button"
        />
      )}
    </div>
  );
};
