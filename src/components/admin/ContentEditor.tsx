'use client'
// src/components/admin/ContentEditor.tsx

import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { saveContent } from '@/app/admin/content/actions'

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
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveContent(content)
      if (result.error) toast.error(result.error)
      else toast.success('Content saved')
    })
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
        <button onClick={handleSave} disabled={isPending} className="btn-primary disabled:opacity-50">
          {isPending ? 'SAVING…' : 'SAVE CHANGES'}
        </button>
      </div>
    </div>
  )
}
