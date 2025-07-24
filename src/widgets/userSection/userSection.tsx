import React from 'react';
import { UserSectionUI } from './ui/userSectionUI';
import { User } from '@/entities/user/model/types';

interface UserSectionProps {
  title: string;
  users: User[];
  isFiltered?: boolean;
  count?: number;
  onShowAll?: () => void;
  onLoadMore?: () => void;
  loading?: boolean;
  isRecommended?: boolean;
  hasMore?: boolean;
}

export const UserSection: React.FC<UserSectionProps> = ({
  title,
  users,
  isFiltered = false,
  count = 0,
  onShowAll,
  onLoadMore,
  loading = false,
  isRecommended = false,
  hasMore = false,
}) => {
  const displayTitle = isFiltered ? `Подходящие предложения: ${count}` : title;
  const buttonText = isFiltered ? '↑↓ сначала новые' : 'Смотреть все';
  const buttonAction = isFiltered ? onToggleSort : onShowAll;

  function onToggleSort() {
    // TODO: Пересобираем пользователей в другом порядке
  }

  return (
    <UserSectionUI
      displayTitle={displayTitle}
      buttonText={buttonText}
      buttonAction={buttonAction}
      users={users}
      onLoadMore={onLoadMore}
      loading={loading}
      isRecommended={isRecommended}
      hasMore={hasMore}
    />
  );
};
