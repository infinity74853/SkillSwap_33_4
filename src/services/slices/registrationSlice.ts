import { SkillCategory, SkillSubcategory } from '@/entities/skill/model/types';
import { skillsCategories } from '@/shared/lib/categories';
import { russianCities } from '@/shared/lib/cities';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
type AllSkillSubcategories = (typeof skillsCategories)[SkillCategory][number];
type cities = (typeof russianCities)[number];

type RegistrationState = {
  step: 1 | 2 | 3 | null;
  stepOneData: {
    email: string | undefined;
    password: string | undefined;
  };
  stepTwoData: {
    name: string | undefined;
    birthdate: string | undefined;
    gender: 'Мужской' | 'Женский' | undefined;
    city: cities | undefined;
    skillCategory: SkillCategory[] | undefined;
    skillSubCategory: AllSkillSubcategories[] | undefined;
  };

  stepThreeData: {
    skillName: string | undefined;
    skillCategory: SkillCategory | undefined;
    skillSubCategory: AllSkillSubcategories[] | undefined;
    description: string | undefined;
    pics: File[] | undefined;
  };
  error: string | undefined;
  loading: boolean;
};

const initialState: RegistrationState = {
  step: null,
  stepOneData: {
    email: undefined,
    password: undefined,
  },
  stepTwoData: {
    name: undefined,
    birthdate: undefined,
    gender: undefined,
    city: undefined,
    skillCategory: undefined,
    skillSubCategory: undefined,
  },
  stepThreeData: {
    skillName: undefined,
    skillCategory: undefined,
    skillSubCategory: undefined,
    description: undefined,
    pics: undefined,
  },
  error: undefined,
  loading: false,
};

export const registerUser = createAsyncThunk('registration/submit', async data => {
  localStorage.setItem('registrationData', JSON.stringify(data));
});

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  selectors: {
    getAllRegistrationInfo: state => ({
      data: [state.stepOneData, state.stepTwoData, state.stepThreeData],
    }),
  },
  reducers: {
    setStep: (state, action: PayloadAction<1 | 2 | 3 | null>) => {
      state.step = action.payload;
    },
    updateStepOneData: (
      state,
      action: PayloadAction<Partial<RegistrationState['stepOneData']>>,
    ) => {
      state.stepOneData = { ...state.stepOneData, ...action.payload };
    },
    updateStepTwoData: (
      state,
      action: PayloadAction<Partial<RegistrationState['stepTwoData']>>,
    ) => {
      state.stepTwoData = { ...state.stepTwoData, ...action.payload };
    },
    updateStepThreeData: (
      state,
      action: PayloadAction<Partial<RegistrationState['stepThreeData']>>,
    ) => {
      state.stepThreeData = { ...state.stepThreeData, ...action.payload };
    },
    resetStepOneData: state => {
      state.stepOneData = initialState.stepOneData;
    },
    resetStepTwoData: state => {
      state.stepTwoData = initialState.stepTwoData;
    },
    resetStepThreeData: state => {
      state.stepThreeData = initialState.stepThreeData;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, () => {
        return initialState;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const {
  setStep,
  updateStepOneData,
  updateStepTwoData,
  updateStepThreeData,
  resetStepOneData,
  resetStepTwoData,
  resetStepThreeData,
} = registrationSlice.actions;
export const registrationReducer = registrationSlice.reducer;