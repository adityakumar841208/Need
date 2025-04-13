"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import {
  ImagePlus, Send, X, Smile, Hash, MapPin, Calendar, Paperclip,
  Heart, MessageCircle, Share2, Bookmark, CheckCircle, User2, CropIcon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAppSelector } from "@/store/hooks"
import { Crop, PixelCrop } from 'react-image-crop'
import { ImageCropper } from "../components/ImageCropper"
import { checkImageDimensions } from "../utils"

export default function PostUploadCard() {
  const [content, setContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,  // Start with full width
    height: 100, // Start with full height
    x: 0,
    y: 0
  })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const user = useAppSelector((state) => state.profile)

  const onImageLoad = useCallback((img: HTMLImageElement) => {
    setImageRef(img)
    return false // Return false to prevent completion right away
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setOriginalImage(e.target.result as string)
          setIsCropModalOpen(true)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setOriginalImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    if (!content.trim() && !selectedImage) return;

    setIsUploading(true);

    try {
      // Prepare form data for the API
      const formData = new FormData();
        
      // Add post content and user data from Redux
      formData.append('content', content);
      formData.append('user', JSON.stringify(user)); // Serialize user object from Redux

      // Add tags
      formData.append('tags', JSON.stringify(tags));

      // Add image if present
      if (selectedImage) {
        const blob = await fetch(selectedImage).then(r => r.blob());
        formData.append('image', blob, 'post-image.jpg');
      }

      // Send to API endpoint
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      const result = await response.json();

      // Reset form after successful submission
      setContent("");
      setSelectedImage(null);
      setOriginalImage(null);
      setTags([]);

      toast({
        title: "Success!",
        description: "Your post has been published.",
      });

    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to publish your post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  return (
    <>
      {/* Main container with fixed width and padding */}
      <div className="sticky top-20 w-full max-w-2xl mx-auto px-2 h-[calc(100vh-5rem)] overflow-y-auto">
        <Card className="mt-4 overflow-hidden flex flex-col border shadow-sm hover:shadow-md transition-shadow duration-300 relative bg-card text-card-foreground rounded-lg my-1">
          {/* Badge at top right */}
          <div className="absolute top-4 right-4 z-10">
            <Badge
              variant="secondary"
              className="text-xs font-medium"
            >
              <User2 className="w-3 h-3 mr-1" /> Create Post
            </Badge>
          </div>

          {/* Card Header with user info */}
          <CardHeader className="flex flex-row items-center gap-4 pb-3">
            <Avatar className="h-10 w-10 border-2 border-primary/10">
              <AvatarImage src={user.profilePicture ? user.profilePicture : "https://ui-avatars.com/api/?name=User&background=random"} />
              <AvatarFallback className="bg-gradient-to-br from-primary/30 to-blue-500/30">U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm">{user.name ? user.name : 'Your Name'}</span>
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-200" />
              </div>
              <span className="text-xs text-muted-foreground">Now • Public</span>
            </div>
          </CardHeader>

          {/* Card Content with improved layout */}
          <CardContent className="pb-3 flex-grow space-y-4">
            <Textarea
              placeholder="What's on your mind? Share updates, ask questions, or offer your expertise..."
              className="w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm p-0 h-[40px] max-h-[100px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={selectedImage ? 1 : 2}
            />

            {/* Tags section with consistent spacing */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge 
                    key={tag} 
                    className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary group"
                  >
                    #{tag}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer opacity-60 group-hover:opacity-100" 
                      onClick={() => removeTag(tag)} 
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="tag-input"
                  placeholder="Add tags (press Enter)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 text-sm border-0 focus-visible:ring-0 bg-muted/30"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={addTag}
                  disabled={!currentTag.trim()}
                  className="h-8"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Image preview with consistent dimensions */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative bg-muted rounded-lg overflow-hidden"
                >
                  <div className="absolute top-3 right-3 z-10 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={() => setIsCropModalOpen(true)}
                    >
                      <CropIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="aspect-video relative">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="absolute inset-0 w-full h-full object-contain bg-muted/50"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          {/* Card Footer with action buttons */}
          <CardFooter className="flex justify-between border-t py-2.5 bg-background/50 mt-auto">
            {/* Image Upload Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs gap-1.5 text-muted-foreground"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    <span>Image</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />

            {/* Emoji Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1.5 text-muted-foreground"
            >
              <Smile className="h-3.5 w-3.5" />
              <span>Emoji</span>
            </Button>

            {/* Tag Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1.5 text-muted-foreground"
              onClick={() => document.getElementById('tag-input')?.focus()}
            >
              <Hash className="h-3.5 w-3.5" />
              <span>Tag</span>
            </Button>

            {/* Post Button */}
            <Button
              variant={content.trim() || selectedImage ? "default" : "ghost"}
              size="sm"
              className={`text-xs gap-1.5 ${content.trim() || selectedImage
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground"
                }`}
              disabled={(!content.trim() && !selectedImage) || isUploading}
              onClick={handleSubmit}
            >
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Paperclip className="h-3.5 w-3.5" />
                </motion.div>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Post</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Tips section with consistent spacing */}
        <div className="my-4 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground max-w-2xl mx-auto">
          <p className="font-medium mb-2">Tips for creating engaging posts:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Add relevant images to increase engagement</li>
            <li>Use tags to reach more people interested in your topic</li>
            <li>Keep your content clear and concise</li>
            <li>Ask questions to encourage responses</li>
          </ul>
        </div>
      </div>

      {/* Image Cropping Modal */}
      <ImageCropper
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        originalImage={originalImage}
        onCropComplete={async (croppedImage: Blob) => {
          try {
            const croppedImageUrl = URL.createObjectURL(croppedImage);
            setSelectedImage(croppedImageUrl);
            setIsCropModalOpen(false);
          } catch (error) {
            console.error('Error handling cropped image:', error);
          }
        }}
      />
    </>
  )
}