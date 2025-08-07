import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';
import { AuthProvider } from '../../features/auth/context/AuthContext';

// Объявляем все моки с помощью vi.hoisted
const mockUserPanel = vi.hoisted(() =>
  vi.fn(() => <div data-testid="user-panel-mock">UserPanel Mock</div>),
);
const mockGuestPanel = vi.hoisted(() =>
  vi.fn(() => (
    <div data-testid="guest-panel-mock">
      <button>Login</button>
      <button>Register</button>
    </div>
  )),
);
const mockLogo = vi.hoisted(() => vi.fn(() => <img alt="logo" src="/logo.png" />));
const mockSearchInput = vi.hoisted(() =>
  vi.fn(({ value }: { value: string }) => (
    <input type="text" value={value} readOnly data-testid="search-input" />
  )),
);
const mockUseSelector = vi.hoisted(() => vi.fn());
const mockUseDispatch = vi.hoisted(() => vi.fn(() => () => {}));

// Настраиваем мокирование модулей перед всеми тестами
beforeAll(() => {
  vi.mock('@/features/auth/ui/UserPanel/UserPanel', () => ({
    UserPanel: mockUserPanel,
  }));

  vi.mock('@/features/auth/ui/GuestPanel/GuestPanel', () => ({
    GuestPanel: mockGuestPanel,
  }));

  vi.mock('@/shared/ui/Logo/Logo', () => ({
    Logo: mockLogo,
  }));

  vi.mock('@/shared/ui/SearchInput/SearchInput', () => ({
    SearchInput: mockSearchInput,
  }));

  vi.mock('@/services/store/store', () => ({
    useSelector: mockUseSelector,
    useDispatch: mockUseDispatch,
    RootState: {},
  }));
});

describe('Header Component', () => {
  beforeEach(() => {
    // Мокаем window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Мокаем localStorage
    Storage.prototype.getItem = vi.fn(key => {
      if (key === 'theme') return 'light';
      return null;
    });

    // Сбрасываем моки
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    mockUseSelector.mockImplementation(selector => {
      if (selector.toString().includes('selectUser')) {
        return null;
      }
      return '';
    });

    render(
      <AuthProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </AuthProvider>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains logo', () => {
    mockUseSelector.mockImplementation(selector => {
      if (selector.toString().includes('selectUser')) {
        return null;
      }
      return '';
    });

    render(
      <AuthProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </AuthProvider>,
    );

    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });

  it('shows auth buttons when not authenticated', () => {
    mockUseSelector.mockImplementation(selector => {
      if (selector.toString().includes('selectUser')) {
        return null;
      }
      return '';
    });

    render(
      <AuthProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </AuthProvider>,
    );

    expect(screen.getByTestId('guest-panel-mock')).toBeInTheDocument();
  });
});
