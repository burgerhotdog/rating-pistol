const combineImages = async (imageBlobs) => {
  const images = await Promise.all(
    imageBlobs.map((blob) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = URL.createObjectURL(blob);
      })
    )
  );

  const width = 703;
  const totalHeight = images.length * 90;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d");

  let y = 0;
  for (const img of images) {
    ctx.drawImage(img, 0, y);
    y += 90;
  }

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), "image/jpeg")
  );
};

export default combineImages;
