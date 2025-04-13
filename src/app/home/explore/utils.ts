interface ImageDimensionOptions {
    minSize?: number; // Minimum size in pixels (default: 200)
    maxSize?: number; // Maximum size in pixels (default: 4000)
    minRatio?: number; // Minimum aspect ratio (default: 0.5)
    maxRatio?: number; // Maximum aspect ratio (default: 2.0)
}

export const checkImageDimensions = async (
    imgSrc: string,
    options: ImageDimensionOptions = {}
): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
            const {
                minSize = 200,
                maxSize = 4000,
                minRatio = 0.5,
                maxRatio = 2.0,
            } = options;

            const width = img.width;
            const height = img.height;
            const aspectRatio = width / height;

            const isValidSize =
                width >= minSize &&
                height >= minSize &&
                width <= maxSize &&
                height <= maxSize;

            const isValidRatio = aspectRatio >= minRatio && aspectRatio <= maxRatio;

            if (!isValidSize || !isValidRatio) {
                console.warn("Image dimensions check failed:", {
                    width,
                    height,
                    aspectRatio: aspectRatio.toFixed(2),
                    isValidSize,
                    isValidRatio,
                });
            }

            resolve(isValidSize && isValidRatio);
        };

        img.onerror = () => resolve(false);
        img.src = imgSrc;
    });
};