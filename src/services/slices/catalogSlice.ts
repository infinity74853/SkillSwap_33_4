import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Profile } from '@/entities/profile/model/types';
import { profilesData } from '@/widgets/catalog/profilesData';

// Ключ для localStorage
const LS_KEY = 'skillsphere_profiles';

// Загружаем наши профили (моки → localStorage → Redux)
const loadInitialProfiles = (): Profile[] => {
  try {
    const savedData = localStorage.getItem(LS_KEY);
    return savedData ? JSON.parse(savedData) : profilesData;
  } catch (e) {
    console.error('Ошибка загрузки профилей:', e);
    return profilesData;
  }
};

interface ProfileState {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profiles: loadInitialProfiles(),
  loading: false,
  error: null,
};

// EDIT: Async Thunk для потенциального API-запроса
export const fetchProfiles = createAsyncThunk('profiles/fetch', async (_, { rejectWithValue }) => {
  try {
    // Заглушка под реальный API-запрос
    return profilesData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return rejectWithValue('Ошибка загрузки профилей');
  }
});

const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {}, // Конетент каталога пока статичен
  extraReducers: builder => {
    builder
      .addCase(fetchProfiles.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.profiles = action.payload;
        state.loading = false;
        localStorage.setItem(LS_KEY, JSON.stringify(action.payload));
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
