'use client'
// src/components/admin/ImageUploader.tsx

import { useRef, useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { uploadProductImage } from '@/app/admin/products/actions'

export function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState(value)

  const handleFile = (file: File) => {
    const formData = new FormData()
    formData.set('file', file)
    startTransition(async () => {
      const result = await uploadProductImage(formData)
      if (result.error) {
        toast.error(result.error)
        return
      }
      if (result.url) {
        setPreview(result.url)
        onChange(result.url)
        toast.success('Image uploaded')
      }
    })
  }

  return (
    <div className="space-y-3">
      {preview ? (
        <img src={preview} alt="Product" className="w-40 h-52 object-cover border border-dbb-border" />
      ) : (
        <div className="w-40 h-52 border border-dashed border-dbb-border flex items-center justify-center text-dbb-muted text-xs">
          No image
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="px-4 py-2 text-xs tracking-[0.15em] uppercase border border-dbb-border text-dbb-muted hover:border-dbb-cream hover:text-dbb-cream transition-all disabled:opacity-50"
      >
        {isPending ? 'Uploading…' : 'Upload Image'}
      </button>
    </div>
  )
}
