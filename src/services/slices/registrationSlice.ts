import { SkillCategory } from '@/entities/skill/model/types';
import { skillsCategories } from '@/shared/lib/categories';
import { russianCities } from '@/shared/lib/cities';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

type AllSkillSubcategories = (typeof skillsCategories)[SkillCategory][number];
type City = (typeof russianCities)[number];

type RegistrationState = {
  stepOneData: {
    email: string | undefined;
    password: string | undefined;
  };
  stepTwoData: {
    name: string | undefined;
    birthdate: string | undefined;
    gender: 'Мужской' | 'Женский' | undefined;
    city: City | undefined;
    categories: SkillCategory[] | undefined;
    subcategories: AllSkillSubcategories[] | undefined;
    avatar: File[] | undefined;
  };
  stepThreeData: {
    skillName: string | undefined;
    skill: SkillCategory | undefined;
    subcategories: AllSkillSubcategories[] | undefined;
    description: string | undefined;
    images: File[] | undefined;
  };
  error: string | undefined;
  loading: boolean;
};

const initialState: RegistrationState = {
  stepOneData: {
    email: undefined,
    password: undefined,
  },
  stepTwoData: {
    name: undefined,
    birthdate: undefined,
    gender: undefined,
    city: undefined,
    categories: undefined,
    subcategories: undefined,
    avatar: undefined,
  },
  stepThreeData: {
    skillName: undefined,
    skill: undefined,
    subcategories: undefined,
    description: undefined,
    images: undefined,
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
    getStepThreeData: state => state.stepThreeData,
  },
  reducers: {
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
  updateStepOneData,
  updateStepTwoData,
  updateStepThreeData,
  resetStepOneData,
  resetStepTwoData,
  resetStepThreeData,
} = registrationSlice.actions;

export const registrationReducer = registrationSlice.reducer;
export const registrationSelectors = registrationSlice.selectors;
