declare module 'pdf-parse' {
  interface PdfParseData {
    numpages: number;
    text: string;
    pages: string[];
  }
  function pdfParse(data: Buffer): Promise<PdfParseData>;
  export = pdfParse;
}
