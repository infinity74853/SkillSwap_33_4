// CheckboxUI.stories.tsx
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { CheckboxUI } from './checkbox';
import { CustomCheckboxMask } from './type';

const meta: Meta<typeof CheckboxUI> = {
  title: 'Components/CheckboxUI',
  component: CheckboxUI,
  tags: ['autodocs'],
  argTypes: {
    customCheckboxMask: {
      options: ['empty', 'done', 'remove'],
      control: { type: 'select' },
      description: 'Визуальный стиль чекбокса',
    },
    disabled: {
      control: 'boolean',
      description: 'Состояние disabled',
    },
    readOnly: {
      control: 'boolean',
      description: 'Состояние readOnly',
    },
    onChange: {
      action: 'changed',
      description: 'Обработчик изменения состояния',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CheckboxUI>;

export const Default: Story = {
  args: {
    id: 'checkbox-default',
    label: 'Default Checkbox',
    checked: false,
    customCheckboxMask: 'empty',
  },
};

export const Checked: Story = {
  args: {
    id: 'checkbox-checked',
    label: 'Checked Checkbox',
    checked: true,
    customCheckboxMask: 'done',
  },
};

export const DoneStyle: Story = {
  args: {
    id: 'checkbox-done',
    label: 'Done Style Checkbox',
    checked: true,
    customCheckboxMask: 'done',
  },
  name: 'Done Style',
};

export const RemoveStyle: Story = {
  args: {
    id: 'checkbox-remove',
    label: 'Remove Style Checkbox',
    checked: true,
    customCheckboxMask: 'remove',
  },
  name: 'Remove Style',
};

export const ReadOnly: Story = {
  args: {
    id: 'checkbox-readonly',
    label: 'ReadOnly Checkbox',
    checked: true,
    readOnly: true,
  },
};

export const InteractiveExample: Story = {
  render: args => {
    const [checked, setChecked] = React.useState(false);
    const [selectedMask, setSelectedMask] = React.useState<CustomCheckboxMask>('empty');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <CheckboxUI
          {...args}
          id="checkbox-interactive"
          label="Interactive Checkbox"
          checked={checked}
          customCheckboxMask={selectedMask}
          onChange={() => setChecked(!checked)}
        />

        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button onClick={() => setSelectedMask('empty')}>Empty Style</button>
          <button onClick={() => setSelectedMask('done')}>Done Style</button>
          <button onClick={() => setSelectedMask('remove')}>Remove Style</button>
        </div>

        <div style={{ marginTop: '8px' }}>
          Current state: {checked ? 'Checked' : 'Unchecked'} | Style: {selectedMask}
        </div>
      </div>
    );
  },
  name: 'Interactive Example',
};
