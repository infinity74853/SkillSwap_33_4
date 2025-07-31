import { AuthProvider } from '@/features/auth/context/AuthContext';
import { Header } from '@/widgets/Header/Header';
import { Footer } from '@/widgets/Footer/Footer';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

const AuthDebugPanel = () => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        background: 'white',
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
              id: 'test-user-123', // Добавляем корректный ID
              name: 'Мария',
              email: 'test@example.com',
            })
          }
        >
          Тест: Войти
        </button>
      )}
      <span>Статус: {isAuthenticated ? 'Авторизован' : 'Гость.гость'}</span>
    </div>
  );
};

export const MainLayout = () => {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AuthDebugPanel />
    </AuthProvider>
  );
};
