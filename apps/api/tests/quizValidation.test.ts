import { describe, it, expect } from 'vitest';
import { aiGeneratedQuizOutputSchema } from '@skill-setu/shared';

describe('AI Quiz Generation Schema Validation', () => {
  it('successfully validates well-formed quiz JSON from AI model', () => {
    const validJson = {
      quizTitle: 'Advanced SQL Window Functions',
      description: 'Practice quiz covering analytical ranking and window clauses.',
      questions: [
        {
          questionText: 'What is the main distinction between RANK() and DENSE_RANK() in SQL?',
          type: 'single_mcq',
          difficulty: 'intermediate',
          options: [
            { id: 'opt1', text: 'RANK() skips numbers on ties; DENSE_RANK() does not.' },
            { id: 'opt2', text: 'DENSE_RANK() is only supported in SQLite.' }
          ],
          correctAnswers: ['opt1'],
          explanation: 'RANK leaves numerical gaps when duplicates occur; DENSE_RANK maintains contiguous numbering.',
          topicTag: 'Window Functions'
        }
      ]
    };

    const parsed = aiGeneratedQuizOutputSchema.safeParse(validJson);
    expect(parsed.success).toBe(true);
  });

  it('rejects malformed quiz JSON with missing options or invalid question types', () => {
    const invalidJson = {
      quizTitle: 'Invalid Quiz',
      description: 'Incomplete question set',
      questions: [
        {
          questionText: 'Short',
          type: 'invalid_type', // Must be single_mcq, multi_mcq, or true_false
          difficulty: 'intermediate',
          options: [{ id: 'opt1', text: 'Only one option' }], // Needs at least 2 options
          correctAnswers: [],
          explanation: 'None',
          topicTag: 'SQL'
        }
      ]
    };

    const parsed = aiGeneratedQuizOutputSchema.safeParse(invalidJson);
    expect(parsed.success).toBe(false);
  });
});

describe('Document Upload Validation & Error Paths', () => {
  it('rejects file larger than 4 MB with plain error message', async () => {
    const { validateFileMetadata } = await import('../src/services/fileExtractionService');
    const oversizeBytes = 4.2 * 1024 * 1024; // 4.2 MB > 4 MB

    expect(() => {
      validateFileMetadata('draft_01.pdf', 'application/pdf', oversizeBytes);
    }).toThrow(/File size .* exceeds maximum allowed limit of 4 MB/);
  });

  it('rejects unsupported file extension with plain error message', async () => {
    const { validateFileMetadata } = await import('../src/services/fileExtractionService');

    expect(() => {
      validateFileMetadata('payload.exe', 'application/octet-stream', 1024);
    }).toThrow('Unsupported file format. Please upload a PDF, DOCX, PPTX, or TXT file.');
  });

  it('detects scanned / image-only PDF with no extractable text and returns distinct message', async () => {
    const { extractTextFromBuffer } = await import('../src/services/fileExtractionService');
    const { jsPDF } = await import('jspdf');

    // Create image-only PDF with zero text operators
    const scannedDoc = new jsPDF();
    const dummyBase64Jpg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
    scannedDoc.addImage(dummyBase64Jpg, 'JPEG', 10, 10, 100, 100);
    const scannedPdfBuf = Buffer.from(scannedDoc.output('arraybuffer'));

    await expect(
      extractTextFromBuffer(scannedPdfBuf, 'scanned_doc.pdf', 'application/pdf')
    ).rejects.toThrow(/No readable text found in document/);
  });

  it('successfully extracts text from valid study notes document', async () => {
    const { extractTextFromBuffer, validateFileMetadata } = await import('../src/services/fileExtractionService');
    const { generateQuizPdf } = await import('../src/services/quizExportService');

    const samplePdfBuf = generateQuizPdf({
      title: 'Database Transactions & ACID Properties',
      description: 'Concurrency control and isolation levels.',
      difficulty: 'intermediate',
      totalQuestions: 1,
      questions: [
        {
          questionNumber: 1,
          questionText: 'What does Atomicity ensure?',
          type: 'single_mcq',
          options: [{ id: 'opt1', text: 'All operations succeed or none do' }],
          correctAnswers: ['opt1'],
          explanation: 'All-or-nothing execution',
          topicTag: 'Transactions'
        }
      ]
    });

    validateFileMetadata('sample_notes.pdf', 'application/pdf', samplePdfBuf.length);
    const text = await extractTextFromBuffer(samplePdfBuf, 'sample_notes.pdf', 'application/pdf');

    expect(text.length).toBeGreaterThan(20);
    expect(text).toContain('Database Transactions & ACID Properties');
  });
});
