import { skillsCategories } from '@/shared/lib/categories';

export type TSkillCategory = keyof typeof skillsCategories;
type TSkillSubcategory<T extends TSkillCategory> = (typeof skillsCategories)[T][number];

export type TSkill = {
  [K in TSkillCategory]: {
    category: K;
    subcategory: TSkillSubcategory<K>;
    subcategoryId: string;
  };
}[TSkillCategory];

export type TCustomSkill = TSkill & {
  name: string;
  image: string[];
  description: string;
  customSkillId: string;
};

export type TUser = {
  _id: string;
  name: string;
  image: string;
  city: string;
  birthdayDate: string;
  description: string;
  likes: string[];
  canTeach: TCustomSkill;
  wantsToLearn: Omit<TCustomSkill, 'description' | 'image'>[];
};
