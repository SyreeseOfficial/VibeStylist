/**
 * Maximum file size allowed (5MB).
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Resizes an image ensuring the width does not exceed the maxWidth.
 * Returns a Promise that resolves to the resized image as a DataURL (Base64).
 * 
 * @param {File} file - The file object from input.
 * @param {number} maxWidth - Maximum width allowed (default 800px).
 * @param {number} quality - JPEG quality (0 to 1, default 0.7).
 * @returns {Promise<string>}
 */
export const resizeImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("No file provided"));
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            reject(new Error("File is too large. Maximum size is 5MB."));
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Configure dimensions
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Export as Base64 string with strict quality
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = (error) => reject(new Error("Failed to load image"));
        };
        reader.onerror = (error) => reject(new Error("Failed to read file"));
    });
};
