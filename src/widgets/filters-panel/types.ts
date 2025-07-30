export type ExperienceOption = {
  value: 'all' | 'want-to-learn' | 'can-teach';
  label: string;
};

export type GenderOption = {
  value: 'any' | 'male' | 'female';
  label: string;
};

export type City = {
  readonly [key: string]: readonly string[];
};

export type SkillsCategories = {
  readonly [key: string]: readonly string[];
};
