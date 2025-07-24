import { CustomSkill } from '@/entities/skill/model/types';

export type User = {
  createdAt: string | number | Date;
  _id: string;
  name: string;
  image: string;
  city: string;
  birthdayDate: string;
  description: string;
  likes: string[];
  canTeach: CustomSkill;
  wantsToLearn: Omit<CustomSkill, 'description' | 'image'>[];
};
