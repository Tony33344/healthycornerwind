'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

interface ImageItem {
  id: string
  name: string
  url: string
  size?: number
  type: 'local' | 'supabase'
  createdAt?: Date
}

interface ImageBrowserProps {
  onSelect?: (image: ImageItem) => void
  onClose?: () => void
  allowMultiple?: boolean
  accept?: string
}

export default function ImageBrowser({
  onSelect,
  onClose,
  allowMultiple = false,
  accept = 'image/*'
}: ImageBrowserProps) {
  const [images, setImages] = useState<ImageItem[]>([])
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'local' | 'supabase' | 'upload'>('local')
  const [searchQuery, setSearchQuery] = useState('')

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadImages()
  }, [activeTab])

  const loadImages = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'local') {
        // Load local images from /public/images/
        const localImages: ImageItem[] = [
          {
            id: 'hero-1',
            name: 'hero-mountain.jpg',
            url: '/images/hero-mountain.jpg',
            type: 'local'
          },
          {
            id: 'hero-2',
            name: 'wellness-spa.jpg',
            url: '/images/wellness-spa.jpg',
            type: 'local'
          },
          {
            id: 'service-1',
            name: 'yoga-class.jpg',
            url: '/images/yoga-class.jpg',
            type: 'local'
          },
          {
            id: 'service-2',
            name: 'ice-bath.jpg',
            url: '/images/ice-bath.jpg',
            type: 'local'
          },
          {
            id: 'menu-1',
            name: 'healthy-bowl.jpg',
            url: '/images/healthy-bowl.jpg',
            type: 'local'
          },
          {
            id: 'menu-2',
            name: 'green-smoothie.jpg',
            url: '/images/green-smoothie.jpg',
            type: 'local'
          }
        ]
        setImages(localImages)
      } else if (activeTab === 'supabase') {
        // Load images from Supabase Storage
        const { data, error } = await supabase.storage
          .from('images')
          .list()

        if (error) {
          console.error('Error loading Supabase images:', error)
          setImages([])
        } else if (data) {
          const supabaseImages: ImageItem[] = data.map((file) => ({
            id: file.id,
            name: file.name,
            url: supabase.storage.from('images').getPublicUrl(file.name).data.publicUrl,
            size: file.metadata?.size,
            type: 'supabase',
            createdAt: new Date(file.created_at)
          }))
          setImages(supabaseImages)
        }
      }
    } catch (error) {
      console.error('Error loading images:', error)
      setImages([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageClick = (image: ImageItem) => {
    if (allowMultiple) {
      const isSelected = selectedImages.some(img => img.id === image.id)
      if (isSelected) {
        setSelectedImages(selectedImages.filter(img => img.id !== image.id))
      } else {
        setSelectedImages([...selectedImages, image])
      }
    } else {
      setSelectedImages([image])
    }
  }

  const handleConfirm = () => {
    if (selectedImages.length > 0 && onSelect) {
      if (allowMultiple) {
        selectedImages.forEach(img => onSelect(img))
      } else {
        onSelect(selectedImages[0])
      }
    }
    if (onClose) onClose()
  }

  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-neutral-900">
              Image Browser
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <TabButton
              active={activeTab === 'local'}
              onClick={() => setActiveTab('local')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Local Images
            </TabButton>
            <TabButton
              active={activeTab === 'supabase'}
              onClick={() => setActiveTab('supabase')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              Supabase Storage
            </TabButton>
            <TabButton
              active={activeTab === 'upload'}
              onClick={() => setActiveTab('upload')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload New
            </TabButton>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <motion.div
                className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : activeTab === 'upload' ? (
            <UploadZone accept={accept} onUploadComplete={loadImages} />
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
              <svg className="w-16 h-16 mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">No images found</p>
              <p className="text-sm">Try uploading some images or adjusting your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image) => {
                  const isSelected = selectedImages.some(img => img.id === image.id)
                  return (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`
                        relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                        ${isSelected ? 'border-lime-500 ring-2 ring-lime-200' : 'border-neutral-200 hover:border-lime-300'}
                      `}
                      onClick={() => handleImageClick(image)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="aspect-square relative bg-neutral-100">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-lime-500/20 flex items-center justify-center">
                            <div className="w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-white">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {image.name}
                        </p>
                        {image.size && (
                          <p className="text-xs text-neutral-500">
                            {(image.size / 1024).toFixed(1)} KB
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 flex items-center justify-between">
          <div className="text-sm text-neutral-600">
            {selectedImages.length > 0 ? (
              <span className="font-medium text-lime-600">
                {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected
              </span>
            ) : (
              <span>Select {allowMultiple ? 'one or more images' : 'an image'}</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedImages.length === 0}
              className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TabButton({
  active,
  onClick,
  children
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
        ${active
          ? 'bg-lime-500 text-white'
          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
        }
      `}
    >
      {children}
    </button>
  )
}

function UploadZone({
  accept,
  onUploadComplete
}: {
  accept: string
  onUploadComplete: () => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    await uploadFiles(files)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await uploadFiles(files)
  }

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress(0)
    const uploaded: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        // Upload to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage
          .from('images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error('Upload error:', error)
        } else {
          uploaded.push(file.name)
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }

      setUploadProgress(((i + 1) / files.length) * 100)
    }

    setUploadedFiles(uploaded)
    setUploading(false)
    
    // Refresh the image list after upload
    setTimeout(() => {
      onUploadComplete()
      setUploadedFiles([])
    }, 2000)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg transition-all
        ${isDragging
          ? 'border-lime-500 bg-lime-50 scale-105'
          : 'border-neutral-300 hover:border-lime-400'
        }
      `}
    >
      {uploading ? (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="w-64">
            <div className="flex justify-between text-sm text-neutral-600 mb-2">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-lime-500"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      ) : uploadedFiles.length > 0 ? (
        <div className="flex flex-col items-center gap-2">
          <svg className="w-16 h-16 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium text-lime-600">
            Upload Complete!
          </p>
          <p className="text-sm text-neutral-600">
            {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} uploaded successfully
          </p>
        </div>
      ) : (
        <>
          <svg className="w-16 h-16 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-lg font-medium text-neutral-700 mb-2">
            {isDragging ? 'Drop images here' : 'Drag and drop images here'}
          </p>
          <p className="text-sm text-neutral-500 mb-4">
            or click to browse
          </p>
          <input
            type="file"
            accept={accept}
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 cursor-pointer transition-colors"
          >
            Choose Files
          </label>
        </>
      )}
    </div>
  )
}
