export function bitmapToPixels(bitmap, region, resize) {
  const srcX = region?.x ?? 0;
  const srcY = region?.y ?? 0;
  const srcW = region?.w ?? bitmap.width;
  const srcH = region?.h ?? bitmap.height;

  const outW = resize?.w ?? region.w;
  const outH = resize?.h ?? region.h;

  const canvas = new OffscreenCanvas(outW, outH);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    bitmap,
    srcX, srcY, srcW, srcH,
    0, 0, outW, outH,
  );

  return ctx.getImageData(0, 0, outW, outH).data;
}
