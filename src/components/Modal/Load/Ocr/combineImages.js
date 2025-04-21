const combineImages = async (imageBlobs, bufferSize = 10) => {
  // Validate input - all items should be Blobs
  if (!Array.isArray(imageBlobs) || imageBlobs.length === 0) {
    throw new Error("imageBlobs must be a non-empty array");
  }
  
  for (let i = 0; i < imageBlobs.length; i++) {
    if (!(imageBlobs[i] instanceof Blob)) {
      console.error(`Item at index ${i} is not a Blob:`, imageBlobs[i]);
      throw new Error(`Item at index ${i} is not a Blob`);
    }
  }

  const images = await Promise.all(
    imageBlobs.map((blob) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
          console.error("Failed to load image from blob");
          resolve(new Image()); // Resolve with empty image to prevent Promise.all from failing
        };
        img.src = URL.createObjectURL(blob);
      })
    )
  );

  // Filter out any empty images that might have failed to load
  const validImages = images.filter(img => img.width > 0 && img.height > 0);
  
  if (validImages.length === 0) {
    throw new Error("No valid images could be loaded from the provided blobs");
  }

  const width = Math.max(...validImages.map(img => img.width));
  // Add buffer space between images (but not after the last image)
  const totalHeight = validImages.reduce((sum, img, idx) => 
    sum + img.height + (idx < validImages.length - 1 ? bufferSize : 0), 0);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d");
  
  // Fill the canvas with white background to create visible buffer spaces
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, totalHeight);

  let y = 0;
  for (const img of validImages) {
    ctx.drawImage(img, 0, y, img.width, img.height);
    y += img.height + bufferSize;
  }

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), "image/jpeg")
  );
};

export default combineImages;
