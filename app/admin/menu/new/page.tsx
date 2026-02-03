'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import TiptapEditor from '../../../components/admin/TiptapEditor'
import ImageBrowser from '../../../components/admin/ImageBrowser'
import AutoSaveIndicator from '../../../components/admin/AutoSaveIndicator'
import PreviewPane from '../../../components/admin/PreviewPane'
import { useAutoSave } from '../../../hooks/useAutoSave'

interface MenuFormData {
  name_sl: string
  name_en: string
  name_nl: string
  name_de: string
  description_sl: string
  description_en: string
  description_nl: string
  description_de: string
  price: number
  category: string
  image_url: string
  dietary_info: string[]
  allergens: string[]
  calories: number
  available: boolean
  status: 'draft' | 'published'
}

export default function NewMenuItemPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<MenuFormData>({
    name_sl: '',
    name_en: '',
    name_nl: '',
    name_de: '',
    description_sl: '',
    description_en: '',
    description_nl: '',
    description_de: '',
    price: 0,
    category: 'meals',
    image_url: '',
    dietary_info: [],
    allergens: [],
    calories: 0,
    available: true,
    status: 'draft'
  })
  const [activeLanguage, setActiveLanguage] = useState<'sl' | 'en' | 'nl' | 'de'>('sl')
  const [showImageBrowser, setShowImageBrowser] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Auto-save functionality
  const autoSaveState = useAutoSave(formData, {
    onSave: async (data) => {
      console.log('Auto-saving menu item draft:', data)
      localStorage.setItem('menu-draft', JSON.stringify(data))
    },
    interval: 30000,
    enabled: formData.status === 'draft'
  })

  const handleInputChange = (field: keyof MenuFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDescriptionChange = (lang: 'sl' | 'en' | 'nl' | 'de', html: string) => {
    const field = `description_${lang}` as keyof MenuFormData
    setFormData(prev => ({ ...prev, [field]: html }))
  }

  const handleImageSelect = (image: any) => {
    setFormData(prev => ({ ...prev, image_url: image.url }))
    setShowImageBrowser(false)
  }

  const toggleDietaryInfo = (info: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_info: prev.dietary_info.includes(info)
        ? prev.dietary_info.filter(i => i !== info)
        : [...prev.dietary_info, info]
    }))
  }

  const toggleAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }))
  }

  const handleSave = async (status: 'draft' | 'published') => {
    setIsSaving(true)
    try {
      const menuData = {
        ...formData,
        status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('menu_items')
        .insert([menuData])
        .select()
        .single()

      if (error) throw error

      localStorage.removeItem('menu-draft')
      alert(`Menu item ${status === 'published' ? 'published' : 'saved as draft'} successfully!`)
      router.push('/admin/menu')
    } catch (error) {
      console.error('Error saving menu item:', error)
      alert('Failed to save menu item. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getPreviewContent = () => {
    const lang = activeLanguage
    const name = formData[`name_${lang}` as keyof MenuFormData] as string
    const description = formData[`description_${lang}` as keyof MenuFormData] as string
    
    return `
      <div>
        <h1>${name || 'Untitled Menu Item'}</h1>
        ${formData.image_url ? `<img src="${formData.image_url}" alt="${name}" />` : ''}
        <div class="meta">
          <span><strong>Price:</strong> €${formData.price.toFixed(2)}</span>
          <span><strong>Category:</strong> ${formData.category}</span>
          ${formData.calories > 0 ? `<span><strong>Calories:</strong> ${formData.calories} kcal</span>` : ''}
        </div>
        ${formData.dietary_info.length > 0 ? `<div class="badges">${formData.dietary_info.map(d => `<span class="badge">${d}</span>`).join(' ')}</div>` : ''}
        ${description}
        ${formData.allergens.length > 0 ? `<p><strong>Allergens:</strong> ${formData.allergens.join(', ')}</p>` : ''}
      </div>
    `
  }

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Organic', 'Local']
  const allergenOptions = ['Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish', 'Sesame']

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Go Back"
              >
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Create New Menu Item</h1>
                <p className="text-sm text-neutral-600">Add a new food or beverage item to your menu</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AutoSaveIndicator {...autoSaveState} />
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>

              <button
                onClick={() => handleSave('draft')}
                disabled={isSaving}
                className="px-4 py-2 text-neutral-700 border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors disabled:opacity-50"
              >
                Save Draft
              </button>

              <button
                onClick={() => handleSave('published')}
                disabled={isSaving}
                className="px-4 py-2 bg-lime-500 text-white hover:bg-lime-600 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish Item'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
          {/* Form Section */}
          <div className="space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
            >
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                {/* Image Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Item Image
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.image_url ? (
                      <img
                        src={formData.image_url}
                        alt="Menu Item"
                        className="w-32 h-32 object-cover rounded-lg border border-neutral-200"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-neutral-100 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center">
                        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <button
                      onClick={() => setShowImageBrowser(true)}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                    >
                      Choose Image
                    </button>
                  </div>
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    >
                      <option value="meals">Meals</option>
                      <option value="snacks">Snacks</option>
                      <option value="beverages">Beverages</option>
                      <option value="desserts">Desserts</option>
                      <option value="smoothies">Smoothies</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Price (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    />
                  </div>
                </div>

                {/* Calories */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => handleInputChange('calories', parseInt(e.target.value))}
                    placeholder="Optional"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                </div>

                {/* Available Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => handleInputChange('available', e.target.checked)}
                    className="w-4 h-4 text-lime-500 border-neutral-300 rounded focus:ring-lime-500"
                  />
                  <label htmlFor="available" className="text-sm font-medium text-neutral-700">
                    Currently available
                  </label>
                </div>

                {/* Dietary Information */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Dietary Information
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => toggleDietaryInfo(option)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          formData.dietary_info.includes(option)
                            ? 'bg-lime-500 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allergens */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Contains Allergens
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allergenOptions.map(allergen => (
                      <button
                        key={allergen}
                        onClick={() => toggleAllergen(allergen)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          formData.allergens.includes(allergen)
                            ? 'bg-red-500 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {allergen}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Multilingual Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
            >
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Menu Item Content</h2>

              {/* Language Tabs */}
              <div className="flex gap-2 mb-4">
                {(['sl', 'en', 'nl', 'de'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLanguage(lang)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeLanguage === lang
                        ? 'bg-lime-500 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Item Name ({activeLanguage.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={formData[`name_${activeLanguage}` as keyof MenuFormData] as string}
                  onChange={(e) => handleInputChange(`name_${activeLanguage}` as keyof MenuFormData, e.target.value)}
                  placeholder="Enter item name..."
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                />
              </div>

              {/* Description Editor */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description ({activeLanguage.toUpperCase()})
                </label>
                <TiptapEditor
                  content={formData[`description_${activeLanguage}` as keyof MenuFormData] as string}
                  onChange={(html) => handleDescriptionChange(activeLanguage, html)}
                  placeholder="Describe your menu item..."
                />
              </div>
            </motion.div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 h-fit"
            >
              <PreviewPane
                htmlContent={getPreviewContent()}
                title={`Menu Item Preview (${activeLanguage.toUpperCase()})`}
                type="desktop"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Image Browser Modal */}
      {showImageBrowser && (
        <ImageBrowser
          onSelect={handleImageSelect}
          onClose={() => setShowImageBrowser(false)}
          allowMultiple={false}
        />
      )}
    </div>
  )
}
