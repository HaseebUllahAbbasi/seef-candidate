const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export function uploadUrl(filePath: string): string {
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
  const base = API_URL.replace(/\/api\/v1\/?$/, '');
  return `${base}${filePath.startsWith('/') ? filePath : `/${filePath}`}`;
}

export function isImageMime(mime: string): boolean {
  return mime.startsWith('image/');
}
