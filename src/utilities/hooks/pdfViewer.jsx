/**
 * Opens a PDF in a new browser tab using your API endpoint.
 * @param {string} filePath - The file path or filename of the PDF.
 */
export function openPdfInBrowser(filePath) {
  if (!filePath) {
    console.error("No file path provided for PDF viewer.");
    return;
  }

  const pdfUrl = `http://192.168.1.14:8080/api/documents/v1/view-pdf?file=${encodeURIComponent(
    filePath
  )}`;
  window.open(pdfUrl, "_blank", "noopener,noreferrer");
}
