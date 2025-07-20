import { SkillCategory } from '@/shared/ui/skill/skill.tsx';

export type TWantsToLearn = {
  name: string;
  type: SkillCategory;
  subtype: string;
};

export type TCanTeach = {
  name: string;
  type: SkillCategory;
  subtype: string;
  description: string;
};

export type TUserInfoProps = {
  id: string;
  name: string;
  image: string;
  city: string;
  birthdate: string;
  likes: string[];
  canTeach: TCanTeach;
  wantsToLearn: TWantsToLearn[];
  about: string;
};
