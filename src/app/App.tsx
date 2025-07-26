import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/index.css';
import { Header } from '@/widgets/Header/Header';
import { Footer } from '@/widgets/Footer/Footer';
import TextTestComponent from '@/widgets/TestComponent/TestComponent';
import Catalog from '@/widgets/catalog/catalog';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<TextTestComponent />} />
          </Routes>
          <Catalog isAuthenticated={false} />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
