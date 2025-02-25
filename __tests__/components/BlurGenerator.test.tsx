import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import { BlurGenerator } from '@/components/blur-generator';
import '@testing-library/jest-dom';

// Mock the ImageUpload component to simplify testing
jest.mock('@/components/image-upload', () => ({
  ImageUpload: ({ onFileSelected }: { onFileSelected: (file: File) => void }) => (
    <button data-testid="mock-image-upload" onClick={() => {
      const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
      onFileSelected(file);
    }}>
      Mock Upload
    </button>
  ),
}));

describe('BlurGenerator Component', () => {
  // Create a mock image URL
  const mockImageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  
  // Mock FileReader
  let originalFileReader: typeof FileReader;
  const mockFileReaderInstance: Partial<FileReader> = {
    onload: jest.fn(),
    readAsDataURL: jest.fn(),
    error: null,
    readyState: 0,
    result: null,
    abort: jest.fn(),
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    removeEventListener: jest.fn(),
  };
  
  beforeEach(() => {
    originalFileReader = global.FileReader;
    
    // Create a mock FileReader
    global.FileReader = jest.fn().mockImplementation(() => mockFileReaderInstance as FileReader) as unknown as typeof FileReader & { EMPTY: 0; LOADING: 1; DONE: 2; };
    (global.FileReader as any).EMPTY = 0;
    (global.FileReader as any).LOADING = 1;
    (global.FileReader as any).DONE = 2;
  });
  
  afterEach(() => {
    global.FileReader = originalFileReader;
    jest.clearAllMocks();
  });
  
  it('renders upload interface initially', () => {
    render(<BlurGenerator />);
    expect(screen.getByTestId('mock-image-upload')).toBeInTheDocument();
  });
  
  it('renders blur interface after image upload', async () => {
    // Arrange
    render(<BlurGenerator />);
    
    // Act - Trigger file selection and manually call onload
    await act(async () => {
      fireEvent.click(screen.getByTestId('mock-image-upload'));
      // Simulate the FileReader onload event
      const event = new ProgressEvent('load', {
        lengthComputable: false,
        loaded: 0,
        total: 0,
      }) as ProgressEvent<FileReader>;
      Object.defineProperty(event, 'target', { value: { result: mockImageUrl } });
      Object.defineProperty(event, 'currentTarget', { value: { result: mockImageUrl } });
      mockFileReaderInstance.onload!.call(mockFileReaderInstance as FileReader, event);
    });
    
    // Assert - Check the element is in the blur generator mode
    expect(screen.getByText(/Blur Amount:/)).toBeInTheDocument();
    expect(screen.getByText(/Original/)).toBeInTheDocument();
    expect(screen.getByText(/Blurred/)).toBeInTheDocument();
    expect(screen.queryByTestId('mock-image-upload')).not.toBeInTheDocument();
  });
  
  it('resets back to upload interface when Reset button is clicked', async () => {
    // Arrange
    render(<BlurGenerator />);
    
    // Act - Trigger file selection and manually call onload
    await act(async () => {
      fireEvent.click(screen.getByTestId('mock-image-upload'));
      const event = new ProgressEvent('load', {
        lengthComputable: false,
        loaded: 0,
        total: 0,
      }) as ProgressEvent<FileReader>;
      Object.defineProperty(event, 'target', { value: { result: mockImageUrl } });
      Object.defineProperty(event, 'currentTarget', { value: { result: mockImageUrl } });
      mockFileReaderInstance.onload!.call(mockFileReaderInstance as FileReader, event);
    });
    
    // Find and click the Reset button
    const resetButtonElement = screen.getByText(/Reset/);
    expect(resetButtonElement).toBeInTheDocument();
    
    await act(async () => {
      fireEvent.click(resetButtonElement);
    });
    
    // Assert - We should be back at the upload view
    expect(screen.getByTestId('mock-image-upload')).toBeInTheDocument();
  });
});