'use client'
// src/components/admin/SettingsForm.tsx
import { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  initialSettings: Record<string, string>
}

const SETTING_FIELDS = [
  { section: 'Store Info', fields: [
    { key: 'store_name', label: 'Store Name', type: 'text' },
    { key: 'store_email', label: 'Support Email', type: 'email' },
    { key: 'store_phone', label: 'Support Phone', type: 'text' },
    { key: 'gst_number', label: 'GST Number', type: 'text' },
  ]},
  { section: 'Shipping', fields: [
    { key: 'shipping_charge', label: 'Shipping Charge (₹)', type: 'number' },
    { key: 'free_shipping_above', label: 'Free Shipping Above (₹)', type: 'number' },
  ]},
]

export default function SettingsForm({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)

  const update = (key: string, value: string) => {
    setSettings((s) => ({ ...s, [key]: value }))
    setDirty(true)
  }

  const handleSave = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    if (res.ok) {
      toast.success('Settings saved')
      setDirty(false)
    } else {
      toast.error('Failed to save')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-xl space-y-6">
      {SETTING_FIELDS.map((section) => (
        <div key={section.section} className="card p-6">
          <h2 className="font-semibold text-dark mb-4">{section.section}</h2>
          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={settings[field.key] || ''}
                  onChange={(e) => update(field.key, e.target.value)}
                  className="input"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={loading || !dirty}
        className="btn-primary disabled:opacity-50"
      >
        {loading ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  )
}
