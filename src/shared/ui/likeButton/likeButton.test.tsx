import { render, screen } from '@testing-library/react';
import { beforeEach, test, expect, vi } from 'vitest';
import { LikeButton } from './likeButton';
import { useLike } from '@/shared/hooks/useLike';

vi.mock('./likeButton.module.css', () => ({
  default: {
    likeButton: 'mock-like-button',
    likeButtonActive: 'mock-like-button-active',
  },
}));

vi.mock('@/shared/hooks/useLike');

const mockToggleLike = vi.fn();

const mockedUseLike = vi.mocked(useLike);

beforeEach(() => {
  vi.clearAllMocks();

  mockedUseLike.mockReturnValue({
    isLiked: false,
    isLoading: false,
    toggleLike: mockToggleLike,
  });
});

test('рендерит кнопку', () => {
  render(<LikeButton itemId="1" />);
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
});

test('применяет активный класс, когда isLiked = true', () => {
  mockedUseLike.mockReturnValue({
    isLiked: true,
    isLoading: false,
    toggleLike: mockToggleLike,
  });

  render(<LikeButton itemId="1" />);

  const button = screen.getByRole('button');
  expect(button).toHaveClass('mock-like-button-active');
});
