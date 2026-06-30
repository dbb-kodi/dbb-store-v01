// src/app/api/keep-alive/route.ts
// Pinged on a schedule (see .github/workflows/keep-alive.yml) to stop the
// Supabase free-tier project from pausing after 7 days of inactivity.
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Never cache — every cron hit must actually reach Supabase.
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Optional shared-secret guard so only our cron can trigger this.
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const supabase = createClient()
  if (!supabase) {
    return NextResponse.json(
      { ok: false, message: 'Supabase not configured yet — nothing to keep alive.' },
      { status: 200 }
    )
  }

  try {
    // Lightweight query — touching the DB resets the inactivity timer.
    await supabase.from('products').select('id').limit(1)
    return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() })
  } catch (err) {
    // Even a failed query counts as activity; report but don't fail the cron.
    console.error('Keep-alive query error:', err)
    return NextResponse.json({ ok: true, note: 'pinged (query errored)', pingedAt: new Date().toISOString() })
  }
}
