"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ImagePlus, Send, X, Smile, Hash, MapPin, Calendar, Paperclip,
  Heart, MessageCircle, Share2, Bookmark, CheckCircle, User2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAppSelector } from "@/store/hooks"

export default function PostUploadCard() {
  const [content, setContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const user = useAppSelector((state)=> state.profile)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = () => {
    if (!content.trim() && !selectedImage) return
    
    setIsUploading(true)
    
    // Simulate API call
    setTimeout(() => {
      setContent("")
      setSelectedImage(null)
      setIsUploading(false)
      
      // Here you would typically handle the post submission
      console.log("Post submitted:", { content, image: selectedImage ? "image data" : null })
    }, 1500)
  }

  return (
    <div className="sticky top-20 w-full max-w-4xl mx-auto px-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <Card className="mt-2 overflow-hidden flex flex-col border shadow-sm hover:shadow-md transition-shadow duration-300 relative bg-card text-card-foreground">
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
            <AvatarImage src="https://ui-avatars.com/api/?name=User&background=random" />
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

        {/* Card Content with textarea and image preview */}
        <CardContent className="pb-3 flex-grow">
          <Textarea
            placeholder="What's on your mind? Share updates, ask questions, or offer your expertise..."
            className="w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm p-0 min-h-[100px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={selectedImage ? 3 : 5}
          />

          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative rounded-md overflow-hidden mt-4 bg-muted"
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="object-cover w-full h-auto max-h-[400px] hover:scale-105 transition-transform duration-300"
                />
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
          >
            <Hash className="h-3.5 w-3.5" />
            <span>Tag</span>
          </Button>

          {/* Post Button */}
          <Button
            variant={content.trim() || selectedImage ? "default" : "ghost"}
            size="sm"
            className={`text-xs gap-1.5 ${
              content.trim() || selectedImage 
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
      
      {/* Post creation tips or preview */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
        <p className="font-medium mb-2">Tips for creating engaging posts:</p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>Add relevant images to increase engagement</li>
          <li>Use tags to reach more people interested in your topic</li>
          <li>Keep your content clear and concise</li>
          <li>Ask questions to encourage responses</li>
        </ul>
      </div>
    </div>
  )
}