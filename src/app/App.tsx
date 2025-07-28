import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/widgets/Layout/MainLayout';
import TextTestComponent from '@/widgets/TestComponent/TestComponent';
import Catalog from '@/widgets/catalog/catalog';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
