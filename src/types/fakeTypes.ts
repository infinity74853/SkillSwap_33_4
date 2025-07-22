/* ВРЕМЕННОЕ РЕШЕНИЕ */

// Фйековые типы

// Категории профилей для каталога
export type ProfileCategory = 'popular' | 'new' | 'ideas' | 'recommended' | 'match';

// Что включает в себя моковый профиль в каталоге
export interface Profile {
  id: string;
  name: string;
  avatar?: string;
  canTeach: string;
  wantToLearn: string;
  category: ProfileCategory;
}
