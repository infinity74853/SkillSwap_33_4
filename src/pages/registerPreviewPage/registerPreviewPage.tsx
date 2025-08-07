import { ProposalPreviewModal } from '@/features/auth/proposalPreviewModal/proposalPreviewModal';
import { registerUser } from '@/services/slices/registrationSlice';
import { useDispatch, useSelector } from '@/services/store/store';
import { TeachableSkill } from '@/widgets/skillCard/skillCard';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const RegisterPreviewPage: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stepThreeData = useSelector(state => state.register.stepThreeData);
  const isOpen = Object.values(stepThreeData).every(
    value => value !== undefined && (Array.isArray(value) ? value.length > 0 : true),
  );
  const skill = {
    name: stepThreeData.skillName,
    category: stepThreeData.skillCategory,
    subcategory: stepThreeData.skillSubCategory,
    subcategoryId: stepThreeData.subcategoryId,
    description: stepThreeData.description,
    image: stepThreeData.images,
    customSkillId: stepThreeData.customSkillId,
  } as TeachableSkill;

  return (
    <ProposalPreviewModal
      userId={stepThreeData.userId || ''}
      skill={skill}
      isOpen={isOpen}
      onClose={() => {
        navigate(-2);
      }}
      onEdit={() => {
        navigate(-2);
      }}
      onSuccess={() => {
        dispatch(registerUser());
        navigate('/success', { state: { background: '/' } });
      }}
    />
  );
};
