import { MainLayout } from '@/widgets/Layout/MainLayout';
import ProfileDetailsPage from '@/pages/profileDetails/ProfileDetailsPage';
import TextTestComponent from '@/widgets/TestComponent/TestComponent';
import Catalog from '@/widgets/catalog/catalog';
import './styles/index.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { ProtectedRoute } from '@/shared/ui/protectedRoute/protectedRoute';
import store, { useDispatch } from '@/services/store/store';
import { initializeLikes } from '@/services/slices/likeSlice';
import { SuccessModal } from '@/features/successModal/successModal';
import { RegistrationForms } from '@/features/registrationForms/registrationForms';
import { ErrorPage } from '@/pages/ErrorPage/ErrorPage';
import SkillPage from '@/pages/skillPage/skillPage';
import { CatalogPage } from '@/pages/catalogPage/catalogPage';
import './styles/index.css';
import { fetchCatalog } from '@/services/slices/catalogSlice';

function App() {
  const location = useLocation();
  const backgroundLocation = location.state && location.state.background;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeLikes());
  }, [dispatch]);

  store.dispatch(fetchCatalog());

  return (
    <Suspense fallback={<></> /*Loader, когда будет готов*/}>
      <Routes>
        <Route element={<MainLayout />}>
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
      </Routes>
    </BrowserRouter>
        {/* <Route path="/" element={<TextTestComponent />} /> */}
        <Route path="/" element={<SuccessModal />} />
        {/* <Route path="/*" element={<ErrorPage type="404"></ErrorPage>} /> */}
        <Route path="/" element={<></> /*Каталог карточек, когда будет готов */} />
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
              <>{/* Страница регистрации, когда будет готова */}</>
            </ProtectedRoute>
          }
        />
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
      </Routes>

      {/* 
        Этот блок отвечает за отображение МОДАЛЬНЫХ ОКОН.
        Он рендерится только если в `location.state` есть `background`.
        Это позволяет показывать модальное окно поверх основной страницы.
      */}
      {backgroundLocation && (
        <Routes /* Руты для модалок */>
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
                <></>
              </ProtectedRoute> /* Модалка с уведомлением о созданном предложении обмена */
            }
          />
        </Routes>
      )}
    </Suspense>
  );
}

export default App;
