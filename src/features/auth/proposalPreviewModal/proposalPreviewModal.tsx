import { ModalUI } from '@/shared/ui/modal/modalUi';
import SkillCard from '@/widgets/skillCard/skillCard';
import { Skill } from '@/pages/skillPage/skillPage';
import styles from './proposalPreviewModal.module.css';

interface ProposalPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill;
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
    <ModalUI
      className={styles.modal}
      type="info"
      title="Ваше предложение"
      description="Пожалуйста, проверьте и подтвердите правильность данных"
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
                  className={`${styles.secondaryButton} ${styles.button}`}
                  onClick={onEdit}
                >
                  Редактировать
                  <img
                    src="src/app/assets/static/images/icons/edit.svg"
                    alt=""
                    className={styles.iconEdit}
                  />
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
