import type { Meta, StoryObj } from '@storybook/react';
import { FiltersPanel } from './filtersPanel';

type SkillsCategories = Record<string, readonly string[]>;
type City = Record<string, readonly string[]>;

const meta: Meta<typeof FiltersPanel> = {
  title: 'Components/FiltersPanel',
  component: FiltersPanel,
  tags: ['autodocs'],
  argTypes: {
    skillsCategories: {
      control: 'object',
      description: 'Категории и подкатегории навыков',
    },
    cities: {
      control: 'object',
      description: 'Объект с городами и районами',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FiltersPanel>;

const baseSkills: SkillsCategories = {
  Программирование: ['JavaScript', 'TypeScript', 'Python', 'Java'],
  Дизайн: ['UI/UX', 'Графический дизайн', '3D моделирование', 'Motion design'],
  Маркетинг: ['SEO', 'Контент-маркетинг', 'SMM', 'Таргетированная реклама'],
  Аналитика: ['SQL', 'Google Analytics', 'Tableau', 'Excel'],
  Управление: ['Agile', 'Scrum', 'Управление проектами', 'Работа с командой'],
  Тестирование: ['Автоматизированное тестирование', 'Ручное тестирование', 'Jest', 'Cypress'],
};

const baseCities: City = {
  Москва: [],
  'Санкт-Петербург': [],
  Новосибирск: [],
  Екатеринбург: [],
  Казань: [],
  'Нижний Новгород': [],
  Челябинск: [],
  Самара: [],
  Омск: [],
  'Ростов-на-Дону': [],
};

export const Default: Story = {
  args: {
    skillsCategories: baseSkills,
    cities: baseCities,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Стандартное состояние фильтров с базовым набором навыков и городов. Показывает компонент в его обычном рабочем состоянии.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    skillsCategories: {},
    cities: {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'Состояние компонента без данных. Используется для проверки поведения при отсутствии навыков и городов, а также работы скелетона загрузки.',
      },
    },
  },
};
