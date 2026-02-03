'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreviewPaneProps {
  htmlContent: string
  title?: string
  type?: 'desktop' | 'tablet' | 'mobile'
  onClose?: () => void
  className?: string
}

export default function PreviewPane({
  htmlContent,
  title = 'Preview',
  type = 'desktop',
  onClose,
  className = ''
}: PreviewPaneProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>(type)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const getPreviewDimensions = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-[375px]'
      case 'tablet':
        return 'max-w-[768px]'
      case 'desktop':
      default:
        return 'max-w-full'
    }
  }

  return (
    <div className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-neutral-100' : 'relative'}`}>
      <div className={`${isFullscreen ? 'h-full flex flex-col' : ''}`}>
        {/* Toolbar */}
        <div className="bg-white border-b border-neutral-300 p-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-neutral-900">{title}</h3>
            <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded">
              Live Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex gap-1 bg-neutral-100 rounded-lg p-1">
              <ViewModeButton
                active={viewMode === 'desktop'}
                onClick={() => setViewMode('desktop')}
                title="Desktop View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </ViewModeButton>
              
              <ViewModeButton
                active={viewMode === 'tablet'}
                onClick={() => setViewMode('tablet')}
                title="Tablet View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </ViewModeButton>
              
              <ViewModeButton
                active={viewMode === 'mobile'}
                onClick={() => setViewMode('mobile')}
                title="Mobile View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </ViewModeButton>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>

            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Close Preview"
              >
                <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Preview Content */}
        <div className={`${isFullscreen ? 'flex-1 overflow-auto' : ''} p-6 bg-neutral-100`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`mx-auto bg-white shadow-lg rounded-lg overflow-hidden ${getPreviewDimensions()}`}
            >
              {/* Device Frame */}
              {viewMode !== 'desktop' && (
                <div className="bg-neutral-800 p-2 flex justify-center">
                  <div className="w-16 h-1 bg-neutral-600 rounded-full"></div>
                </div>
              )}

              {/* Content Area */}
              <div className="prose prose-neutral max-w-none p-6">
                {htmlContent ? (
                  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                ) : (
                  <div className="text-center py-12 text-neutral-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <p className="text-lg font-medium">No content to preview</p>
                    <p className="text-sm">Start typing to see a live preview</p>
                  </div>
                )}
              </div>

              {/* Device Frame Bottom */}
              {viewMode === 'mobile' && (
                <div className="bg-neutral-800 p-2 flex justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-neutral-600"></div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* View Mode Label */}
          <div className="text-center mt-4 text-sm text-neutral-500">
            {viewMode === 'desktop' && 'Desktop View (Full Width)'}
            {viewMode === 'tablet' && 'Tablet View (768px)'}
            {viewMode === 'mobile' && 'Mobile View (375px)'}
          </div>
        </div>
      </div>
    </div>
  )
}

function ViewModeButton({
  active,
  onClick,
  title,
  children
}: {
  active: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-2 rounded transition-colors
        ${active
          ? 'bg-white text-lime-600 shadow-sm'
          : 'text-neutral-600 hover:text-neutral-900'
        }
      `}
    >
      {children}
    </button>
  )
}
