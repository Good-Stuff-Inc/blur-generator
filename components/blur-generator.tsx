"use client";

import { useState, useRef, useCallback, ChangeEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Download, RefreshCw } from "lucide-react";

export function BlurGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [blurAmount, setBlurAmount] = useState<number>(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const resetImage = () => {
    setImage(null);
    setBlurAmount(5);
  };

  const downloadImage = () => {
    if (!canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const img = new Image();
    
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply blur filter
      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(img, 0, 0);
      
      // Create download link
      const link = document.createElement('a');
      link.download = 'blurred-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = image;
  };

  return (
    <div className="space-y-6">
      {!image ? (
        <ImageUpload onFileSelected={handleImageUpload} />
      ) : (
        <Card>
          <CardContent className="p-6 space-y-4">
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Original</h3>
                <div className="aspect-square relative rounded-md overflow-hidden border border-border bg-muted flex items-center justify-center">
                  <img 
                    src={image} 
                    alt="Original" 
                    className="max-h-full max-w-full object-contain" 
                  />
                </div>
              </div>
              
              {/* Blurred Image */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Blurred</h3>
                <div className="aspect-square relative rounded-md overflow-hidden border border-border bg-muted flex items-center justify-center">
                  <img 
                    src={image} 
                    alt="Blurred" 
                    className="max-h-full max-w-full object-contain"
                    style={{ filter: `blur(${blurAmount}px)` }} 
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Blur Amount: {blurAmount}px</label>
                </div>
                <Slider
                  value={[blurAmount]}
                  min={0}
                  max={20}
                  step={0.5}
                  onValueChange={(value) => setBlurAmount(value[0])}
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button onClick={downloadImage} className="flex-1 sm:flex-none">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={resetImage} className="flex-1 sm:flex-none">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
