export type SkillCategory =
  | 'Бизнес и карьера'
  | 'Творчество и искусство'
  | 'Иностранные языки'
  | 'Образование и развитие'
  | 'Дом и уют'
  | 'Здоровье и лайфстайл';

export type TSkillProps = {
  children: React.ReactNode;
  type: SkillCategory;
};

export const CATEGORY_CLASS_MAP: Record<SkillCategory, string> = {
  'Бизнес и карьера': 'business',
  'Творчество и искусство': 'creativity',
  'Иностранные языки': 'languages',
  'Образование и развитие': 'development',
  'Дом и уют': 'home',
  'Здоровье и лайфстайл': 'health',
};
