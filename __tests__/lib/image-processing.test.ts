import { applyBlur } from '@/lib/image-processing';

describe('Image Processing Utility', () => {
  it('should return a buffer when applying blur', async () => {
    const mockBuffer = Buffer.from('test image data');
    const result = await applyBlur(mockBuffer, 5);
    
    expect(Buffer.isBuffer(result)).toBe(true);
  });
  
  it('should use default blur amount when not specified', async () => {
    const mockBuffer = Buffer.from('test image data');
    const result = await applyBlur(mockBuffer);
    
    expect(Buffer.isBuffer(result)).toBe(true);
  });
});