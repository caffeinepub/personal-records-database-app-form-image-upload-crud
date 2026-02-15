import type { Data } from '../../backend';
import { ExternalBlob } from '../../backend';

export interface RecordFormData {
  name: string;
  mobileNumber: string;
  dateOfBirth: string;
  education: string;
  height: string;
  weight: string;
  hobby: string;
  city: string;
  imageFile?: File;
  existingImage?: ExternalBlob;
}

export function formDataToBackend(formData: RecordFormData, imageBlob?: ExternalBlob): Data {
  return {
    name: formData.name,
    mobileNumber: formData.mobileNumber,
    dateOfBirth: formData.dateOfBirth,
    education: formData.education.trim() ? formData.education : undefined,
    height: formData.height.trim() ? BigInt(formData.height) : undefined,
    weight: formData.weight.trim() ? BigInt(formData.weight) : undefined,
    hobby: formData.hobby.trim() ? formData.hobby : undefined,
    city: formData.city.trim() ? formData.city : undefined,
    image: imageBlob || formData.existingImage || undefined,
  };
}

export function backendToFormData(data: Data): RecordFormData {
  return {
    name: data.name,
    mobileNumber: data.mobileNumber,
    dateOfBirth: data.dateOfBirth,
    education: data.education || '',
    height: data.height ? data.height.toString() : '',
    weight: data.weight ? data.weight.toString() : '',
    hobby: data.hobby || '',
    city: data.city || '',
    existingImage: data.image,
  };
}
