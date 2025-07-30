import { Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { MainLayout } from '@/widgets/Layout/MainLayout';
import TextTestComponent from '@/widgets/TestComponent/TestComponent';
import Catalog from '@/widgets/catalog/catalog';
import { ProtectedRoute } from '@/shared/ui/protectedRoute/protectedRoute';
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
    <Suspense fallback={<></> /*Loader, когда будет готов*/}>
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

          <Route path="/success" element={<SuccessModal />} />

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
                <>{/* Страница подробной информации в профиле */}</>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/favorites"
            element={
              <ProtectedRoute>
                <>{/* Страница избранных карточек */}</>
              </ProtectedRoute>
            }
          />

          <Route path="/skill/:id" element={<SkillPage />} />
        </Route>

        {/* Отдельные маршруты для модалок */}
        {backgroundLocation && (
          <Route>
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
          </Route>
        )}
      </Routes>
    </Suspense>
  );
}

export default App;
