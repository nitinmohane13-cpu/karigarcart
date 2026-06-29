'use client'
// src/components/admin/ProductForm.tsx
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { X, UploadCloud, ImagePlus, Loader2 } from 'lucide-react'

interface Category { id: string; name: string }

interface Props {
  categories: Category[]
  product?: any
  mode: 'new' | 'edit'
}

export default function ProductForm({ categories, product, mode }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Existing saved image URLs (from DB)
  const [savedImages, setSavedImages] = useState<string[]>(product?.images || [])
  // Newly chosen files not yet uploaded
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  // Preview URLs for pending files
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([])

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    mrp: product?.mrp || '',
    sku: product?.sku || '',
    stock: product?.stock || 0,
    categoryId: product?.categoryId || '',
    tags: product?.tags?.join(', ') || '',
    gstRate: product?.gstRate || 18,
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
  })

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }))

  // ── Image handling ────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setPendingFiles((prev) => [...prev, ...files])
    const previews = files.map((f) => URL.createObjectURL(f))
    setPendingPreviews((prev) => [...prev, ...previews])
    // reset input so same file can be picked again
    e.target.value = ''
  }

  const removeSaved = (idx: number) => {
    setSavedImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const removePending = (idx: number) => {
    URL.revokeObjectURL(pendingPreviews[idx])
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx))
    setPendingPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const uploadPendingFiles = async (): Promise<string[]> => {
    if (pendingFiles.length === 0) return []
    const fd = new FormData()
    pendingFiles.forEach((f) => fd.append('files', f))
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (!res.ok) {
      const d = await res.json()
      throw new Error(d.error || 'Upload failed')
    }
    const { urls } = await res.json()
    return urls as string[]
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUploading(true)

    let newUrls: string[] = []
    try {
      newUrls = await uploadPendingFiles()
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed')
      setLoading(false)
      setUploading(false)
      return
    }
    setUploading(false)

    const images = [...savedImages, ...newUrls]

    const payload = {
      ...form,
      price: parseFloat(form.price),
      mrp: parseFloat(form.mrp),
      stock: parseInt(form.stock),
      gstRate: parseFloat(form.gstRate),
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      images,
    }

    const url = mode === 'new' ? '/api/admin/products' : `/api/admin/products/${product.id}`
    const method = mode === 'new' ? 'POST' : 'PUT'

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()

    if (res.ok) {
      toast.success(mode === 'new' ? 'Product created' : 'Product updated')
      router.push('/admin/products')
      router.refresh()
    } else {
      toast.error(data.error || 'Failed')
      setLoading(false)
    }
  }

  const totalImages = savedImages.length + pendingFiles.length

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-dark">Basic Info</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} className="input" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} className="input min-h-24 resize-y" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹) *</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹) *</label>
            <input type="number" step="0.01" value={form.mrp} onChange={(e) => update('mrp', e.target.value)} className="input" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
            <input value={form.sku} onChange={(e) => update('sku', e.target.value)} className="input font-mono" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="input" min={0} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)} className="input" required>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
            <select value={form.gstRate} onChange={(e) => update('gstRate', e.target.value)} className="input">
              {[0, 5, 12, 18, 28].map((r) => <option key={r} value={r}>{r}%</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
          <input value={form.tags} onChange={(e) => update('tags', e.target.value)} className="input" placeholder="hammer, hand tool, carpentry" />
        </div>

        {/* ── Image Upload ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
            {totalImages > 0 && <span className="ml-2 text-xs text-gray-400">({totalImages} image{totalImages !== 1 ? 's' : ''})</span>}
          </label>

          {/* Thumbnails grid */}
          {totalImages > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {savedImages.map((url, i) => (
                <div key={`saved-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <Image src={url} alt={`Product image ${i + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeSaved(i)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    title="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-brand-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">Main</span>
                  )}
                </div>
              ))}

              {pendingPreviews.map((src, i) => (
                <div key={`pending-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-dashed border-brand-400 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`New image ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePending(i)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    title="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-amber-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">New</span>
                </div>
              ))}
            </div>
          )}

          {/* Drop / pick area */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-500 bg-gray-50 hover:bg-brand-50 py-7 transition-colors cursor-pointer"
          >
            {totalImages === 0 ? (
              <>
                <UploadCloud className="w-9 h-9 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">Click to upload product images</p>
                <p className="text-xs text-gray-400">JPG, PNG, WebP — up to 5 MB each</p>
              </>
            ) : (
              <>
                <ImagePlus className="w-7 h-7 text-brand-500" />
                <p className="text-sm font-medium text-brand-600">Add more images</p>
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex gap-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} className="w-4 h-4 accent-brand-600" />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} className="w-4 h-4 accent-brand-600" />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {uploading ? 'Uploading images…' : 'Saving…'}
            </>
          ) : (
            mode === 'new' ? 'Create Product' : 'Save Changes'
          )}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
      </div>
    </form>
  )
}
