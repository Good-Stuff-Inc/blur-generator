// Import Jest-DOM matchers
import '@testing-library/jest-dom';

// Mock for canvas-related operations
global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  drawImage: jest.fn(),
  filter: '',
}));

// Mock for createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock for window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
});