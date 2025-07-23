import type { Meta, StoryObj } from '@storybook/react';
import CatalogUI from './catalogUI';
import { fn } from '@storybook/test';
import { Profile, ProfileCategory } from '@/entities/profile/model/types';

interface CategorySection {
  title: string;
  profiles: Profile[];
  showAllButton: boolean;
  onShowAll?: () => void;
}

// Генерация тестовых данных
const generateProfiles = (count: number, category: ProfileCategory): Profile[] =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `Пользователь ${i + 1}`,
    avatar: '',
    canTeach: `Навык ${i + 1}`,
    wantToLearn: `Хочу изучить ${i + 1}`,
    category: category, // Теперь category строго типизирована
  }));

const meta = {
  title: 'Components/Catalog/CatalogUI',
  component: CatalogUI,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['default', 'category'],
    },
  },
} satisfies Meta<typeof CatalogUI>;

export default meta;
type Story = StoryObj<typeof meta>;

// Базовые данные для историй
const defaultSections = [
  {
    title: 'Популярное',
    profiles: generateProfiles(3, 'popular'),
    showAllButton: true,
    onShowAll: fn(),
  },
  {
    title: 'Новое',
    profiles: generateProfiles(3, 'new'),
    showAllButton: true,
    onShowAll: fn(),
  },
  {
    title: 'Рекомендуем',
    profiles: generateProfiles(4, 'recommended'),
    showAllButton: false,
  },
] as [CategorySection, CategorySection, CategorySection];

// История для режима по умолчанию
export const DefaultView: Story = {
  args: {
    mode: 'default',
    sections: defaultSections,
  },
};

// История для режима категории
export const CategoryView: Story = {
  args: {
    mode: 'category',
    categoryData: {
      title: 'Популярное',
      profiles: generateProfiles(8, 'popular'),
      onBack: fn(),
    },
  },
};

// История с большим количеством элементов
export const WithManyItems: Story = {
  args: {
    mode: 'default',
    sections: [
      {
        title: 'Популярное',
        profiles: generateProfiles(6, 'popular'),
        showAllButton: true,
        onShowAll: fn(),
      },
      {
        title: 'Новое',
        profiles: generateProfiles(5, 'new'),
        showAllButton: true,
        onShowAll: fn(),
      },
      {
        title: 'Рекомендуем',
        profiles: generateProfiles(7, 'recommended'),
        showAllButton: false,
      },
    ] as [CategorySection, CategorySection, CategorySection],
  },
};

// История без некоторых категорий
export const WithEmptySections: Story = {
  args: {
    mode: 'default',
    sections: [
      {
        title: 'Популярное',
        profiles: generateProfiles(2, 'popular'),
        showAllButton: true,
        onShowAll: fn(),
      },
      {
        title: 'Новое',
        profiles: [],
        showAllButton: true,
        onShowAll: fn(),
      },
      {
        title: 'Рекомендуем',
        profiles: generateProfiles(1, 'recommended'),
        showAllButton: false,
      },
    ] as [CategorySection, CategorySection, CategorySection],
  },
};
