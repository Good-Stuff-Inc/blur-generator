"use client";

import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onFileSelected: (file: File) => void;
}

export function ImageUpload({ onFileSelected }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

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
        if (file.type.startsWith("image/")) {
          onFileSelected(file);
        }
      }
    },
    [onFileSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelected(files[0]);
      }
    },
    [onFileSelected]
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
        </div>
        <div className="flex gap-2">
          <label htmlFor="file-upload">
            <input
              id="file-upload"
              type="file"
              className="sr-only"
              accept="image/*"
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
      </CardContent>
    </Card>
  );
}
