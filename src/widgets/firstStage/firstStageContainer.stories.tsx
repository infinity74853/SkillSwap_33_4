import { Meta, StoryObj } from '@storybook/react';
import { FirstStageContainer } from './firstStageContainer.tsx';

const meta: Meta<typeof FirstStageContainer> = {
  title: 'Containers/FirstStageContainer',
  component: FirstStageContainer,
  tags: ['autodocs'],
  argTypes: {
    isFirstStage: {
      control: 'boolean',
      defaultValue: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof FirstStageContainer>;

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

export const InteractiveDemo: Story = {
  args: {
    isFirstStage: true,
  },
  parameters: {
    controls: {
      expanded: true,
      include: ['isFirstStage'],
    },
    docs: {
      source: {
        type: 'dynamic',
      },
    },
  },
};
