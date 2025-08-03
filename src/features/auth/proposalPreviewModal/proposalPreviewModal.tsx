import editIcon from '@/app/assets/static/images/icons/edit.svg';
import styles from './proposalPreviewModal.module.css';
import SkillCard, { TeachableSkill } from '@/widgets/skillCard/skillCard';
import { Modal } from '@/features/modal/modal';

interface ProposalPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: TeachableSkill;
  onEdit: () => void;
  onSuccess: () => void;
}

export const ProposalPreviewModal: React.FC<ProposalPreviewModalProps> = ({
  isOpen,
  onClose,
  skill,
  onEdit,
  onSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      className={styles.modal}
      type="info"
      title="Ваше предложение"
      description="Пожалуйста, проверьте и подтвердите правильность данных"
      onClose={onClose}
      // Передаём весь контент — карточку + кнопки — через children
      children={
        <SkillCard
          className={`${styles.skillCard} ${styles.skillDetails}`}
          skill={skill}
          hideActions
          hideSliderControls
          renderButton={() => (
            <>
              <div className={styles.buttonContainer}>
                <button
                  type="button"
                  className={`${styles.secondaryButton} ${styles.button}`}
                  onClick={onEdit}
                >
                  Редактировать
                  <img src={editIcon} alt="" className={styles.iconEdit} />
                </button>
                <button
                  type="button"
                  className={`${styles.primaryButton} ${styles.button}`}
                  onClick={onSuccess}
                >
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
