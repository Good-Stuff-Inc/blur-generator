"use client";

import * as React from "react";
import { useDropzone, type DropzoneOptions, FileRejection } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropzoneProps extends Omit<DropzoneOptions, "disabled"> {
  className?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  showPreview?: boolean;
  value?: File[];
  onChange?: (files: File[]) => void;
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  ({ 
    className, 
    disabled = false, 
    label = "Drop files here", 
    description = "or click to select", 
    showPreview = true,
    value,
    onChange, 
    ...props 
  }, ref) => {
    const [files, setFiles] = React.useState<File[]>(value || []);
    
    // Update internal state when controlled value changes
    React.useEffect(() => {
      if (value) {
        setFiles(value);
      }
    }, [value]);

    const handleDrop = React.useCallback(
      (acceptedFiles: File[], rejectedFiles: FileRejection[], event: React.DragEvent<HTMLElement>) => {
        const newFiles = [...files, ...acceptedFiles];
        setFiles(newFiles);
        
        if (onChange) {
          onChange(newFiles);
        }
        
        if (props.onDrop) {
          props.onDrop(acceptedFiles, rejectedFiles, event);
        }
      },
      [files, onChange, props]
    );
    
    const removeFile = (index: number) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
      
      if (onChange) {
        onChange(newFiles);
      }
    };

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
      ...props,
      disabled,
      onDrop: handleDrop,
    });

    return (
      <div className={cn("grid gap-2", className)}>
        <div
          {...getRootProps()}
          ref={ref}
          className={cn(
            "group relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 px-5 py-4 text-center transition hover:bg-muted/25",
            isDragActive && "border-muted-foreground/50 bg-muted/25",
            isDragAccept && "border-primary/50 bg-primary/10",
            isDragReject && "border-destructive/50 bg-destructive/10",
            disabled && "pointer-events-none opacity-60",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <Upload className="h-8 w-8 text-muted-foreground/50" />
            <div className="text-base font-medium">{label}</div>
            <div>{description}</div>
          </div>
        </div>
        
        {showPreview && files.length > 0 && (
          <div className="grid gap-2">
            <p className="text-xs text-muted-foreground">Selected files:</p>
            <ul className="grid gap-1">
              {files.map((file, i) => (
                <li key={i} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeFile(i)}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

Dropzone.displayName = "Dropzone";

export { Dropzone };
