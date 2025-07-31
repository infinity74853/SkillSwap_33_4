import { RootState } from '@/app/providers/store/store';

export const selectCatalogItems = (state: RootState) => state.catalog.users;
