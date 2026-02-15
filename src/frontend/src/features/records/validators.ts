export interface ValidationError {
  field: string;
  message: string;
}

export function validateRecordForm(data: {
  name: string;
  mobileNumber: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  imageFile?: File;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.trim().length < 3) {
    errors.push({ field: 'name', message: 'Name must be at least 3 characters' });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
  }

  // Mobile number validation
  if (!data.mobileNumber.trim()) {
    errors.push({ field: 'mobileNumber', message: 'Mobile number is required' });
  } else if (!/^\d+$/.test(data.mobileNumber.trim())) {
    errors.push({ field: 'mobileNumber', message: 'Mobile number must contain only digits' });
  } else if (data.mobileNumber.trim().length < 8 || data.mobileNumber.trim().length > 15) {
    errors.push({ field: 'mobileNumber', message: 'Mobile number must be between 8 and 15 digits' });
  }

  // Date of birth validation
  if (!data.dateOfBirth.trim()) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth is required' });
  } else if (!data.dateOfBirth.includes('-')) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth must be a valid date' });
  }

  // Height validation (optional)
  if (data.height.trim()) {
    const heightNum = parseInt(data.height, 10);
    if (isNaN(heightNum)) {
      errors.push({ field: 'height', message: 'Height must be a number' });
    } else if (heightNum < 80 || heightNum > 250) {
      errors.push({ field: 'height', message: 'Height must be between 80 and 250 cm' });
    }
  }

  // Weight validation (optional)
  if (data.weight.trim()) {
    const weightNum = parseInt(data.weight, 10);
    if (isNaN(weightNum)) {
      errors.push({ field: 'weight', message: 'Weight must be a number' });
    } else if (weightNum < 40 || weightNum > 400) {
      errors.push({ field: 'weight', message: 'Weight must be between 40 and 400 kg' });
    }
  }

  // Image size validation (5MB limit)
  if (data.imageFile && data.imageFile.size > 5 * 1024 * 1024) {
    errors.push({ field: 'imageFile', message: 'Image size must be less than 5MB' });
  }

  return errors;
}
