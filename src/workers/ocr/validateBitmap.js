import jsQR from "jsqr";

const QR_REGION = { x: 1486, y: 80, w: 185, h: 185 };
const QR_URL = "https://discord.com/invite/wutheringwaves";
const RESIZE = 128;

const offscreen = new OffscreenCanvas(128, 128);
const ctx = offscreen.getContext("2d", { willReadFrequently: true });

export function validateBitmap(imageBitmap) {
  const { width, height } = imageBitmap;
  if (width !== 1920 || height !== 1080) {
    return { error: "Invalid image dimensions. Expected 1920x1080." };
  }

  // Check QR code links to wuthering waves discord
  ctx.clearRect(0, 0, RESIZE, RESIZE);
  ctx.drawImage(
    imageBitmap,
    QR_REGION.x, QR_REGION.y, QR_REGION.w, QR_REGION.h,
    0, 0, RESIZE, RESIZE
  );

  const imageData = ctx.getImageData(0, 0, RESIZE, RESIZE);
  const result = jsQR(imageData.data, RESIZE, RESIZE, {
    inversionAttempts: "dontInvert"
  });

  if (!result || result.data !== QR_URL) {
    return { error: "Unrecognized Wuwa Bot image." };
  }

  return { success: true };
}
