import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';

import stepsSlice from '../slices/stepSlice';
import filtersReducer from '@/services/slices/filtersSlice';
import likeReducer from '@/services/slices/likeSlice';

export const rootReducer = combineSlices({
  [stepsSlice.name]: stepsSlice.reducer,
  filters: filtersReducer,
  likes: likeReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
