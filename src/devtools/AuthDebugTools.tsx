import { useAuth } from '@/features/auth/context/AuthContext';

export const AuthDebugTools = () => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        background: 'red',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      {isAuthenticated ? (
        <button onClick={logout}>Тест: Выйти</button>
      ) : (
        <button
          onClick={() =>
            login({
              id: 'test-user-123',
              name: 'Мария',
              email: 'test@example.com',
            })
          }
        >
          Тест: Войти
        </button>
      )}
      <span style={{ fontSize: '14px' }}>
        Статус: {isAuthenticated ? '✅ Авторизован' : '❌ ГостьГость'}
      </span>
    </div>
  );
};
