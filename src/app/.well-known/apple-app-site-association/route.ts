import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json(
    {
      applinks: {
        apps: [],
        details: [
          {
            appID: '98V46ZS2PQ.com.atrasslink.app',
            paths: ['/*/gatekeep*'],
          },
        ],
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
