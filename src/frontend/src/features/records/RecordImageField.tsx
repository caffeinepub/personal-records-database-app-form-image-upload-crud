import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import type { ExternalBlob } from '../../backend';

interface RecordImageFieldProps {
  value?: File;
  existingImage?: ExternalBlob;
  onChange: (file: File | undefined) => void;
  error?: string;
  disabled?: boolean;
}

export function RecordImageField({ value, existingImage, onChange, error, disabled }: RecordImageFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    onChange(undefined);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = preview || (existingImage && !value ? existingImage.getDirectURL() : null);

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Image</Label>
      <div className="flex flex-col gap-3">
        {displayImage && (
          <div className="relative w-full max-w-xs">
            <img
              src={displayImage}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClear}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Upload className="h-4 w-4 mr-2" />
            {displayImage ? 'Change Image' : 'Upload Image'}
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
