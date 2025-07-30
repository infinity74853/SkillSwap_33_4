// features/profileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '@/entities/profile/model/types';
import { profilesData } from '@/widgets/catalog/profilesData';

interface ProfileState {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profiles: profilesData,
  loading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    setProfiles: (state, action: PayloadAction<Profile[]>) => {
      state.profiles = action.payload;
    },
  },
});

export const { setProfiles } = catalogSlice.actions;
export default catalogSlice.reducer;
