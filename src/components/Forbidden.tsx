'use client'

import { getClientTranslation } from '@/app/i18n/client'
import { Card, CardContent } from '@/components/ui/card'
import { useAppContext } from '@/lib/context'
import { Button } from 'antd'
import { Link } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Forbidden({
  lng,
  message,
  needLinkWithMeta,
  isLinkedWebhook,
  icon,
}: {
  lng: string
  needLinkWithMeta?: boolean
  message?: string
  isLinkedWebhook?: boolean
  icon?: any
}) {
  const { t } = getClientTranslation(lng)
  const router = useRouter()
  const { currentUser } = useAppContext()

  return message ? (
    <div className="flex flex-col gap-3 justify-center items-center h-[100%] min-h-screen">
      <Card className="mx-auto max-w-lg text-center shadow-none border-0">
        <CardContent>
          {icon ? <div className="mx-auto mb-4 w-fit">{icon}</div> : <></>}
          <h1 className="text-2xl font-bold">{t(message!)}</h1>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="page-wrapper min-h-screen">
      <div className="content">
        <div className="row">
          <Card className="p-0 h-full min-h-[calc(100vh_-_100px)] flex justify-center items-center text-center flex-col gap-11">
            {needLinkWithMeta ? (
              <>
                <Link size={90} />
              </>
            ) : (
              <div className="lock"></div>
            )}
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">{t('AccessToThisPageIsRestricted')}</h1>
              <p>
                {currentUser?.roles?.length > 0
                  ? needLinkWithMeta
                    ? t('YouNeedToConnectToMeta')
                    : !isLinkedWebhook
                      ? t('YouNeedToConnectToWebHook')
                      : t('DontHaveAPermission')
                  : t('DontHaveAPermissions')}
              </p>
              {(needLinkWithMeta || !isLinkedWebhook) && currentUser?.roles?.length > 0 && (
                <Button
                  onClick={() => router.push(`/${lng}/admin/channels`)}
                  type="primary"
                  className="!py-4 !h-10 !w-36 mx-auto"
                >
                  {t('ConnectViaMeta')}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
