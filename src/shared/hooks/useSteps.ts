import { stepActions } from '@/app/providers/slices/stepSlice';
import { useDispatch } from '@/app/providers/store/store';
import { useEffect } from 'react';

export const useSteps = (stepCount: number) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(stepActions.initializeSteps(stepCount));
    return () => {
      dispatch(stepActions.resetSteps());
    };
  }, [dispatch, stepCount]);
};
