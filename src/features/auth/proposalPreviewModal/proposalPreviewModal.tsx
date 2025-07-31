import { useState } from 'react';
import { ModalUI } from '@/shared/ui/modal/modalUi';
import SkillCard from '@/widgets/skillCard/skillCard';
import { Skill } from '@/pages/skillPage/skillPage';
import styles from './proposalPreviewModal.module.css';

interface ProposalPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill;
}

export const ProposalPreviewModal: React.FC<ProposalPreviewModalProps> = ({
  isOpen,
  onClose,
  skill,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  return (
    <ModalUI
      className={styles.modal}
      type="info"
      title="Ваше предложение"
      onClose={onClose}
      // Передаём весь контент — карточку + кнопки — через children
      children={
        <SkillCard
          className={styles.skillCard}
          skill={skill}
          hideActions
          hideSliderControls
          renderButton={() => (
            <>
              <div className={styles.buttonContainer}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Отмена' : 'Редактировать'}
                </button>
                <button type="button" className={styles.primaryButton} onClick={onClose}>
                  Готово
                </button>
              </div>
            </>
          )}
        />
      }
    />
  );
};
