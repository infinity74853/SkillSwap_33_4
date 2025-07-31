import { MainLayout } from '@/widgets/Layout/MainLayout';
import ProfileDetailsPage from '@/pages/profileDetails/ProfileDetailsPage';
import TextTestComponent from '@/widgets/TestComponent/TestComponent';
import Catalog from '@/widgets/catalog/catalog';
import './styles/index.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { ProtectedRoute } from '@/shared/ui/protectedRoute/protectedRoute';
import { SuccessModal } from 'features/successModal/successModal';
import { useDispatch } from './providers/store/store';
import { initializeLikes } from '@/services/slices/likeSlice';

function App() {
  /* const navigate = useNavigate(); на будущее для модалок */
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeLikes());
  }, [dispatch]);

  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <>
                <TextTestComponent />
                <Catalog isAuthenticated={false} />
              </>
            }
          />
        </Route>
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
        {/* Страница редактирования личных данных пользователя (без авторизации) */}
        <Route
          path="/profile/details"
          element={<ProfileDetailsPage />}
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
      {backgroundLocation && (
        <Routes>
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
                <>{/* Модалка с информацией об успешной регистрации */}</>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offer/:id/success"
            element={
              <ProtectedRoute>
                <></>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </Suspense>
  );
}

export default App;
