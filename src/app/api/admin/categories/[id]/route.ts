// src/app/api/admin/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function adminGuard(session: any) {
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return null
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const guard = adminGuard(session)
  if (guard) return guard

  const body = await req.json()
  const category = await prisma.category.update({ where: { id: params.id }, data: body })
  return NextResponse.json(category)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const guard = adminGuard(session)
  if (guard) return guard

  // Block delete if products exist
  const count = await prisma.product.count({ where: { categoryId: params.id } })
  if (count > 0)
    return NextResponse.json({ error: `Cannot delete — ${count} product(s) use this category` }, { status: 409 })

  await prisma.category.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
