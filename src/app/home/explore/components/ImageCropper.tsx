'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Cropper from 'react-easy-crop';
import { Slider } from '@mui/material';
import { Point, Area } from 'react-easy-crop';
interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string | null;
  onCropComplete: (croppedImage: Blob) => void;
}

interface CroppedAreaPixels {
  width: number;
  height: number;
  x: number;
  y: number;
}

export function ImageCropper({
  isOpen,
  onClose,
  originalImage,
  onCropComplete,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onRotationChange = (rotation: number) => {
    setRotation(rotation);
  };

  const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CroppedAreaPixels,
    rotation: number
  ): Promise<Blob> => {
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      // Calculate bounding box of the rotated image
      const safeArea = Math.max(image.width, image.height) * 2;

      canvas.width = safeArea;
      canvas.height = safeArea;

      // Translate canvas center to origin and rotate
      ctx.translate(safeArea / 2, safeArea / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-safeArea / 2, -safeArea / 2);

      // Draw the image at center
      ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
      );

      const data = ctx.getImageData(0, 0, safeArea, safeArea);

      // Set canvas size to final desired crop size
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Put image data at the correct position after crop
      ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          1
        );
      });
    } catch (error) {
      console.error('Error in getCroppedImg:', error);
      throw error;
    }
  };

  const handleApplyCrop = async () => {
    if (!originalImage || !croppedAreaPixels) {
      console.error('Missing originalImage or croppedAreaPixels');
      return;
    }

    try {
      setIsLoading(true);
      const croppedImage = await getCroppedImg(originalImage, croppedAreaPixels, rotation);
      onCropComplete(croppedImage);
      onClose();
    } catch (error) {
      console.error('Error applying crop:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const generateCroppedImage = async () => {
      if (!originalImage || !croppedAreaPixels) return;
      
      try {
        const croppedImage = await getCroppedImg(originalImage, croppedAreaPixels, rotation);
        const previewUrl = URL.createObjectURL(croppedImage);
        setCroppedImageUrl(previewUrl);
        
        return () => {
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
        };
      } catch (error) {
        console.error('Error generating preview:', error);
      }
    };

    generateCroppedImage();
  }, [originalImage, croppedAreaPixels, rotation]);

  useEffect(() => {
    if (originalImage) {
      const img = new Image();
      img.onload = () => {
        setAspectRatio(img.width / img.height);
      };
      img.src = originalImage;
    }
  }, [originalImage]);

  if (!originalImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col p-0 gap-0 max-w-[95vw] w-full md:max-w-[800px] h-[95vh] md:h-[80vh]">
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 px-4 py-2 border-b">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-h-0">
          <div className="flex flex-col md:flex-row h-full gap-4 p-4">
            {/* Cropper Section - Takes full height on mobile, left side on desktop */}
            <div className="flex-1 min-h-[300px] md:min-h-0">
              <div className="relative h-full">
                <Cropper
                  image={originalImage}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspectRatio}
                  onCropChange={onCropChange}
                  onZoomChange={onZoomChange}
                  onRotationChange={onRotationChange}
                  onCropComplete={onCropCompleteHandler}
                  objectFit="contain"
                  style={{
                    containerStyle: {
                      width: '100%',
                      height: '100%',
                    },
                    cropAreaStyle: {
                      border: '2px dashed #fff',
                      borderRadius: '8px',
                    },
                  }}
                />
              </div>
            </div>

            {/* Controls Section - Right side panel on desktop, bottom on mobile */}
            <div className="flex flex-col gap-4 md:w-[240px] flex-shrink-0">
              {/* Zoom Control */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Zoom</label>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e, value) => setZoom(value as number)}
                  className="py-2"
                />
              </div>

              {/* Rotation Control */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Rotation</label>
                <Slider
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  onChange={(e, value) => setRotation(value as number)}
                  className="py-2"
                />
              </div>

              {/* Preview Section */}
              {croppedImageUrl && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preview</label>
                  <div className="rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={croppedImageUrl} 
                      alt="Preview"
                      className="w-full h-auto object-contain max-h-[200px]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t p-4">
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApplyCrop} 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Apply'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
