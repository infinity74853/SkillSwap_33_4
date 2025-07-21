export type ExperienceOption = {
  value: 'all' | 'want-to-learn' | 'can-teach';
  label: string;
};

export type GenderOption = {
  value: 'any' | 'male' | 'female';
  label: string;
};

export type City = {
  [key: string]: string[];
};

export type SkillsCategories = {
  [key: string]: string[];
};
