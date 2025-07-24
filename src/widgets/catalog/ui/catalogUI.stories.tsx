import type { Meta, StoryObj } from '@storybook/react';
import { CatalogUI } from './catalogUI';
import { fn } from '@storybook/test';
import { Profile } from '@/entities/profile/model/types';
import { generateProfiles } from '@/shared/mocks/mockUsersData';

const meta = {
  title: 'Components/Catalog/CatalogUI',
  component: CatalogUI,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CatalogUI>;

export default meta;
type Story = StoryObj<typeof meta>;

// Обновляем истории в соответствии с новыми пропсами
export const Default: Story = {
  args: {
    sections: [
      {
        title: 'Популярное',
        profiles: generateProfiles(3, 'popular') as Profile[],
        showAllButton: true,
        onShowAll: fn(),
      },
      {
        title: 'Новое',
        profiles: generateProfiles(3, 'new') as Profile[],
        showAllButton: true,
        onShowAll: fn(),
      },
      {
        title: 'Рекомендуем',
        profiles: generateProfiles(4, 'recommended') as Profile[],
        showAllButton: true,
        onShowAll: fn(),
      },
    ],
    onLoadMoreRecommended: fn(),
    hasMoreRecommended: true,
    isLoadingRecommended: false,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoadingRecommended: true,
  },
};

export const NoMoreData: Story = {
  args: {
    ...Default.args,
    hasMoreRecommended: false,
  },
};

export const WithManyItems: Story = {
  args: {
    sections: [
      {
        title: 'Популярное',
        profiles: generateProfiles(6, 'popular') as Profile[],
        showAllButton: true,
        onShowAll: fn(),
      },
      {
        title: 'Новое',
        profiles: generateProfiles(5, 'new') as Profile[],
        showAllButton: true,
        onShowAll: fn(),
      },
      {
        title: 'Рекомендуем',
        profiles: generateProfiles(7, 'recommended') as Profile[],
        showAllButton: true,
        onShowAll: fn(),
      },
    ],
    onLoadMoreRecommended: fn(),
    hasMoreRecommended: true,
    isLoadingRecommended: false,
  },
};
