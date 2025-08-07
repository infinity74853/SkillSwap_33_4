import styles from './NotificationMenu.module.css';
import IdeaIcon from '@/app/assets/static/images/icons/idea.svg';
import { Button } from '@/shared/ui/button/button';
import { Link } from 'react-router-dom';

type Notification = {
  id: string;
  userName: string;
  type: 'incoming' | 'outgoing';
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
  message: string;
  isNew: boolean;
};

type NotificationMenuProps = {
  isOpen: boolean;
};

export const NotificationMenu = ({ isOpen }: NotificationMenuProps) => {
  if (!isOpen) return null;
  {
    /* Временные моковые данные */
  }
  const notifications: Notification[] = [
    {
      id: '1',
      userName: 'Николай',
      type: 'outgoing',
      status: 'accepted',
      date: 'сегодня',
      message: 'Перейдите в профиль, чтобы обсудить детали',
      isNew: true,
    },
    {
      id: '2',
      userName: 'Татьяна',
      type: 'incoming',
      status: 'pending',
      date: 'сегодня',
      message: 'Примите обмен, чтобы обсудить детали',
      isNew: true,
    },
    {
      id: '3',
      userName: 'Олег',
      type: 'incoming',
      status: 'pending',
      date: 'вчера',
      message: 'Примите обмен, чтобы обсудить детали',
      isNew: false,
    },
    {
      id: '4',
      userName: 'Игорь',
      type: 'outgoing',
      status: 'accepted',
      date: '23 мая',
      message: 'Перейдите в профиль, чтобы обсудить детали',
      isNew: false,
    },
  ];

  const newNotifications = notifications.filter(n => n.isNew);
  const viewedNotifications = notifications.filter(n => !n.isNew);

  const getStatusText = (status: string, type: string) => {
    if (status === 'accepted') return 'принял ваш обмен';
    if (type === 'incoming') return 'предлагает вам обмен';
    return 'ожидает ответа';
  };

  return (
    <div className={styles.notificationMenu} data-testid="notification-menu">
      <div className={styles.headerMenu}>
        <h3 className={styles.headerMenuTitle}>Новые уведомления</h3>
        <button className={styles.readAll} data-testid="read-all-btn">
          Прочитать все
        </button>
      </div>

      <div className={styles.notificationList}>
        {newNotifications.map(notification => (
          <div
            key={notification.id}
            className={styles.notificationItem}
            data-testid="new-notification"
          >
            <div className={styles.notificationHeader}>
              <img src={IdeaIcon} alt="Иконка" className={styles.icon} />
              <div className={styles.notificationInfo}>
                <div className={styles.userLine}>
                  <span className={styles.userName}>{notification.userName}</span>
                  <span className={styles.statusText}>
                    {getStatusText(notification.status, notification.type)}
                  </span>
                  <span className={styles.date}>{notification.date}</span>
                </div>
                <p className={styles.message}>{notification.message}</p>
              </div>
            </div>
            <div className={styles.notificationActions}>
              <Link
                to={notification.type === 'incoming' ? '/obmen' : '/profile'}
                className={styles.buttonNotificationMenu}
                data-testid={notification.type === 'incoming' ? 'link-to-obmen' : 'link-to-profile'}
              >
                <Button type="primary">Перейти</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {viewedNotifications.length > 0 && (
        <div className={styles.viewedSection} data-testid="viewed-section">
          <div className={styles.viewedHeader}>
            <h3 className={styles.viewedHeaderTitle}>Просмотренные</h3>
            <button className={styles.clearButton} data-testid="clear-btn">
              Очистить
            </button>
          </div>
          {viewedNotifications.map(notification => (
            <div
              key={notification.id}
              className={styles.notificationItem}
              data-testid="viewed-notification"
            >
              <div className={styles.notificationView}>
                <img src={IdeaIcon} alt="Иконка" className={styles.icon} />
                <div className={styles.notificationInfo}>
                  <div className={styles.userLine}>
                    <span className={styles.userName}>{notification.userName}</span>
                    <span className={styles.statusText}>
                      {getStatusText(notification.status, notification.type)}
                    </span>
                    <span className={styles.date}>{notification.date}</span>
                  </div>
                  <p className={styles.message}>{notification.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
