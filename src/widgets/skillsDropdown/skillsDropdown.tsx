import React, { useRef, useEffect, useState } from 'react';
import { skillsCategories, skillsMapping } from '@/shared/lib/categories';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import styles from './SkillsDropdown.module.css';

interface SkillsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SkillsDropdown: React.FC<SkillsDropdownProps> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useClickOutside(dropdownRef, () => {
    if (isOpen) {
      onClose();
    }
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  const renderCategory = (
    skillscategory: string,
    subcategories: string[],
    iconPath: string,
    bgColor: string,
  ) => (
    <div className={styles.skillscategory} key={skillscategory}>
      <div className={styles.skillscategoryHeader}>
        <div className={styles.icon} style={{ backgroundColor: bgColor }}>
          <div
            className={styles.iconMask}
            style={{
              maskImage: `url(${iconPath})`,
              WebkitMaskImage: `url(${iconPath})`,
            }}
          />
        </div>
        <div className={styles.categoryContent}>
          <h3 className={styles.categoryTitle}>{skillscategory}</h3>
          <div className={styles.subcategories}>
            {subcategories.map(sub => (
              <div key={sub} className={styles.subcategory}>
                {sub}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const categories = Object.entries(skillsCategories);
  const firstColumnCategories = [categories[0], categories[2], categories[4]];
  const secondColumnCategories = [categories[1], categories[3], categories[5]];

  return (
    <div ref={dropdownRef} className={styles.skillsDropdown}>
      <div className={styles.skillsdropdownContent}>
        {!isMobile && (
          <>
            <div className={styles.skillscolumn}>
              {firstColumnCategories.map(([skillscategory, subcategories]) => {
                const { color, icon } = skillsMapping[skillscategory as keyof typeof skillsMapping];
                return renderCategory(skillscategory, [...subcategories], icon, color);
              })}
            </div>
            <div className={styles.skillscolumn}>
              {secondColumnCategories.map(([skillscategory, subcategories]) => {
                const { color, icon } = skillsMapping[skillscategory as keyof typeof skillsMapping];
                return renderCategory(skillscategory, [...subcategories], icon, color);
              })}
            </div>
          </>
        )}
        {isMobile && (
          <div className={styles.skillscolumn}>
            {categories.map(([skillscategory, subcategories]) => {
              const { color, icon } = skillsMapping[skillscategory as keyof typeof skillsMapping];
              return renderCategory(skillscategory, [...subcategories], icon, color);
            })}
          </div>
        )}
      </div>
    </div>
  );
};
