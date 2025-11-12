'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface GalleryImage {
  id: string
  title_en: string
  image_url: string
  category: string
  order_index: number
  status: 'draft' | 'published'
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    try {
      // TODO: Replace with real API
      // For now, use static images
      const staticImages: GalleryImage[] = [
        { id: '1', title_en: 'Wellness Retreat', image_url: '/images/gallery/DSC_4866.JPG', category: 'gallery', order_index: 1, status: 'published' },
        { id: '2', title_en: 'Healthy Food', image_url: '/images/gallery/DSC_4870.JPG', category: 'gallery', order_index: 2, status: 'published' },
        { id: '3', title_en: 'Nature Setting', image_url: '/images/gallery/DSC_4872.JPG', category: 'gallery', order_index: 3, status: 'published' },
        { id: '4', title_en: 'Ice Bathing', image_url: '/images/icebath breathing/DSC_4910.JPG', category: 'icebath', order_index: 7, status: 'published' },
        { id: '5', title_en: 'Healthy Menu', image_url: '/images/izbrane hrana/DSC_4866.JPG', category: 'food', order_index: 8, status: 'published' },
      ]
      setImages(staticImages)
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteImage(id: string) {
    if (!confirm('Delete this image?')) return
    
    try {
      // TODO: Implement delete API
      alert('Image deleted!')
      fetchImages()
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter)

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/dashboard" className="text-[#A4B82C] hover:text-[#8A9824] text-sm font-medium mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-neutral-900">Gallery Management</h1>
              <p className="text-sm text-neutral-600 mt-1">Manage photos and images</p>
            </div>
            <button className="bg-[#A4B82C] hover:bg-[#8A9824] text-white px-6 py-3 rounded-lg font-bold transition-colors">
              📤 Upload Images
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            {['all', 'gallery', 'icebath', 'food'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  filter === cat
                    ? 'bg-[#A4B82C] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat === 'all' ? 'All Images' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-neutral-600 mb-1">Total Images</div>
            <div className="text-3xl font-bold text-[#A4B82C]">{images.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-neutral-600 mb-1">Published</div>
            <div className="text-3xl font-bold text-green-600">
              {images.filter(i => i.status === 'published').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-neutral-600 mb-1">Drafts</div>
            <div className="text-3xl font-bold text-yellow-600">
              {images.filter(i => i.status === 'draft').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-neutral-600 mb-1">Categories</div>
            <div className="text-3xl font-bold text-blue-600">
              {new Set(images.map(i => i.category)).size}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#A4B82C] border-t-transparent" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-neutral-600 mb-4">No images found</p>
            <button className="bg-[#A4B82C] hover:bg-[#8A9824] text-white px-6 py-3 rounded-lg font-bold transition-colors">
              Upload Your First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Image */}
                <div className="relative h-48 bg-neutral-200">
                  <Image
                    src={image.image_url}
                    alt={image.title_en}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="bg-white text-neutral-900 p-2 rounded-lg hover:bg-neutral-100">
                      👁️
                    </button>
                    <button className="bg-white text-neutral-900 p-2 rounded-lg hover:bg-neutral-100">
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      image.status === 'published'
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {image.status}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h4 className="font-bold text-neutral-900 truncate">{image.title_en}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-neutral-600 capitalize">{image.category}</span>
                    <span className="text-xs text-neutral-400">Order: {image.order_index}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bulk Actions */}
        {filteredImages.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div className="text-sm text-neutral-600">
              {filteredImages.length} images selected
            </div>
            <div className="flex gap-2">
              <button className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg font-medium transition-colors">
                📊 Reorder
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                ✓ Publish All
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                🗑️ Delete Selected
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
