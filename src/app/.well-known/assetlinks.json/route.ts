import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json(
    [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: 'com.atrasslink.app',
          sha256_cert_fingerprints: [
            'FE:DB:13:00:77:50:E5:78:24:5E:4B:67:70:CF:07:D5:36:C8:01:EA:F5:8A:6A:C4:11:DC:79:01:49:18:63:89',
          ],
        },
      },
    ],
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
