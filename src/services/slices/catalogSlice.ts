import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Profile } from '@/entities/profile/model/types';
import { usersData } from '@/widgets/catalog/usersData';
import { User } from '@/entities/user/model/types';

// Ключ для localStorage
const LS_KEY = 'catalog_profiles';

interface ProfileState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  users: [],
  loading: false,
  error: null,
};

const getCachedMokUsers = (): Profile[] | null => {
  try {
    const savedData = localStorage.getItem(LS_KEY);
    return savedData ? JSON.parse(savedData) : null;
  } catch (e) {
    console.error('Ошибка чтения кэша профилей:', e);
    return null;
  }
};

// Async Thunk - единственный источник правды для данных
export const fetchCatalog = createAsyncThunk('profiles/fetch', async (_, { rejectWithValue }) => {
  try {
    // 1. Проверяем кэш
    const cachedUsers = getCachedMokUsers();
    if (cachedUsers) {
      return cachedUsers;
    }

    // 2. Заглушка под реальный API-запрос

    // 3. Если нет кэша и API, возвращаем моки
    return usersData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return rejectWithValue('Ошибка загрузки профилей');
  }
});

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCatalog.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
        // Сохраняем в кэш при успешной загрузке
        localStorage.setItem(LS_KEY, JSON.stringify(action.payload));
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default catalogSlice.reducer;
