// likeButton.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LikeButton } from './likeButton';
import { useLike } from '@/shared/hooks/useLike';

// Мокаем CSS-модуль
jest.mock('./likeButton.module.css', () => ({
  likeButton: 'mock-like-button',
  likeButtonActive: 'mock-like-button-active',
}));

// Мокаем хук — делаем его мок-функцией, чтобы можно было менять реализацию
jest.mock('@/shared/hooks/useLike');

// Объявляем мок-функцию для toggleLike
const mockToggleLike = jest.fn();

// Очистка перед каждым тестом
beforeEach(() => {
  jest.clearAllMocks();
  // Настраиваем поведение по умолчанию
  (useLike as jest.Mock).mockImplementation(() => ({
    isLiked: false,
    toggleLike: mockToggleLike,
  }));
});

// --- Тесты ---

test('рендерит кнопку', () => {
  render(<LikeButton itemId="1" />);

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
});

// test('применяет активный класс, когда isLiked = true', () => {
//   // Переопределяем реализацию хука
//   (useLike as jest.Mock).mockImplementation(() => ({
//     isLiked: true,
//     toggleLike: mockToggleLike,
//   }));

//   render(<LikeButton itemId="1" />);

//   const button = screen.getByTestId('like-button');
//   expect(button).toHaveClass('mock-like-button-active'); // из мока CSS
// });
