// src/app/api/studio/check/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('studio_access')
  return NextResponse.json({ access: cookie?.value === 'true' })
}
