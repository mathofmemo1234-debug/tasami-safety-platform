/**
 * Image Optimizer & Compression Utility
 * Helps maintain high visual quality while dramatically reducing file size
 * to prevent Firebase Storage timeouts, localStorage quota overflow,
 * and Firestore 1MB document limit rejections.
 */

export async function compressImageFile(file, {
  maxWidth = 1000,
  maxHeight = 800,
  quality = 0.75,
  isLogo = false,
  maxSizeBytes = 65 * 1024
} = {}) {
  if (!file) return file;

  // Preserve non-images and animated GIFs
  const type = String(file.type || '').toLowerCase();
  if (!type.startsWith('image/') || type.includes('gif')) {
    return file;
  }

  // Specialized Logo Settings: smaller dimensions, crisp quality, alpha transparency support
  let effMaxWidth = isLogo ? Math.min(maxWidth, 480) : maxWidth;
  let effMaxHeight = isLogo ? Math.min(maxHeight, 240) : maxHeight;
  let effQuality = isLogo ? 0.82 : quality;
  let effMaxSizeBytes = isLogo ? 35 * 1024 : maxSizeBytes;

  // If already under target size and small dimensions (except if file is SVG which might be huge text)
  if (file.size && file.size < effMaxSizeBytes && !type.includes('svg')) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        let { width, height } = img;
        if (!width || !height) {
          resolve(file);
          return;
        }

        // Downscale while preserving aspect ratio
        if (width > effMaxWidth || height > effMaxHeight) {
          if (width / height > effMaxWidth / effMaxHeight) {
            height = Math.round((height * effMaxWidth) / width);
            width = effMaxWidth;
          } else {
            width = Math.round((width * effMaxHeight) / height);
            height = effMaxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Try WebP first for optimal compression and alpha channel support
        const targetFormat = 'image/webp';

        const tryExport = (q, scale = 1.0) => {
          let exportCanvas = canvas;
          if (scale < 1.0) {
            const smallerCanvas = document.createElement('canvas');
            smallerCanvas.width = Math.max(1, Math.round(canvas.width * scale));
            smallerCanvas.height = Math.max(1, Math.round(canvas.height * scale));
            const sCtx = smallerCanvas.getContext('2d');
            if (sCtx) {
              sCtx.imageSmoothingEnabled = true;
              sCtx.imageSmoothingQuality = 'high';
              sCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
              exportCanvas = smallerCanvas;
            }
          }

          exportCanvas.toBlob(
            (blob) => {
              if (!blob) {
                // WebP toBlob failed, fallback to JPEG/PNG
                fallbackExport();
                return;
              }

              // If still too large, downscale further
              if (blob.size > effMaxSizeBytes && scale > 0.5) {
                tryExport(Math.max(0.6, q - 0.1), scale * 0.75);
                return;
              }

              const cleanBase = (file.name || 'image').replace(/\.[^.]+$/, '');
              const newFile = new File([blob], `${cleanBase}.webp`, {
                type: targetFormat,
                lastModified: Date.now()
              });
              resolve(newFile);
            },
            targetFormat,
            q
          );
        };

        const fallbackExport = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              const cleanBase = (file.name || 'image').replace(/\.[^.]+$/, '');
              const newFile = new File([blob], `${cleanBase}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(newFile);
            },
            'image/jpeg',
            effQuality
          );
        };

        tryExport(effQuality, 1.0);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    } catch {
      resolve(file);
    }
  });
}

/**
 * Compresses an existing base64 data URL
 */
export async function compressDataUrl(dataUrl, {
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.72,
  isLogo = false
} = {}) {
  const str = String(dataUrl || '');
  if (!str.startsWith('data:image/') || str.includes('image/gif')) {
    return str;
  }

  const effMaxWidth = isLogo ? 480 : maxWidth;
  const effMaxHeight = isLogo ? 240 : maxHeight;
  const effQuality = isLogo ? 0.8 : quality;
  const thresholdChars = isLogo ? 45000 : 70000;

  // If already compact, leave intact
  if (str.length < thresholdChars) {
    return str;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (!width || !height) {
          resolve(str);
          return;
        }

        if (width > effMaxWidth || height > effMaxHeight) {
          if (width / height > effMaxWidth / effMaxHeight) {
            height = Math.round((height * effMaxWidth) / width);
            width = effMaxWidth;
          } else {
            width = Math.round((width * effMaxHeight) / height);
            height = effMaxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(str);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressed = canvas.toDataURL('image/webp', effQuality);
          if (compressed && compressed.length < str.length) {
            resolve(compressed);
          } else {
            resolve(str);
          }
        } catch {
          resolve(str);
        }
      };

      img.onerror = () => resolve(str);
      img.src = str;
    } catch {
      resolve(str);
    }
  });
}

/**
 * Recursively scans an object/array and compresses any oversized base64 images
 */
export async function deepOptimizePayload(value, isLogoContext = false) {
  if (!value) return value;

  if (typeof value === 'string') {
    if (value.startsWith('data:image/')) {
      const isOversized = isLogoContext ? value.length > 45000 : value.length > 65000;
      if (isOversized) {
        return await compressDataUrl(value, { isLogo: isLogoContext });
      }
    }
    return value;
  }

  if (Array.isArray(value)) {
    const optimizedArray = [];
    for (const item of value) {
      optimizedArray.push(await deepOptimizePayload(item, isLogoContext));
    }
    return optimizedArray;
  }

  if (typeof value === 'object') {
    const optimizedObj = {};
    for (const key of Object.keys(value)) {
      const isLogoField = isLogoContext || key === 'logoUrl' || key === 'brand' || key === 'logo';
      optimizedObj[key] = await deepOptimizePayload(value[key], isLogoField);
    }
    return optimizedObj;
  }

  return value;
}

/**
 * Calculates estimated payload byte size in UTF-8
 */
export function getPayloadByteSize(obj) {
  try {
    const jsonStr = JSON.stringify(obj);
    return new Blob([jsonStr]).size;
  } catch {
    return 0;
  }
}
