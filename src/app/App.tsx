import { Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { MainLayout } from '@/widgets/Layout/MainLayout';
import { ProtectedRoute } from '@/shared/ui/protectedRoute/protectedRoute';
import { useDispatch } from '@/services/store/store';
import { initializeLikes } from '@/services/slices/likeSlice';
import { SuccessModal } from '@/features/successModal/successModal';
import { RegistrationForms } from '@/features/registrationForms/registrationForms';
import { ErrorPage } from '@/pages/ErrorPage/ErrorPage';
import SkillPage from '@/pages/skillPage/skillPage';
import { CatalogPage } from '@/pages/catalogPage/catalogPage';
import './styles/index.css';

function App() {
  const location = useLocation();
  const backgroundLocation = location.state && location.state.background;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeLikes());
  }, [dispatch]);

  return (
    <Suspense fallback={<></> /*Loader, когда будет готов*/}>
      {/* 
        Основной блок <Routes> для отображения страниц.
        Мы передаем ему `location={backgroundLocation || location}`.
        Это "замораживает" фоновую страницу, когда модальное окно активно.
      */}
      <Routes location={backgroundLocation || location}>
        {/*
          Маршруты, которые используют основной Layout.
          Все вложенные Route будут рендериться внутри <MainLayout />
        */}
        <Route path="/" element={<MainLayout />}>
          {/* index-маршрут для корневого пути "/" */}
          <Route index element={<CatalogPage />} />

          <Route
            path="/profile/details"
            element={
              <ProtectedRoute>
                <>{/* Страница подробной информации в профиле, когда будет готова */}</>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/favorites"
            element={
              <ProtectedRoute>
                <>{/* Страница избранных карточек в профиле, когда будет готова */}</>
              </ProtectedRoute>
            }
          />
          <Route path="/skill/:id" element={<SkillPage />} />
          <Route path="*" element={<ErrorPage type="404"></ErrorPage>} />
        </Route>

        {/* 
          Маршруты, которые НЕ используют MainLayout (например, страницы входа и регистрации).
          Они находятся на том же уровне, что и <Route path="/" element={<MainLayout />}>.
        */}
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <>{/* Страница логина, когда будет готова */}</>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              {/* Я поместил сюда RegistrationForms, так как это логичное место для страницы регистрации */}
              <RegistrationForms />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* 
        Этот блок отвечает за отображение МОДАЛЬНЫХ ОКОН.
        Он рендерится только если в `location.state` есть `background`.
        Это позволяет показывать модальное окно поверх основной страницы.
      */}
      {backgroundLocation && (
        <Routes>
          {/* Руты для модалок */}
          <Route path="/success" element={<SuccessModal />} />
          <Route
            path="/register/preview"
            element={
              <ProtectedRoute onlyUnAuth>
                <>{/* Модалка с превью своего предложения */}</>
              </ProtectedRoute>
            }
          />
          <Route
            path="/register/success"
            element={
              <ProtectedRoute onlyUnAuth>
                <>{/* Модалка об успешной регистрации */}</>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offer/:id/success"
            element={
              <ProtectedRoute>
                <>{/* Модалка о созданном предложении обмена */}</>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </Suspense>
  );
}

export default App;
