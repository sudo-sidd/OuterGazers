import { UPI_PAYMENT_CONFIG } from "@/constants";

/**
 * Constructs a standard Indian UPI deep-link URL (upi://pay?...)
 * Supported by Google Pay, PhonePe, Paytm, BHIM, CRED, Navi, etc.
 */
export function generateUpiPaymentUrl(
  amount: number,
  teamName: string,
  customUpiId?: string,
  customPayeeName?: string
): string {
  const upiId = customUpiId || UPI_PAYMENT_CONFIG.upiId;
  const payeeName = customPayeeName || UPI_PAYMENT_CONFIG.payeeName;
  const note = `${teamName.slice(0, 20)} Jam Entry`;

  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
}

/**
 * Returns a high-contrast, scannable QR code URL for the UPI URI.
 */
export function generateUpiQrCodeUrl(upiUrl: string, size = 300): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(upiUrl)}`;
}

/**
 * Compresses an uploaded image file into a lightweight Base64 JPEG data URL.
 * Downscales images exceeding maxDimension (e.g. 1200px) on a canvas to keep upload fast
 * and fit cleanly within Google Apps Script / Drive payload tolerances (~100-250KB).
 */
export function compressImageToBase64(
  file: File,
  maxDimension = 1200,
  quality = 0.8
): Promise<{ dataUrl: string; sizeKb: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // Only accept image files
    if (!file.type.startsWith("image/")) {
      reject(new Error("Selected file must be an image (PNG, JPG, JPEG, WEBP)."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();

      img.onerror = () => reject(new Error("Unable to load image for processing."));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          const approxKb = Math.round(src.length * 0.75 / 1024);
          resolve({ dataUrl: src, sizeKb: approxKb, width, height });
          return;
        }

        // Draw image onto canvas and export as optimized JPEG
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const sizeKb = Math.round(dataUrl.length * 0.75 / 1024);

        resolve({ dataUrl, sizeKb, width, height });
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
}
