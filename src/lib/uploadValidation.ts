export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_UPLOAD_LABEL = '5 MB';

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.doc', '.docx'];

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Returns an error message, or null if the file is valid. */
export function validateUploadFile(file: File): string | null {
  if (file.size > MAX_UPLOAD_BYTES) {
    return `"${file.name}" is ${formatBytes(file.size)}. Maximum upload size is ${MAX_UPLOAD_LABEL}. Please compress the file or choose a smaller one.`;
  }

  const name = file.name.toLowerCase();
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';
  const typeOk = file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.includes('word');
  const extOk = ALLOWED_EXTENSIONS.some((e) => name.endsWith(e));

  if (!typeOk && !extOk) {
    return `"${file.name}" is not a supported type. Use PDF, JPG, PNG, or Word documents.`;
  }

  return null;
}

export function uploadErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: string }).code;
    const message = (error as { message?: string }).message;
    if (code === 'FILE_TOO_LARGE') {
      return message || `File is too large. Maximum allowed size is ${MAX_UPLOAD_LABEL}.`;
    }
    if (code === 'INVALID_FILE_TYPE') {
      return message || 'File type not allowed. Use PDF, JPG, PNG, or Word documents.';
    }
    if (code === 'NO_FILE') {
      return message || 'No file was uploaded. Please try again.';
    }
  }
  if (error instanceof Error) return error.message;
  return 'Upload failed. Please try again.';
}
