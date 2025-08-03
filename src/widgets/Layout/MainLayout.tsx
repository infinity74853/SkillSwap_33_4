import { AuthProvider } from '@/features/auth/context/AuthContext';
import { Header } from '@/widgets/Header/Header';
import { Footer } from '@/widgets/Footer/Footer';
import { Outlet } from 'react-router-dom';

import { AuthDebugTools } from '@/devtools/AuthDebugTools';

export const MainLayout = () => {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      {import.meta.env.DEV && <AuthDebugTools />}
    </AuthProvider>
  );
};
