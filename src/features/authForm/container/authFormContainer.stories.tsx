import { Meta, StoryObj } from '@storybook/react';
import { AuthFormContainer } from './authFormContainer.tsx';

const meta: Meta<typeof AuthFormContainer> = {
  title: 'Containers/AuthFormContainer',
  component: AuthFormContainer,
  tags: ['autodocs'],
  argTypes: {
    isFirstStage: {
      control: 'boolean',
      defaultValue: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof AuthFormContainer>;

export const AuthMode: Story = {
  args: {
    isFirstStage: true,
  },
};

export const RegistrationMode: Story = {
  args: {
    isFirstStage: false,
  },
};
