import { jsPDF } from "jspdf";
import type { WorksheetSettings } from "../worksheet/worksheetTypes";
import { getPageDimensions } from "../worksheet/layoutEngine";

// ============================================================
// PDF Export Service — Converts SVG pages to printable PDF
// ============================================================

/**
 * Export worksheet pages to PDF.
 * Strategy: Render each SVG to canvas, then add as image to PDF.
 */
export async function exportToPdf(
  svgElements: SVGSVGElement[],
  settings: WorksheetSettings,
  filename: string = "japanese-practice-sheet.pdf"
): Promise<void> {
  const dims = getPageDimensions(settings);
  const isPortrait = settings.orientation === "portrait";

  const pdf = new jsPDF({
    orientation: isPortrait ? "portrait" : "landscape",
    unit: "mm",
    format: "a4",
  });

  for (let i = 0; i < svgElements.length; i++) {
    if (i > 0) {
      pdf.addPage("a4", isPortrait ? "portrait" : "landscape");
    }

    const svgEl = svgElements[i];
    const { dataUrl, format } = await svgToImage(svgEl, dims.widthMm, dims.heightMm);

    pdf.addImage(dataUrl, format, 0, 0, dims.widthMm, dims.heightMm);
  }

  pdf.save(filename);
}

/** Convert SVG element to image data URL for embedding in PDF.
 *  Uses 200 DPI + JPEG (quality 0.88) for a good balance of print quality
 *  and file size (~70-80% smaller than 300 DPI PNG). */
async function svgToImage(
  svgEl: SVGSVGElement,
  widthMm: number,
  heightMm: number
): Promise<{ dataUrl: string; format: "JPEG" }> {
  const dpi = 200;
  const mmToInch = 25.4;
  const widthPx = Math.round((widthMm / mmToInch) * dpi);
  const heightPx = Math.round((heightMm / mmToInch) * dpi);

  // Clone SVG and ensure it has explicit mm dimensions for correct rendering
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.removeAttribute("style");
  clone.setAttribute("width", `${widthMm}mm`);
  clone.setAttribute("height", `${heightMm}mm`);

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);

  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = widthPx;
      canvas.height = heightPx;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, widthPx, heightPx);
      ctx.drawImage(img, 0, 0, widthPx, heightPx);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
      URL.revokeObjectURL(url);
      resolve({ dataUrl, format: "JPEG" });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG as image"));
    };

    img.src = url;
  });
}
