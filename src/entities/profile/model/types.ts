/* ВРЕМЕННОЕ РЕШЕНИЕ */

import { User } from '@/entities/user/model/types';

// Фейковые типы

// Категории профилей для каталога
export type ProfileCategory = 'popular' | 'new' | 'ideas' | 'recommended' | 'match';

type UCategory = {
  category: ProfileCategory;
};

// Что включает в себя моковый профиль в каталоге
export type Profile = User & UCategory;
