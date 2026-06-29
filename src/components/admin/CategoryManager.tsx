'use client'
// src/components/admin/CategoryManager.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Check, X } from 'lucide-react'
import { slugify } from '@/lib/utils'

interface Category {
  id: string; name: string; slug: string; description: string | null; isActive: boolean
}

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [newForm, setNewForm] = useState({ name: '', description: '' })
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!newForm.name.trim()) return
    setLoading(true)
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newForm.name.trim(), description: newForm.description.trim(), slug: slugify(newForm.name) }),
    })
    const data = await res.json()
    if (res.ok) {
      setCategories((c) => [...c, data])
      setNewForm({ name: '', description: '' })
      setShowNew(false)
      toast.success('Category created')
    } else {
      toast.error(data.error || 'Failed')
    }
    setLoading(false)
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditForm({ name: cat.name, description: cat.description || '' })
  }

  const handleEdit = async (id: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editForm.name.trim(), description: editForm.description.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      setCategories((cats) => cats.map((c) => (c.id === id ? data : c)))
      setEditingId(null)
      toast.success('Category updated')
    } else {
      toast.error(data.error || 'Failed')
    }
    setLoading(false)
  }

  const handleToggle = async (cat: Category) => {
    const res = await fetch(`/api/admin/categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !cat.isActive }),
    })
    const data = await res.json()
    if (res.ok) {
      setCategories((cats) => cats.map((c) => (c.id === cat.id ? data : c)))
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Products in this category will become uncategorized.`)) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCategories((cats) => cats.filter((c) => c.id !== id))
      toast.success('Category deleted')
    } else {
      toast.error('Cannot delete — category has products')
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="card overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Slug', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    {editingId === cat.id ? (
                      <div className="space-y-1.5">
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                          className="input text-sm py-1.5"
                          autoFocus
                        />
                        <input
                          value={editForm.description}
                          onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                          className="input text-sm py-1.5"
                          placeholder="Description (optional)"
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-dark">{cat.name}</p>
                        {cat.description && <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{cat.slug}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleToggle(cat)} className={`badge cursor-pointer ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {editingId === cat.id ? (
                        <>
                          <button onClick={() => handleEdit(cat.id)} disabled={loading} className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(cat)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-dark transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNew ? (
        <div className="card p-4 space-y-3">
          <h3 className="font-semibold text-sm text-dark">New Category</h3>
          <input
            value={newForm.name}
            onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))}
            className="input text-sm"
            placeholder="Category name *"
            autoFocus
          />
          <input
            value={newForm.description}
            onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))}
            className="input text-sm"
            placeholder="Description (optional)"
          />
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={loading || !newForm.name.trim()} className="btn-primary text-sm py-2">
              {loading ? 'Creating…' : 'Create'}
            </button>
            <button onClick={() => { setShowNew(false); setNewForm({ name: '', description: '' }) }} className="btn-secondary text-sm py-2">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      )}
    </div>
  )
}
