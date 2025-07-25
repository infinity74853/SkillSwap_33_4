import type { Meta, StoryObj } from '@storybook/react';
import { FirstStageUI } from './firstStageUI.tsx';
import { PAGE_TEXTS } from './firstStage.ts';

const meta: Meta<typeof FirstStageUI> = {
  title: 'Components/AuthForm',
  component: FirstStageUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof FirstStageUI>;

export const Default: Story = {
  args: {
    isFirstStage: true,
    textContent: PAGE_TEXTS.firstStage,
    showPassword: false,
    email: 'test@example.com',
    password: 'password123',
    errors: {
      email: '',
      password: '',
      form: '',
    },
    handleSubmit: () => console.log('Form submitted'),
    togglePasswordVisibility: () => console.log('Toggle password'),
    handleEmailChange: () => {},
    handlePasswordChange: () => {},
  },
};

// Состояние с ошибками
export const WithErrors: Story = {
  args: {
    ...Default.args,
    errors: {
      email: '',
      password: '',
      form: 'Общая ошибка формы',
    },
  },
};

// Режим регистрации
export const RegistrationMode: Story = {
  args: {
    ...Default.args,
    isFirstStage: false,
    textContent: PAGE_TEXTS.registration,
  },
};

// Состояние с ошибками
export const RegistrationModeWithErrors: Story = {
  args: {
    ...Default.args,
    isFirstStage: false,
    textContent: PAGE_TEXTS.registration,
    errors: {
      email: 'Некорректный email',
      password: 'Слишком короткий пароль',
      form: '',
    },
  },
};
