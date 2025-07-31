import { Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { MainLayout } from '@/widgets/Layout/MainLayout';
import TextTestComponent from '@/widgets/TestComponent/TestComponent';
import Catalog from '@/widgets/catalog/catalog';
import { ProtectedRoute } from '@/shared/ui/protectedRoute/protectedRoute';
import { RegistrationForms } from '@/features/RegistrationForms/registrationForms';
// import { ErrorPage } from '@/pages/ErrorPage/ErrorPage';
import SkillPage from '@/pages/skillPage/skillPage';
import { useDispatch } from './providers/store/store';
import { initializeLikes } from '@/services/slices/likeSlice';
import './styles/index.css';
import { SuccessModal } from '@/features/successModal/successModal';

function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeLikes());
  }, [dispatch]);

  return (
    <Suspense fallback={<></> /* Loader будет добавлен позже */}>
      <Routes>
        {/* Основные маршруты */}
        <Route element={<MainLayout />}>
          {/* Главная страница с каталогом */}
          <Route
            path="/"
            element={
              <>
                <TextTestComponent />
                <Catalog isAuthenticated={false} />
              </>
            }
          />

          {/* Маршрут для модалки успеха */}
          <Route path="/success" element={<SuccessModal />} />

          {/* Страница регистрации */}
          <Route path="/register" element={<RegistrationForms />} />

          {/* Страница входа */}
          <Route
            path="/login"
            element={
              <ProtectedRoute onlyUnAuth>
                <>{/* Компонент входа будет добавлен позже */}</>
              </ProtectedRoute>
            }
          />

          {/* Профиль пользователя */}
          <Route
            path="/profile/details"
            element={
              <ProtectedRoute>
                <>{/* Компонент профиля будет добавлен позже */}</>
              </ProtectedRoute>
            }
          />

          {/* Избранное пользователя */}
          <Route
            path="/profile/favorites"
            element={
              <ProtectedRoute>
                <>{/* Компонент избранного будет добавлен позже */}</>
              </ProtectedRoute>
            }
          />

          {/* Страница навыка */}
          <Route path="/skill/:id" element={<SkillPage />} />
        </Route>

        {/* Отдельные маршруты для модалок (рендерятся поверх основного контента) */}
        {backgroundLocation && (
          <Routes>
            <Route
              path="/register/preview"
              element={
                <ProtectedRoute onlyUnAuth>
                  <>{/* Модалка превью регистрации будет добавлена позже */}</>
                </ProtectedRoute>
              }
            />
            <Route
              path="/register/success"
              element={
                <ProtectedRoute onlyUnAuth>
                  <>{/* Модалка успешной регистрации будет добавлена позже */}</>
                </ProtectedRoute>
              }
            />
            <Route
              path="/offer/:id/success"
              element={
                <ProtectedRoute>
                  <>{/* Модалка успешного предложения будет добавлена позже */}</>
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </Routes>
    </Suspense>
  );
}

export default App;
