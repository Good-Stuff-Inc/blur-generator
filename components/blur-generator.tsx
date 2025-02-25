"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Download, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";

export function BlurGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [blurAmount, setBlurAmount] = useState<number>(5);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Clean up object URLs on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (image && image.startsWith('blob:')) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleImageUpload = useCallback((file: File) => {
    // Revoke previous object URL if it exists
    if (image && image.startsWith('blob:')) {
      URL.revokeObjectURL(image);
    }
    
    try {
      // Create object URL instead of using FileReader for better security
      const objectUrl = URL.createObjectURL(file);
      setImage(objectUrl);
    } catch (error) {
      toast.error("Failed to process the image. Please try again.");
      console.error("Error processing image:", error);
    }
  }, [image]);

  const resetImage = () => {
    // Revoke object URL if it exists
    if (image && image.startsWith('blob:')) {
      URL.revokeObjectURL(image);
    }
    setImage(null);
    setBlurAmount(5);
  };

  const downloadImage = async () => {
    if (!canvasRef.current || !image) return;
    
    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const img = new Image();
      
      // Create a promise to handle the image loading
      const imageLoaded = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = image;
      });
      
      // Wait for the image to load
      await imageLoaded;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }
      
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply blur filter
      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(img, 0, 0);
      
      // Create download link with a timestamped filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const link = document.createElement('a');
      link.download = `blurred-image-${timestamp}.png`;
      
      // Use toBlob for better memory management with large images
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("Failed to create image blob");
        }
        
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.click();
        
        // Clean up after download starts
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);
        
        toast.success("Image downloaded successfully!");
      }, 'image/png');
      
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download the image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Banner */}
      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="p-4 flex items-center space-x-3">
          <Shield className="h-5 w-5 text-primary" />
          <p className="text-sm">
            All image processing is done locally in your browser. Your images are never uploaded to any server.
          </p>
        </CardContent>
      </Card>
      
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
                <Button 
                  onClick={downloadImage} 
                  className="flex-1 sm:flex-none"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetImage} 
                  className="flex-1 sm:flex-none"
                  disabled={isProcessing}
                >
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
