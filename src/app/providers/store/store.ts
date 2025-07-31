import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';
import likeReducer from '@/services/slices/likeSlice';
import catalogReducer, { fetchCatalog } from '@/services/slices/catalogSlice';

export const rootReducer = combineReducers({
  likes: likeReducer,
  catalog: catalogReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.MODE !== 'production',
});

store.dispatch(fetchCatalog());

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
