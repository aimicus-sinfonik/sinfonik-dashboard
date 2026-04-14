import { NextRequest, NextResponse } from 'next/server'
import { getBaseline } from '@/lib/model'

export async function GET(
  _req: NextRequest,
  { params }: { params: { region: string } }
) {
  const region = params.region.toLowerCase()
  const data = getBaseline(region)

  if (!data) {
    return NextResponse.json({ error: `Region "${region}" not found` }, { status: 404 })
  }

  return NextResponse.json(data)
}
