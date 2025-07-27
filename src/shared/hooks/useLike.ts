import { useState, useCallback, useEffect } from 'react';

interface UseLikeProps {
  itemId: string;
  initialLiked?: boolean;
  storageKey?: string; // Позволяет использовать хук для разных сущностей
}

export const useLike = ({
  itemId,
  initialLiked = false,
  storageKey = 'likedSkills',
}: UseLikeProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);

  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setIsLiked(liked.includes(itemId));
  }, [itemId, storageKey]);

  const toggleLike = useCallback(() => {
    const liked = JSON.parse(localStorage.getItem(storageKey) || '[]');
    let updated;
    if (liked.includes(itemId)) {
      updated = liked.filter((id: string) => id !== itemId);
      setIsLiked(false);
    } else {
      updated = [...liked, itemId];
      setIsLiked(true);
    }
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }, [itemId, storageKey]);

  return {
    isLiked,
    toggleLike,
  };
};
