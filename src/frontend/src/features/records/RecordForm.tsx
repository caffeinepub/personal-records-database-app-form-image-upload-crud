import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RecordImageField } from './RecordImageField';
import { validateRecordForm, type ValidationError } from './validators';
import type { RecordFormData } from './types';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface RecordFormProps {
  initialData?: RecordFormData;
  onSubmit: (data: RecordFormData, imageFile?: File) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function RecordForm({ initialData, onSubmit, onCancel, isSubmitting }: RecordFormProps) {
  const [formData, setFormData] = useState<RecordFormData>(
    initialData || {
      name: '',
      mobileNumber: '',
      dateOfBirth: '',
      education: '',
      height: '',
      weight: '',
      hobby: '',
      city: '',
    }
  );
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [backendError, setBackendError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof RecordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError('');
    setUploadProgress(0);

    // Client-side validation
    const validationErrors = validateRecordForm({
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      dateOfBirth: formData.dateOfBirth,
      height: formData.height,
      weight: formData.weight,
      imageFile,
    });

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    try {
      await onSubmit(formData, imageFile);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setBackendError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {backendError && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">{backendError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={isSubmitting}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobileNumber">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mobileNumber"
            value={formData.mobileNumber}
            onChange={(e) => handleChange('mobileNumber', e.target.value)}
            disabled={isSubmitting}
            className={errors.mobileNumber ? 'border-destructive' : ''}
          />
          {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            Date of Birth <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            disabled={isSubmitting}
            className={errors.dateOfBirth ? 'border-destructive' : ''}
          />
          {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (in)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            disabled={isSubmitting}
            className={errors.height ? 'border-destructive' : ''}
          />
          {errors.height && <p className="text-sm text-destructive">{errors.height}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            disabled={isSubmitting}
            className={errors.weight ? 'border-destructive' : ''}
          />
          {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Education</Label>
        <Input
          id="education"
          value={formData.education}
          onChange={(e) => handleChange('education', e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hobby">Hobby</Label>
        <Textarea
          id="hobby"
          value={formData.hobby}
          onChange={(e) => handleChange('hobby', e.target.value)}
          disabled={isSubmitting}
          rows={3}
        />
      </div>

      <RecordImageField
        value={imageFile}
        existingImage={formData.existingImage}
        onChange={setImageFile}
        error={errors.imageFile}
        disabled={isSubmitting}
      />

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <Label>Upload Progress</Label>
          <Progress value={uploadProgress} />
          <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Record' : 'Create Record'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
