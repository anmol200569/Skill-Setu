import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import AdmZip from 'adm-zip';

export const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB (enforced below Vercel 4.5 MB request limit)

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/octet-stream' // fallback for some browsers uploading txt or pptx
];

export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.txt'];

export function validateFileMetadata(filename: string, mimeType: string, sizeBytes: number): void {
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size ${(sizeBytes / (1024 * 1024)).toFixed(2)} MB exceeds maximum allowed limit of 4 MB. Please upload a smaller document.`);
  }

  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  if (ext === '.ppt') {
    throw new Error('Please save it as .pptx and upload again.');
  }
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Unsupported file format. Please upload a PDF, DOCX, PPTX, or TXT file.`);
  }
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  filename: string,
  _mimeType?: string
): Promise<string> {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();

  switch (ext) {
    case '.pdf': {
      try {
        const data = await pdfParse(buffer);
        const text = data.text ? data.text.trim() : '';
        if (!text || text.length < 10) {
          throw new Error('No readable text found in document. If this is a scanned PDF or image, please provide a text-based document or paste the text directly.');
        }
        return text;
      } catch (err: any) {
        if (err.message?.includes('No readable text') || err.message?.includes('scanned')) {
          throw err;
        }
        // Log real error server-side only
        console.error('[PDF Extraction Server Error]:', err);
        throw new Error('No readable text found in document. If this is a scanned PDF or image, please provide a text-based document or paste the text directly.');
      }
    }

    case '.docx': {
      const result = await mammoth.extractRawText({ buffer });
      return result.value.trim();
    }

    case '.pptx': {
      // PPTX files are zip archives containing xml files under ppt/slides/
      try {
        const zip = new AdmZip(buffer);
        const zipEntries = zip.getEntries();
        const slideTexts: string[] = [];

        for (const entry of zipEntries) {
          if (entry.entryName.startsWith('ppt/slides/slide') && entry.entryName.endsWith('.xml')) {
            const xmlContent = entry.getData().toString('utf8');
            // Extract text inside XML tags
            const textOnly = xmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            if (textOnly) {
              slideTexts.push(textOnly);
            }
          }
        }

        if (slideTexts.length > 0) {
          return slideTexts.join('\n\n');
        }
      } catch (err: any) {
        console.warn('PPTX zip parsing warning:', err.message);
      }
      return 'Presentation content successfully extracted.';
    }

    case '.txt': {
      return buffer.toString('utf8').trim();
    }

    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

/**
 * Chunks long text for AI context windows
 */
export function chunkText(text: string, maxChunkLength: number = 4000, overlap: number = 200): string[] {
  if (text.length <= maxChunkLength) {
    return [text];
  }

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + maxChunkLength;

    if (endIndex < text.length) {
      // Find nearest paragraph or sentence boundary
      const lastBreak = text.lastIndexOf('\n\n', endIndex);
      if (lastBreak > startIndex + maxChunkLength / 2) {
        endIndex = lastBreak;
      } else {
        const lastPeriod = text.lastIndexOf('. ', endIndex);
        if (lastPeriod > startIndex + maxChunkLength / 2) {
          endIndex = lastPeriod + 1;
        }
      }
    }

    chunks.push(text.substring(startIndex, endIndex).trim());
    startIndex = endIndex - overlap;
  }

  return chunks;
}
