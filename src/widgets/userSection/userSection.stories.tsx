import { Meta, StoryObj } from '@storybook/react';
import { generateProfiles } from '@/shared/mocks/mockUsersData';
import { UserSection } from './userSection';
import { Profile } from '@/entities/profile/model/types';

const meta: Meta<typeof UserSection> = {
  title: 'Widgets/UserSection',
  component: UserSection,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserSection>;

// Базовые моковые данные
const popularUsers = generateProfiles(3, 'popular');
const recommendedUsers = generateProfiles(10, 'recommended');
const filteredUsers = generateProfiles(15, 'match');

// Базовый пример
export const Default: Story = {
  args: {
    title: 'Популярные предложения',
    users: popularUsers as Profile[],
    isRecommended: false,
  },
};

// Секция с бесконечным скроллом (Рекомендуем)
export const Recommended: Story = {
  args: {
    title: 'Рекомендуем',
    users: recommendedUsers as Profile[],
    isRecommended: true,
    hasMore: true,
    onLoadMore: () => console.log('Загружаем еще...'),
  },
};

// Фильтрованный режим
export const Filtered: Story = {
  args: {
    title: 'Результаты поиска',
    users: filteredUsers as Profile[],
    isFiltered: true,
    count: filteredUsers.length,
  },
};

// Пустое состояние
export const Empty: Story = {
  args: {
    title: 'Пустая секция',
    users: [],
    isRecommended: false,
  },
};

// Секция для неавторизованных
export const ForUnauthorized: Story = {
  args: {
    title: 'Популярное',
    users: generateProfiles(3, 'popular') as Profile[],
    isRecommended: false,
  },
};

// Секция для авторизованных
export const ForAuthorized: Story = {
  args: {
    title: 'Точное соответствие',
    users: generateProfiles(3, 'match') as Profile[],
    isRecommended: false,
  },
};
