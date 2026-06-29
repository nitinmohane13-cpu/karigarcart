// src/app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

function adminGuard(session: any) {
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return null
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const guard = adminGuard(session)
  if (guard) return guard

  const formData = await req.formData()
  const files = formData.getAll('files') as File[]

  if (!files || files.length === 0)
    return NextResponse.json({ error: 'No files provided' }, { status: 400 })

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
  await mkdir(uploadDir, { recursive: true })

  const urls: string[] = []

  for (const file of files) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type))
      return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 })

    const maxSize = 5 * 1024 * 1024 // 5 MB
    if (file.size > maxSize)
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filepath = path.join(uploadDir, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)

    urls.push(`/uploads/products/${filename}`)
  }

  return NextResponse.json({ urls })
}
