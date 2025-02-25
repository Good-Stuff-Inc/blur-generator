import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUpload } from '@/components/image-upload';

describe('ImageUpload Component', () => {
  const mockOnFileSelected = jest.fn();
  const setup = () => render(<ImageUpload onFileSelected={mockOnFileSelected} />);
  
  beforeEach(() => {
    mockOnFileSelected.mockClear();
  });

  it('renders upload interface correctly', () => {
    setup();
    expect(screen.getByText('Upload an image')).toBeInTheDocument();
    expect(screen.getByText('Select Image')).toBeInTheDocument();
  });

  it('handles file input change', () => {
    setup();
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });
    
    fireEvent.change(fileInput);
    expect(mockOnFileSelected).toHaveBeenCalledWith(file);
  });

  it('changes styles when dragging over', () => {
    const { container } = setup();
    const dropzone = container.querySelector('.border-dashed');
    
    expect(dropzone).not.toHaveClass('border-primary');
    
    fireEvent.dragEnter(dropzone as Element);
    expect(dropzone).toHaveClass('border-primary');
    
    fireEvent.dragLeave(dropzone as Element);
    expect(dropzone).not.toHaveClass('border-primary');
  });

  it('handles file drop correctly', () => {
    const { container } = setup();
    const dropzone = container.querySelector('.border-dashed') as Element;
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    
    // Create a mock dataTransfer object
    const dataTransfer = {
      files: [file]
    };
    
    fireEvent.drop(dropzone, { dataTransfer });
    expect(mockOnFileSelected).toHaveBeenCalledWith(file);
  });
});