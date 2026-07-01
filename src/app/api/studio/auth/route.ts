// src/app/api/studio/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'

const STUDIO_PASSWORD = process.env.STUDIO_PASSWORD || 'studio2025'
const COOKIE_NAME = 'studio_access'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password !== STUDIO_PASSWORD) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(COOKIE_NAME, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete(COOKIE_NAME)
  return res
}
