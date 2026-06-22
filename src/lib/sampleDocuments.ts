/** Public sample files for demo applications (upload or external link). */
export const SAMPLE_DOCUMENT_URLS = {
  pdfs: [
    'https://sample-files.com/downloads/documents/pdf/basic-text.pdf',
    'https://sample-files.com/downloads/documents/pdf/sample-pdf-letter-size.pdf',
    'https://sample-files.com/downloads/documents/pdf/sample-pdf-a4-size-65kb.pdf',
  ],
  images: [
    'https://sample-files.com/downloads/images/jpg/thumbnail_150x150_10.5kb.jpg',
    'https://sample-files.com/downloads/images/jpg/grayscale_1600x1200_188kb.jpg',
    'https://sample-files.com/downloads/images/jpg/social_square_1080x1080_235kb.jpg',
  ],
} as const;

export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function sampleUrlForDocType(type: string): string {
  const imageTypes = ['CNIC', 'PHOTOGRAPH', 'FATHER_CNIC'];
  if (imageTypes.includes(type)) return pickRandom(SAMPLE_DOCUMENT_URLS.images);
  return pickRandom(SAMPLE_DOCUMENT_URLS.pdfs);
}

export const WIZARD_DOC_TYPES = ['CNIC', 'MARKSHEET', 'DOMICILE', 'AFFIDAVIT', 'PHOTOGRAPH'] as const;

export async function autofillSampleDocuments(
  appId: string,
  apiFn: (path: string, options?: RequestInit) => Promise<unknown>,
): Promise<{ type: string; fileName: string; fileUrl: string; mimeType: string }[]> {
  const docs = [];
  for (const type of WIZARD_DOC_TYPES) {
    const url = sampleUrlForDocType(type);
    const doc = await apiFn(`/applications/${appId}/documents/link`, {
      method: 'POST',
      body: JSON.stringify({ type, url }),
    }) as { type: string; fileName: string; fileUrl: string; mimeType: string };
    docs.push(doc);
  }
  return docs;
}
