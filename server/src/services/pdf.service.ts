import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { prisma } from '../config/database';
import { execSync } from 'child_process';

/**
 * Extract text from a PDF fetched from a remote URL using PyMuPDF (Python).
 * Falls back to pdf-parse if Python extraction fails.
 */
export async function extractPdfFromUrl(url: string, maxChars = 12000): Promise<string> {
  // Download PDF to temp file
  const tmpPath = path.join(os.tmpdir(), `pdf_${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min for large PDFs
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InspectPracticeBot/1.0)' },
    });
    clearTimeout(timeoutId);
    const buffer = Buffer.from(await resp.arrayBuffer());
    fs.writeFileSync(tmpPath, buffer);

    // Try PyMuPDF (Python) first — use Hermes venv python3 which has fitz
    const pyScriptPath = path.join(process.env.HOME || '/home/chuck', '.hermes/profiles/orchestrator/scripts/pdf_extract.py');
    const pythonPath = '/home/chuck/.hermes/hermes-agent/venv/bin/python3';
    const result = execSync(`"${pythonPath}" "${pyScriptPath}" "${tmpPath}"`, { encoding: 'utf-8', timeout: 120000 });
    const parsed = JSON.parse(result);
    if (parsed.text) {
      console.log(`[PDF URL] PyMuPDF extracted ${parsed.text.length} chars from ${url.slice(0, 60)}`);
      return parsed.text.trim().slice(0, maxChars);
    }
    // Fallback to pdf-parse
    const data = await pdfParse(buffer);
    return data.text.trim().slice(0, maxChars);
  } catch (err: any) {
    console.error(`[PDF URL] Failed: ${url.slice(0, 80)} — ${err?.message ?? 'unknown'}`);
    return '';
  } finally {
    try { fs.unlinkSync(tmpPath); } catch { /* ignore */ }
  }
}

/**
 * Detect file type by extension.
 */
function getFileType(filepath: string): 'pdf' | 'doc' | 'docx' | 'unknown' {
  const ext = path.extname(filepath).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (ext === '.doc') return 'doc';
  if (ext === '.docx') return 'docx';
  return 'unknown';
}

/**
 * Count the number of pages in a PDF file.
 */
export async function countPages(filepath: string): Promise<number> {
  const buffer = fs.readFileSync(filepath);
  const data = await pdfParse(buffer);
  return data.numpages;
}

/**
 * Extract plain text from a PDF file.
 */
export async function extractText(filepath: string): Promise<string> {
  const buffer = fs.readFileSync(filepath);
  const data = await pdfParse(buffer);
  return data.text;
}

/**
 * Extract text from a .doc file using catdoc.
 */
export async function extractDocText(filepath: string): Promise<string> {
  try {
    return execSync(`catdoc "${filepath}"`, { encoding: 'utf-8', timeout: 30000 });
  } catch (err) {
    console.error('[Doc Extract Error]', err);
    throw new Error('Failed to extract text from .doc file');
  }
}

/**
 * Extract text from a .docx file using mammoth.
 */
export async function extractDocxText(filepath: string): Promise<string> {
  try {
    const buffer = fs.readFileSync(filepath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (err) {
    console.error('[Docx Extract Error]', err);
    throw new Error('Failed to extract text from .docx file');
  }
}

/**
 * Universal text extractor — detects file type and extracts accordingly.
 */
export async function extractFileText(filepath: string): Promise<string> {
  const type = getFileType(filepath);
  switch (type) {
    case 'pdf':
      return extractText(filepath);
    case 'doc':
      return extractDocText(filepath);
    case 'docx':
      return extractDocxText(filepath);
    default:
      throw new Error(`Unsupported file type: ${type}`);
  }
}

/**
 * Extract text from a PDF and store the result in the Content record.
 * Called asynchronously after upload (fire-and-forget from the route).
 */
export async function extractAndEmbed(contentId: string, filepath: string): Promise<void> {
  try {
    const text = await extractText(filepath);
    const pageCount = await countPages(filepath);

    // TODO: Generate embeddings via OpenAI embeddings endpoint
    // embeddings = await generateEmbeddings(text)
    // For now, embeddings field is set to null and can be populated later
    // when pgvector extension is enabled in PostgreSQL.

    await prisma.content.update({
      where: { id: contentId },
      data: {
        pages: pageCount,
      },
    });

    console.log(`[PDF] Extracted ${pageCount} pages for content ${contentId}`);
  } catch (err) {
    console.error('[PDF] Extraction failed for', contentId, err);
    throw err;
  }
}

/**
 * Split a long PDF text into overlapping chunks for embedding.
 * Default chunk: 1000 characters with 200-character overlap.
 */
export function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }

  return chunks;
}
