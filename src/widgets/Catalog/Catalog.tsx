/* ВРЕМЕННОЕ РЕШЕНИЕ */

import React, { useState } from 'react';
import CatalogUI, { CatalogUIProps } from './ui/CatalogUI';
import { Profile, ProfileCategory } from '@/types/fakeTypes';

// DELETE: Моковые данные для примера
const profilesData: Profile[] = [
  {
    id: 1,
    name: 'Алексей Петров',
    avatar: '',
    canTeach: 'Программирование на JavaScript',
    wantToLearn: 'Игра на гитаре',
    category: 'popular',
  },
  {
    id: 1,
    name: 'Алексей Петров',
    avatar: '',
    canTeach: 'Программирование на JavaScript',
    wantToLearn: 'Игра на гитаре',
    category: 'match',
  },
  {
    id: 2,
    name: 'Мария Иванова',
    avatar: '',
    canTeach: 'Дизайн интерфейсов',
    wantToLearn: 'Английский язык',
    category: 'popular',
  },
  {
    id: 2,
    name: 'Мария Иванова',
    avatar: '',
    canTeach: 'Дизайн интерфейсов',
    wantToLearn: 'Английский язык',
    category: 'popular',
  },
  {
    id: 2,
    name: 'Мария Иванова',
    avatar: '',
    canTeach: 'Дизайн интерфейсов',
    wantToLearn: 'Английский язык',
    category: 'popular',
  },
  {
    id: 2,
    name: 'Мария Иванова',
    avatar: '',
    canTeach: 'Дизайн интерфейсов',
    wantToLearn: 'Английский язык',
    category: 'popular',
  },
  {
    id: 3,
    name: 'Иван Сидоров',
    avatar: '',
    canTeach: 'Маркетинг, SMM',
    wantToLearn: 'Английский язык',
    category: 'new',
  },
  {
    id: 4,
    name: 'Елена Васильева',
    avatar: '',
    canTeach: 'Английский язык',
    wantToLearn: 'Французский язык',
    category: 'recommended',
  },
  {
    id: 4,
    name: 'Елена Васильева',
    avatar: '',
    canTeach: 'Английский язык',
    wantToLearn: 'Французский язык',
    category: 'recommended',
  },
  {
    id: 4,
    name: 'Елена Васильева',
    avatar: '',
    canTeach: 'Английский язык',
    wantToLearn: 'Французский язык',
    category: 'recommended',
  },
  {
    id: 4,
    name: 'Елена Васильева',
    avatar: '',
    canTeach: 'Английский язык',
    wantToLearn: 'Французский язык',
    category: 'recommended',
  },
  {
    id: 4,
    name: 'Елена Васильева',
    avatar: '',
    canTeach: 'Английский язык',
    wantToLearn: 'Французский язык',
    category: 'recommended',
  },
  {
    id: 4,
    name: 'Елена Васильева',
    avatar: '',
    canTeach: 'Английский язык',
    wantToLearn: 'Французский язык',
    category: 'recommended',
  },
  {
    id: 4,
    name: 'Елена Васильева',
    avatar: '',
    canTeach: 'Английский язык',
    wantToLearn: 'Французский язык',
    category: 'recommended',
  },
];

// TODO: Подключить реальную логику

const Catalog: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  // Необходимо реализовать:
  // 1. Получение данных профилей из стора
  // 2. Фильтрация данных по категориям

  // DELETE: МОКОВАЯ ЛОГИКА

  // Стейты
  const [viewMode, setViewMode] = useState<'default' | 'category'>('default');
  const [currentCategory, setCurrentCategory] = useState<ProfileCategory | null>(null);

  // Фильтрация профилей под категорию
  const getProfilesByCategory = (category: ProfileCategory) => {
    return profilesData.filter(profile => profile.category === category);
  };

  // Получение заголовков категорий
  const getCategoryTitle = (category: ProfileCategory): string => {
    const titles = {
      match: 'Точное соответствие',
      popular: 'Популярное',
      new: 'Новое',
      ideas: 'Новые Идеи',
      recommended: 'Рекомендуем',
    };
    return titles[category];
  };

  // Обработчики кнопки "Показать все", прокидываем выбранную категорию
  const handleShowAll = (category: ProfileCategory) => {
    setViewMode('category');
    setCurrentCategory(category);
  };

  // Обработчик кнопки "Назад" в режиме категории
  const handleBack = () => {
    setViewMode('default');
    setCurrentCategory(null);
  };

  // Подготовка данных для UI
  const getUIProps = () => {
    if (viewMode === 'category' && currentCategory) {
      return {
        mode: 'category' as const,
        categoryData: {
          title: getCategoryTitle(currentCategory),
          profiles: getProfilesByCategory(currentCategory),
          onBack: handleBack,
        },
      };
    }

    // Категории, которые меняются в зависимости от состоянии логина пользователя
    const firstCategoryType = isAuthenticated ? 'match' : 'popular';
    const secondCategoryType = isAuthenticated ? 'ideas' : 'new';

    // Всегда 3 секции, но верхние два верхних меняются в зависимости от логина
    // Первая и вторая секции всегда имеют 3 профиля, и могут быть открыты по клику на кнопку "Показать все"
    // Для этого и передаем категорию в handleShowAll
    // Третья секция всегда открыта
    // В итоге передаем мод - default, для показа всех категорий; либо category, для показа одной категории
    // В будущем должен появится мод filter, для показа фильтров
    return {
      mode: 'default' as const,
      sections: [
        {
          title: getCategoryTitle(firstCategoryType),
          profiles: getProfilesByCategory(firstCategoryType).slice(0, 3),
          showAllButton: true,
          onShowAll: () => handleShowAll(firstCategoryType),
        },
        {
          title: getCategoryTitle(secondCategoryType),
          profiles: getProfilesByCategory(secondCategoryType).slice(0, 3),
          showAllButton: true,
          onShowAll: () => handleShowAll(secondCategoryType),
        },
        {
          title: getCategoryTitle('recommended'),
          profiles: getProfilesByCategory('recommended'),
          showAllButton: false,
        },
      ],
    };
  };

  // Используем реальный UI компонент
  // Может ругаться на то, что пропсов будет передано меньше, но это работает
  // Исправится, когда появится реальная логика
  return <CatalogUI {...(getUIProps() as CatalogUIProps)} />;
};

export default Catalog;
