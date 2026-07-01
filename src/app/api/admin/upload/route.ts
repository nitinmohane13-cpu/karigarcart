// src/app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const formData = await req.formData()
  const files = formData.getAll('files[]') as File[]

  if (!files.length)
    return NextResponse.json({ error: 'No files provided' }, { status: 400 })

  const urls: string[] = []

  for (const file of files) {
    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type))
      return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 })

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })

    // Convert to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'karigarcart/products',
          transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    urls.push(result.secure_url)
  }

  return NextResponse.json({ urls })
}
