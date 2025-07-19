import React from 'react';
import CatalogCategory from '../../CatalogCategory/fake/CatalogCategory';
import styles from './catalog.module.css';
import { Profile } from '@/types/fakeTypes';

//Временная структура категорий в каталоге, пока не будет API
type CatalogUIProps = DefaultModeProps | CategoryModeProps;

// Из чего состоит категория
interface CategorySection {
  title: string;
  profiles: Profile[];
  showAllButton: boolean;
  onShowAll?: () => void;
}

// Режим по умолчанию
interface DefaultModeProps {
  mode: 'default';
  sections: [CategorySection, CategorySection, CategorySection];
}

// Режим категории
interface CategoryModeProps {
  mode: 'category';
  categoryData: {
    title: string;
    profiles: Profile[];
    onBack: () => void;
  };
}

// Режим фильтра
/*
interface FilterModeProps {
  //...
}
*/

// Рабочий компонент для каталога
const CatalogUI: React.FC<CatalogUIProps> = props => {
  {
    /* Если передана категория, то отрисовываем ее */
  }
  if (props.mode === 'category') {
    return (
      <div className={styles.catalog}>
        {/* Функционал кнопки временный, такой кнопки быть не должно */}
        <button onClick={props.categoryData.onBack} className={styles.backButton}>
          ← Назад к категориям
        </button>
        {/* Используем фейковый компонент категории */}
        <CatalogCategory title={props.categoryData.title} profiles={props.categoryData.profiles} />
      </div>
    );
  }

  {
    /* Если передан режим по умолчанию, то отрисовываем все категории */
  }
  return (
    <div className={styles.catalog}>
      {/* Используем фейковый компонент категории */}
      {props.sections.map((section, index) => (
        <CatalogCategory
          key={index}
          title={section.title}
          profiles={section.profiles}
          onShowAll={section.showAllButton ? section.onShowAll : undefined}
        />
      ))}
    </div>
  );
};

export default CatalogUI;
