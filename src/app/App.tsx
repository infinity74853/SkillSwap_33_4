import { MainLayout } from '@/widgets/Layout/MainLayout';
import ProfileDetailsPage from '@/pages/profileDetails/ProfileDetailsPage';
import './styles/index.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { ProtectedRoute } from '@/shared/ui/protectedRoute/protectedRoute';
import { useDispatch, useSelector } from '@/services/store/store';
import { initializeLikes } from '@/services/slices/likeSlice';
import { fetchCatalog } from '@/services/slices/catalogSlice';
import { SuccessModal } from '@/features/successModal/successModal';
import { RegistrationForms } from '@/features/RegistrationForms/registrationForms';
import { ErrorPage } from '@/pages/ErrorPage/ErrorPage';
import SkillPage from '@/pages/skillPage/skillPage';
import { CatalogPage } from '@/pages/catalogPage/catalogPage';
import { fetchUser } from '@/services/thunk/authUser';
import { ProposalPreviewModal } from '@/features/auth/proposalPreviewModal/proposalPreviewModal';
import { registerUser, setStep } from '@/services/slices/registrationSlice';
import { getSkills } from '@/services/slices/skillsSlice';
import { CustomSkill } from '@/entities/skill/model/types';

function App() {
  const location = useLocation();
  const backgroundLocation = location.state && location.state.background;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(initializeLikes());
    dispatch(fetchUser());
    dispatch(fetchCatalog());
    dispatch(getSkills());
  }, [dispatch]);

  const skill = useSelector(state => {
    return {
      name: state.register.stepThreeData.skillName ?? '',
      category: state.register.stepThreeData.skillCategory ?? 'Бизнес и карьера',
      subcategory: state.register.stepThreeData.skillSubCategory?.[0] ?? 'Управление командой',
      subcategoryId: state.register.stepThreeData.skillSubCategoryId ?? 'bc001',
      description: state.register.stepThreeData.description ?? '',
      image: state.register.stepThreeData.pics ?? [],
      customSkillId: state.register.stepThreeData.customSkillId ?? '',
    } as CustomSkill;
  });

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
          <Route path="/profile/details" element={<ProfileDetailsPage />} />
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
              <RegistrationForms isRegister={false} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
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
          <Route
            path="/register/preview"
            element={
              <ProposalPreviewModal
                isOpen
                onClose={() => {
                  dispatch(setStep(3));
                  navigate(-1);
                }}
                onEdit={() => {
                  dispatch(setStep(3));
                  navigate(-1);
                }}
                skill={skill}
                onSuccess={() => {
                  dispatch(registerUser());
                  navigate('/register/success', { state: { background: location } });
                }}
              />
            }
          />
          <Route
            path="/register/success"
            element={
              <ProtectedRoute onlyUnAuth>
                <SuccessModal />
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
