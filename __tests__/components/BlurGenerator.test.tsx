import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import { BlurGenerator } from '@/components/blur-generator';

// Mock the ImageUpload component to simplify testing
jest.mock('@/components/image-upload', () => ({
  ImageUpload: ({ onFileSelected }) => (
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
  let originalFileReader;
  let mockFileReaderInstance;
  
  beforeEach(() => {
    originalFileReader = global.FileReader;
    
    // Create a mock FileReader
    mockFileReaderInstance = {
      readAsDataURL: jest.fn(),
      onload: null,
      result: mockImageUrl,
    };
    
    global.FileReader = jest.fn().mockImplementation(() => mockFileReaderInstance);
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
      mockFileReaderInstance.onload({ target: { result: mockImageUrl } });
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
      mockFileReaderInstance.onload({ target: { result: mockImageUrl } });
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