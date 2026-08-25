const whitelists = {
  id: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ',
  stat: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .',
  value: '0123456789.%',
};

export async function ocrRegion(region, imageBitmap, worker, mode = 7, wlType) {
  const canvas = new OffscreenCanvas(region.w, region.h);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    imageBitmap,
    region.x, region.y, region.w, region.h,
    0, 0, region.w, region.h
  );

  const blob = await canvas.convertToBlob();
  const params = { tessedit_pageseg_mode: mode };
  if (wlType) {
    params.tessedit_char_whitelist = whitelists[wlType]
  }

  const { data } = await worker.recognize(blob, params);
  return data.text.replace(/\s+/g, ' ').trim();
}
