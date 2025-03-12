import { NextRequest, NextResponse } from 'next/server'

// This ensures the register page can be properly handled during static export
export async function GET(request: NextRequest) {
  return NextResponse.next()
}

// This makes the route dynamic to prevent static prerendering issues
export const dynamic = 'force-dynamic' 