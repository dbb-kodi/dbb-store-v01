'use client'
// src/components/admin/ContentEditor.tsx
// Edit all site_content rows with auto-save

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SiteContent } from '@/types/database'
import toast from 'react-hot-toast'
import { Save, Upload } from 'lucide-react'

export function ContentEditor({ content: initial }: { content: SiteContent[] }) {
  const [content, setContent] = useState(
    Object.fromEntries(initial.map(row => [row.key, row.value ?? '']))
  )
  const [saving, setSaving] = useState<string | null>(null)
  const supabase = createClient()

  const save = async (key: string) => {
    setSaving(key)
    const { error } = await supabase
      .from('site_content')
      .update({ value: content[key], updated_at: new Date().toISOString() })
      .eq('key', key)
    setSaving(null)
    if (error) toast.error(`Failed to save ${key}`)
    else toast.success('Saved!')
  }

  const handleVideoUpload = async (key: string, file: File) => {
    const ext = file.name.split('.').pop()
    const path = `hero/${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('hero').upload(path, file, { upsert: true })
    if (error) { toast.error('Upload failed'); return }
    const { data: { publicUrl } } = supabase.storage.from('hero').getPublicUrl(path)
    setContent(c => ({ ...c, [key]: publicUrl }))
    await save(key)
  }

  const fields = initial.map(row => ({ ...row, currentValue: content[row.key] ?? '' }))

  // Group by section
  const heroFields      = fields.filter(f => f.key.startsWith('hero'))
  const brandFields     = fields.filter(f => ['brand_statement', 'dbb_quote', 'story_body'].includes(f.key))
  const ctaFields       = fields.filter(f => f.key.startsWith('cta'))
  const socialFields    = fields.filter(f => ['instagram_url', 'tiktok_url', 'contact_email'].includes(f.key))

  const renderField = (field: typeof fields[0]) => (
    <div key={field.key} className="mb-6">
      <label className="admin-label">{field.label || field.key}</label>

      {field.type === 'video_url' ? (
        <div className="flex gap-3 items-start">
          <input
            type="text"
            value={field.currentValue}
            onChange={e => setContent(c => ({ ...c, [field.key]: e.target.value }))}
            placeholder="Paste video URL or upload below"
            className="admin-input flex-1"
          />
          <label className="cursor-pointer btn-outline text-sm px-4 py-3 whitespace-nowrap flex items-center gap-2">
            <Upload size={14} />
            Upload Video
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleVideoUpload(field.key, e.target.files[0]) }}
            />
          </label>
          <button onClick={() => save(field.key)} disabled={saving === field.key} className="btn-primary text-sm px-4 py-3 flex items-center gap-2 whitespace-nowrap">
            <Save size={14} />
            {saving === field.key ? '...' : 'Save'}
          </button>
        </div>
      ) : field.type === 'html' || field.currentValue.length > 100 ? (
        <div>
          <textarea
            value={field.currentValue}
            onChange={e => setContent(c => ({ ...c, [field.key]: e.target.value }))}
            rows={4}
            className="admin-input resize-y"
          />
          <button onClick={() => save(field.key)} disabled={saving === field.key} className="mt-2 btn-primary text-sm px-4 py-2 flex items-center gap-2">
            <Save size={14} />
            {saving === field.key ? 'Saving...' : 'Save'}
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <input
            type="text"
            value={field.currentValue}
            onChange={e => setContent(c => ({ ...c, [field.key]: e.target.value }))}
            onKeyDown={e => { if (e.key === 'Enter') save(field.key) }}
            className="admin-input flex-1"
          />
          <button onClick={() => save(field.key)} disabled={saving === field.key} className="btn-primary text-sm px-4 py-3 flex items-center gap-2 whitespace-nowrap">
            <Save size={14} />
            {saving === field.key ? '...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="bg-dbb-charcoal border border-dbb-smoke p-6">
        <h2 className="font-display text-2xl text-dbb-cream tracking-widest mb-6">HERO SECTION</h2>
        {heroFields.map(renderField)}
      </section>

      <section className="bg-dbb-charcoal border border-dbb-smoke p-6">
        <h2 className="font-display text-2xl text-dbb-cream tracking-widest mb-6">BRAND & MESSAGING</h2>
        {brandFields.map(renderField)}
      </section>

      <section className="bg-dbb-charcoal border border-dbb-smoke p-6">
        <h2 className="font-display text-2xl text-dbb-cream tracking-widest mb-6">CALL TO ACTION</h2>
        {ctaFields.map(renderField)}
      </section>

      <section className="bg-dbb-charcoal border border-dbb-smoke p-6">
        <h2 className="font-display text-2xl text-dbb-cream tracking-widest mb-6">SOCIAL & CONTACT</h2>
        {socialFields.map(renderField)}
      </section>
    </div>
  )
}
