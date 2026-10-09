import { act, renderHook } from '@testing-library/react';
import useTheme from './useTheme';

const originalMatchMedia = window.matchMedia;
let media;
let listeners;

beforeEach(() => {
  localStorage.clear();
  listeners = new Set();
  media = {
    matches: false,
    addEventListener: jest.fn((event, listener) => listeners.add(listener)),
    removeEventListener: jest.fn((event, listener) => listeners.delete(listener)),
  };
  window.matchMedia = jest.fn(() => media);
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  localStorage.clear();
  jest.restoreAllMocks();
});

test('inicia escuro quando não há preferência declarada', () => {
  const { result } = renderHook(() => useTheme());
  expect(result.current[0]).toBe('auto');
  expect(document.documentElement.dataset.theme).toBe('dark');
});

test('segue a preferência clara do dispositivo e acompanha mudanças', () => {
  media.matches = true;
  const { unmount } = renderHook(() => useTheme());
  expect(document.documentElement.dataset.theme).toBe('light');
  act(() => {
    media.matches = false;
    listeners.forEach(listener => listener());
  });
  expect(document.documentElement.dataset.theme).toBe('dark');
  unmount();
  expect(listeners.size).toBe(0);
});

test('mantém a escolha manual entre visitas e permite voltar ao automático', () => {
  media.matches = true;
  const first = renderHook(() => useTheme());
  act(() => first.result.current[1]('dark'));
  expect(localStorage.getItem('blog-theme')).toBe('dark');
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(listeners.size).toBe(0);
  first.unmount();
  const next = renderHook(() => useTheme());
  expect(next.result.current[0]).toBe('dark');
  act(() => next.result.current[1]('auto'));
  expect(localStorage.getItem('blog-theme')).toBeNull();
  expect(document.documentElement.dataset.theme).toBe('light');
});

test('usa escuro em navegadores sem matchMedia', () => {
  window.matchMedia = undefined;
  renderHook(() => useTheme());
  expect(document.documentElement.dataset.theme).toBe('dark');
});

test('permite trocar o tema mesmo com armazenamento bloqueado', () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  const { result } = renderHook(() => useTheme());
  act(() => result.current[1]('light'));
  expect(document.documentElement.dataset.theme).toBe('light');
});
