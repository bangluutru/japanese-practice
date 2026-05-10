// ============================================================
// DOCX Export Service — Placeholder for future implementation
// ============================================================

/**
 * DOCX export is planned for a future release.
 * 
 * Future approach:
 * - Render each A4 page as a high-resolution image
 * - Insert page images into DOCX using the `docx` library
 * - Avoid complex editable Word layout in MVP
 */
export async function exportToDocx(): Promise<void> {
  throw new Error(
    "DOCX export is not yet implemented. This feature is planned for a future release."
  );
}

export const DOCX_EXPORT_AVAILABLE = false;
