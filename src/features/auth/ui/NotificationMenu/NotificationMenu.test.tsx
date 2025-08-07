import { render, screen, within } from '@testing-library/react';
import { NotificationMenu } from './NotificationMenu';
import { BrowserRouter } from 'react-router-dom';

describe('NotificationMenu', () => {
  it('не должен рендериться, если isOpen={false}', () => {
    render(
      <BrowserRouter>
        <NotificationMenu isOpen={false} />
      </BrowserRouter>,
    );

    expect(screen.queryByTestId('notification-menu')).not.toBeInTheDocument();
  });

  it('должен рендериться, если isOpen={true}', () => {
    render(
      <BrowserRouter>
        <NotificationMenu isOpen={true} />
      </BrowserRouter>,
    );

    expect(screen.getByTestId('notification-menu')).toBeInTheDocument();
    expect(screen.getByText('Новые уведомления')).toBeInTheDocument();
  });

  it('должен отображать новые уведомления', () => {
    render(
      <BrowserRouter>
        <NotificationMenu isOpen={true} />
      </BrowserRouter>,
    );

    const newNotifications = screen.getAllByTestId('new-notification');
    expect(newNotifications).toHaveLength(2);

    // Проверяем карточку Николая
    const nikolayCard = newNotifications.find(card => within(card).queryByText('Николай'));
    expect(nikolayCard).not.toBeNull();
    expect(nikolayCard).toHaveTextContent('принял ваш обмен');

    // Проверяем карточку Татьяны
    const tatyanaCard = newNotifications.find(card => within(card).queryByText('Татьяна'));
    expect(tatyanaCard).not.toBeNull();
    expect(tatyanaCard).toHaveTextContent('предлагает вам обмен');
  });

  it('должен отображать просмотренные уведомления', () => {
    render(
      <BrowserRouter>
        <NotificationMenu isOpen={true} />
      </BrowserRouter>,
    );

    const viewedSection = screen.getByTestId('viewed-section');
    expect(viewedSection).toBeInTheDocument();
    expect(screen.getByText('Просмотренные')).toBeInTheDocument();

    const viewedNotifications = screen.getAllByTestId('viewed-notification');
    expect(viewedNotifications).toHaveLength(2);

    expect(screen.getByText('Олег')).toBeInTheDocument();
    expect(screen.getByText('Игорь')).toBeInTheDocument();
  });

  it('должен иметь кнопку "Перейти" с правильным маршрутом', () => {
    render(
      <BrowserRouter>
        <NotificationMenu isOpen={true} />
      </BrowserRouter>,
    );

    const incomingLink = screen.getByTestId('link-to-obmen');
    expect(incomingLink).toHaveAttribute('href', '/obmen');

    const outgoingLink = screen.getByTestId('link-to-profile');
    expect(outgoingLink).toHaveAttribute('href', '/profile');
  });

  it('должен отображать кнопку "Прочитать все" и "Очистить"', () => {
    render(
      <BrowserRouter>
        <NotificationMenu isOpen={true} />
      </BrowserRouter>,
    );

    expect(screen.getByTestId('read-all-btn')).toBeInTheDocument();
    expect(screen.getByTestId('clear-btn')).toBeInTheDocument();
  });
});
