import { CustomSkill, SkillCategory } from '@/entities/skill/model/types';
import { User } from '@/entities/user/model/types';
import { skillsCategories } from '@/shared/lib/categories';
import { russianCities } from '@/shared/lib/cities';
import { generateToken, setCookie, setToStorage } from '@/shared/mocks/authMock';
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

export const registerUser = createAsyncThunk('registration/submit', async (_, { getState }) => {
  const rootState = getState() as { register: RegistrationState };

  if (!rootState.register) {
    throw new Error('Registration state is not available');
  }

  const { stepOneData, stepTwoData, stepThreeData } = rootState.register;

  const wantsToLearnSkills: Omit<CustomSkill, 'description' | 'image'>[] = [];

  if (stepTwoData.categories && stepTwoData.subcategories) {
    for (let i = 0; i < stepTwoData.categories.length; i++) {
      const category = stepTwoData.categories[i];
      const subcategory = stepTwoData.subcategories[i];

      if (category && subcategory) {
        wantsToLearnSkills.push({
          category,
          subcategory,
          subcategoryId: `subcat_${Date.now()}_${i}`,
          name: subcategory,
          customSkillId: `want_${Date.now()}_${i}`,
        });
      }
    }
  }
  const skillImageUrls = stepThreeData.images?.map(file => URL.createObjectURL(file)) || [];
  const userAvatarUrl = stepTwoData.avatar?.[0] ? URL.createObjectURL(stepTwoData.avatar[0]) : '';

  const newUser: User = {
    _id: `user_${Date.now()}`,
    email: stepOneData.email || '',
    name: stepTwoData.name || '',
    gender: stepTwoData.gender === 'Мужской' ? 'male' : 'female',
    city: stepTwoData.city || '',
    birthdayDate: stepTwoData.birthdate || '',
    description: stepThreeData.description || '',
    likes: [],
    createdAt: new Date().toString(),
    canTeach: {
      category: stepThreeData.skill || '',
      subcategory: stepThreeData.subcategories?.[0] || '',
      subcategoryId: `subcat_${Date.now()}`,
      name: stepThreeData.skillName || '',
      description: stepThreeData.description || '',
      image: skillImageUrls,
      customSkillId: `skill_${Date.now()}`,
    } as CustomSkill,
    wantsToLearn: wantsToLearnSkills,
    image: userAvatarUrl,
  };

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  users[stepOneData.email || ''] = {
    password: stepOneData.password,
    userData: newUser,
  };
  localStorage.setItem('users', JSON.stringify(users));

  const accessToken = generateToken();
  const refreshToken = generateToken();

  setToStorage('refreshToken', refreshToken);
  setCookie('accessToken', accessToken);
  localStorage.setItem('currentUser', JSON.stringify(newUser));

  return {
    user: newUser,
    accessToken,
    refreshToken,
  };
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
