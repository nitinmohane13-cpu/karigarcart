// src/app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function adminGuard(session: any) {
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return null
}

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const guard = adminGuard(session)
  if (guard) return guard

  const { name, slug, description } = await req.json()
  if (!name || !slug) return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })

  try {
    const category = await prisma.category.create({ data: { name, slug, description } })
    return NextResponse.json(category, { status: 201 })
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'Category already exists' }, { status: 409 })
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
