/**
 * Helper utilities to compress and optimize images before saving to Firestore or LocalStorage.
 * Prevents Firestore document limit errors (property longer than 1,048,487 bytes).
 */

export const compressImageFile = (
  file: File,
  maxDimension: number = 640,
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const src = reader.result as string;
      compressBase64Image(src, maxDimension, maxDimension, quality)
        .then(resolve)
        .catch(reject);
    };
    reader.readAsDataURL(file);
  });
};

export const compressBase64Image = (
  dataUrl: string,
  maxWidth: number = 640,
  maxHeight: number = 640,
  quality: number = 0.7
): Promise<string> => {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return Promise.resolve(dataUrl);
  }

  // If already tiny (< 80KB), return as is
  if (dataUrl.length <= 80000) {
    return Promise.resolve(dataUrl);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(dataUrl.slice(0, 300000));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Compress to JPEG with given quality
      let result = canvas.toDataURL('image/jpeg', quality);

      // If still above 250KB, apply stronger compression
      if (result.length > 250000) {
        result = canvas.toDataURL('image/jpeg', 0.5);
      }

      // If still above 250KB, downscale further
      if (result.length > 250000) {
        const smallCanvas = document.createElement('canvas');
        smallCanvas.width = Math.max(1, Math.round(width * 0.6));
        smallCanvas.height = Math.max(1, Math.round(height * 0.6));
        const sCtx = smallCanvas.getContext('2d');
        if (sCtx) {
          sCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
          result = smallCanvas.toDataURL('image/jpeg', 0.5);
        }
      }

      resolve(result);
    };

    img.onerror = () => {
      resolve(dataUrl.slice(0, 300000));
    };

    img.src = dataUrl;
  });
};
