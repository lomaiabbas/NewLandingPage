import { getClientTranslation } from '@/app/i18n/client'
import { useAppContext } from '@/lib/context'
import { NotificationContext } from '@/lib/context/notifications-context'
import { SignalRContext } from '@/lib/context/signalR-constext'
import { resolveNotificationPathName } from '@/lib/helpers'
import AtrasLinkLogo from '@/lib/icons/logo'
import notificationServiceInstance from '@/lib/services/notifications'
import { NotificationState } from '@/lib/services/types'
import { Button, Popover } from 'antd'
import { Bell, BellOff } from 'lucide-react'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import styles from './top-bar.module.css'

export default function NotificationList({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const router = useRouter()
  const [data, setData] = useState<any>(undefined)
  const { currentUser, notificationUnreadCount, setNotificationUnreadCount } = useAppContext()
  const [open, setOpen] = useState(false)
  const [isSubmittingAll, setIsSubmittingAll] = useState(false)
  const { connection } = useContext(SignalRContext)
  const { api } = useContext(NotificationContext)

  const messageHandler1 = (data: any) => {
    const key = `open${Date.now()}`
    console.log({ data })
    if (data.name === 'EditRoleByAdminToStaff') {
      if (currentUser.email !== 'admin@abp.io' && currentUser.id === data.entityId) {
        document.cookie.split(';').forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, '')
            .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
        })
        window.location.href = `/${lng}?needAuth=${data?.body}`
      }
    } else
      api?.open({
        message: data?.title,
        description: data?.body,
        icon: <Bell className="text-primary" />,
        placement: lng === 'ar' ? 'bottomRight' : 'bottomLeft',
        key,
        showProgress: true,
        duration: 10,
        actions: (
          <div className="flex gap-3 justify-end w-full">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                let pathName = resolveNotificationPathName(data)
                notificationServiceInstance.get(data.id)

                router.push(`/${lng}${pathName}`)
                api.destroy(key)
              }}
            >
              {t('View')}
            </Button>
            <Button type="link" size="small" onClick={() => api.destroy(key)}>
              {t('Ignore')}
            </Button>
          </div>
        ),
      })

    getData()
  }

  useEffect(() => {
    if (!connection) return
    connection.on('ReceiveNotification', messageHandler1)

    return () => {
      connection.off('ReceiveNotification', messageHandler1)
    }
  }, [connection])

  const getData = async () => {
    notificationServiceInstance
      .getAll({
        userId: currentUser?.id,
        skipCount: 0,
        maxResultCount: 16,
      })
      .then((res) => {
        setData(res.items)
        setNotificationUnreadCount(res.unreadCount)
      })
  }

  return (
    <li className={styles.navItemBox}>
      <Popover
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen)
          if (newOpen) getData()
        }}
        content={
          <div className={styles.notificationDropdown}>
            <div className={styles.topnavDropdownHeader}>
              <h4 className={styles.notificationTitle}>{t('Notifications')}</h4>
            </div>
            <div
              className={`${styles.notiContent} ${data?.length === 0 ? '!h-[225px] !w-[350px]' : ''}`}
            >
              {data?.length > 0 ? (
                <ul className={styles.notificationList}>
                  {data?.map((item: any, index: number) => (
                    <li
                      className={`gap-3 cursor-pointer items-start flex px-2 py-3 ${item.state === NotificationState.Unread ? 'bg-gray-50' : ''}`}
                      key={index}
                      onClick={() => {
                        let pathName = resolveNotificationPathName(item)
                        notificationServiceInstance.get(item.id)
                        router.push(`/${lng}${pathName}`)
                        setTimeout(() => {
                          setOpen(false)
                        }, 300)
                      }}
                    >
                      <AtrasLinkLogo notification />
                      <div className="grow -mt-1">
                        <div className="flex justify-between">
                          <span className="text-[15px] font-semibold">
                            {item.title?.length > 35
                              ? item.title?.substring(0, 35) + '...'
                              : item.title}
                          </span>
                          <span className="text-xs text-nowrap ">
                            {item.creationTime
                              ? moment(item.creationTime).add(3, 'hours').fromNow()
                              : ''}
                          </span>
                        </div>
                        {item.body ? (
                          <div className="flex w-full justify-between">
                            <span className="last-message flex-1 line-clamp-1">{item.body}</span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex gap-3 flex-col items-center justify-center">
                  <BellOff size={50} className="text-primary" />
                  <p className="text-lg">{t('NoNotificationsFound')}</p>
                </div>
              )}
            </div>
            {data?.length > 0 && (
              <div className={styles.topnavDropdownFooter}>
                <Button
                  loading={isSubmittingAll}
                  onClick={async () => {
                    setIsSubmittingAll(true)
                    try {
                      await notificationServiceInstance.makeAllRead()
                      await getData()
                    } finally {
                      setIsSubmittingAll(false)
                    }
                  }}
                  block
                  size="large"
                  type="default"
                  className={`main-btn ${notificationUnreadCount === 0 ? '!hidden' : ''}`}
                >
                  {t('MarkAllAsRead')}
                </Button>

                <Button
                  onClick={() => {
                    router.push(`/${lng}/admin/all-notifications`)
                    setTimeout(() => {
                      setOpen(false)
                    }, 300)
                  }}
                  block
                  size="large"
                  type="primary"
                  className="main-btn"
                >
                  {t('ViewAllNotifications')}
                </Button>
              </div>
            )}
          </div>
        }
        trigger="click"
      >
        <div>
          <Bell className="font-bold" />
          {notificationUnreadCount > 0 && <span className={styles.badge}>{notificationUnreadCount}</span>}
        </div>
      </Popover>
    </li>
  )
}
