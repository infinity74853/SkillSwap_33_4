import type { Meta, StoryObj } from '@storybook/react';
import { UserCard } from './userCard.tsx';
import localImage from '@/app/assets/static/photo_2025-07-19_19-14-41.jpg';
import { TUserInfoProps } from '@/types/types.ts';

const meta: Meta<typeof UserCard> = {
  title: 'Components/UserCard',
  component: UserCard,
  tags: ['autodocs'],
  argTypes: {
    birthdate: {
      control: 'date',
      description: 'Дата рождения в формате YYYY-MM-DD',
    },
    image: {
      control: 'text',
      description: 'URL аватарки пользователя',
    },
  },
};

export default meta;

type Story = StoryObj<typeof UserCard>;

export const userCard: Story = {
  args: {
    image: localImage,
    name: 'Иван',
    city: 'Санкт - Петербург',
    canTeach: {
      name: 'Игра на барабанах',
      type: 'Творчество и искусство',
      subtype: 'Музыка и звук',
      description:
        'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без паритуры',
    },
    wantsToLearn: [
      {
        name: 'Тайм-менеджмент',
        type: 'Образование и развитие',
        subtype: 'Когнитивные техники',
      },
      {
        name: 'Медитация',
        type: 'Здоровье и лайфстайл',
        subtype: 'Йога и медитация',
      },
      {
        name: 'Английский',
        type: 'Иностранные языки',
        subtype: 'Английский язык',
      },
      {
        name: 'Английский',
        type: 'Иностранные языки',
        subtype: 'Английский язык',
      },
    ],
    id: '001',
    birthdate: '1991-02-05',
  },
};
