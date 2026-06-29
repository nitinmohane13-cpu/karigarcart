// src/app/api/admin/inventory/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { delta } = await req.json()
  if (typeof delta !== 'number') return NextResponse.json({ error: 'Invalid delta' }, { status: 400 })

  // Check stock won't go negative
  const product = await prisma.product.findUnique({ where: { id: params.id }, select: { stock: true } })
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  if (product.stock + delta < 0) return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: { stock: { increment: delta } },
    select: { id: true, stock: true },
  })

  return NextResponse.json(updated)
}
