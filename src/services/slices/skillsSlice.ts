import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { getSkillsApi } from '@/api/skillSwapApi';
import { Skill } from '@/entities/skill/model/types';

type SkillsState = {
  skills: Array<Skill>;
  loading: boolean;
  error: string | undefined;
};

const initialState: SkillsState = {
  skills: [],
  loading: false,
  error: undefined,
};
// СТАЛО
export const getSkills = createAsyncThunk<{ data: Skill[] }>('skills/getAll', async () =>
  getSkillsApi(),
);

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  selectors: { getSkillsSelector: state => state.skills },
  extraReducers: builder => {
    builder
      .addCase(getSkills.pending, state => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getSkills.rejected, state => {
        state.loading = false;
        state.error = 'Не удалось загрузить данные о навыках';
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        state.skills = action.payload.data;
        state.loading = false;
      });
  },
});

export const { getSkillsSelector } = skillsSlice.selectors;
export const skillsReducer = skillsSlice.reducer;

export const getCategoriesSelector = createSelector(getSkillsSelector, skills =>
  Array.from(new Set(skills.map(skill => skill.category))),
); // отдельный селектор с мемоизацией

export const getSkillsBySubcategoryPrefixSelector = createSelector(
  [getSkillsSelector, (_, prefix: string) => prefix],
  (skills, prefix) => skills.filter(skill => skill.subcategoryId.startsWith(prefix)),
);
