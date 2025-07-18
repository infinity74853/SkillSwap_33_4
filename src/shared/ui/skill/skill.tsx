import React from 'react';
import styles from './skill.module.css';
import { CATEGORY_CLASS_MAP, TSkillProps } from '@/types/types';

export const Skill: React.FC<TSkillProps> = ({ children, type }) => {
  const categoryClass = CATEGORY_CLASS_MAP[type];

  const skillClasses = [
    styles.skill,
    categoryClass && styles[categoryClass],
    !categoryClass && styles.default,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={skillClasses}>
      <span className={styles.content}>{children}</span>
    </div>
  );
};
