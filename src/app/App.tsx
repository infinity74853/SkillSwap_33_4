import { Route, Routes, useLocation } from 'react-router-dom';
import './styles/index.css';
import { Suspense } from 'react';
import { ProtectedRoute } from '@/shared/ui/protectedRoute/protectedRoute';
import SkillPage from '@/pages/skillPage/skillPage';
// import { ErrorPage } from '@/pages/ErrorPage/ErrorPage';

function App() {
  /* const navigate = useNavigate(); на будущее для модалок */
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  return (
    <Suspense fallback={<></> /*Loader, когда будет готов*/}>
      <Routes>
        {/* <Route path="/" element={<TextTestComponent />} /> */}
        <Route path="/" element={<SkillPage />} />
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
                <>{/* Модалка с информацией об успешной регистрации */}</>
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
