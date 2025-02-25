"use client";

import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Define allowed image types and max size (5MB)
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ImageUploadProps {
  onFileSelected: (file: File) => void;
}

export function ImageUpload({ onFileSelected }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(`Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.`);
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 5MB limit.`);
      return false;
    }

    return true;
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          onFileSelected(file);
        } else if (error) {
          toast.error(error);
        }
      }
    },
    [onFileSelected, error]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          onFileSelected(file);
        } else if (error) {
          toast.error(error);
        }
      }
    },
    [onFileSelected, error]
  );

  return (
    <Card
      className={`border-2 border-dashed ${
        isDragging ? "border-primary bg-primary/5" : "border-border"
      } transition-colors duration-200`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 text-center min-h-[300px]">
        <div className="rounded-full bg-primary/10 p-4">
          <ImageIcon className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Upload an image</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop an image here, or click to select a file
          </p>
          <p className="text-xs text-muted-foreground">
            Accepted formats: JPEG, PNG, GIF, WebP (max 5MB)
          </p>
        </div>
        <div className="flex gap-2">
          <label htmlFor="file-upload">
            <input
              id="file-upload"
              type="file"
              className="sr-only"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileInput}
            />
            <Button
              type="button"
              className="cursor-pointer"
              variant="secondary"
              asChild
            >
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Select Image
              </span>
            </Button>
          </label>
        </div>
        {error && (
          <div className="flex items-center text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
