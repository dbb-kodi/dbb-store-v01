'use client'
// src/components/admin/ContentEditor.tsx

import { useState } from 'react'
import toast from 'react-hot-toast'

interface Field {
  key: string
  label: string
  type: string
  currentValue: string
}

export function ContentEditor({ fields: initial }: { fields: Field[] }) {
  const [content, setContent] = useState<Record<string, string>>(
    Object.fromEntries(initial.map((f) => [f.key, f.currentValue]))
  )

  const handleSave = () => {
    // Stub — will call Supabase once backend is wired
    toast.success('Content saved (local preview only)')
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      {initial.map((field) => (
        <div key={field.key}>
          <label className="admin-label">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              value={content[field.key] ?? ''}
              onChange={(e) => setContent((c: Record<string, string>) => ({ ...c, [field.key]: e.target.value }))}
              rows={4}
              className="admin-input resize-none"
            />
          ) : (
            <input
              type="text"
              value={content[field.key] ?? ''}
              onChange={(e) => setContent((c: Record<string, string>) => ({ ...c, [field.key]: e.target.value }))}
              className="admin-input"
            />
          )}
        </div>
      ))}

      <div className="pt-4">
        <button onClick={handleSave} className="btn-primary">
          SAVE CHANGES
        </button>
        <p className="font-body text-xs text-dbb-muted mt-3">
          Changes are local until Supabase is connected.
        </p>
      </div>
    </div>
  )
}
