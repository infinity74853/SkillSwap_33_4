import { CustomSkill } from '@/entities/skill/model/types';

export type User = {
  createdAt: string | number | Date;
  _id: string;
  name: string;
  image: string;
  city: string;
  gender: GenderOption['value'];
  birthdayDate: string;
  description: string;
  likes: string[];
  canTeach: CustomSkill;
  wantsToLearn: Omit<CustomSkill, 'description' | 'image'>[];
};

export type ExperienceOption = {
  value: 'all' | 'want-to-learn' | 'can-teach';
  label: string;
};

export type GenderOption = {
  value: 'any' | 'male' | 'female';
  label: string;
};
