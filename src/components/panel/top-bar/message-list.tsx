import { getClientTranslation } from '@/app/i18n/client'
import { useAppContext } from '@/lib/context'
import { NotificationContext } from '@/lib/context/notifications-context'
import { SignalRContext } from '@/lib/context/signalR-constext'
import { isImageUrl } from '@/lib/helpers'
import { ChatUserType } from '@/lib/services/types'
import { Badge, Button, Popover, Spin } from 'antd'
import { Image, MessageCircle, MessagesSquare } from 'lucide-react'
import moment from 'moment'
import { usePathname, useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import AlphabeticAvatar from '../alphabetic-avatar'
import styles from './top-bar.module.css'

export default function MessageList({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const router = useRouter()
  const [data, setData] = useState<any>(undefined)
  const [isDataLoading, setIsDataLoading] = useState<any>(undefined)
  const { tenant } = useAppContext()
  const { api } = useContext(NotificationContext)
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const { connection } = useContext(SignalRContext)
  const audioOutside =
    typeof window !== 'undefined' ? new Audio('/sounds/whatsapp_notification.mp3') : null

  const messageHandler1 = (data: any) => {
    if (!window?.location?.href?.includes?.('conversations')) {
      const key = `open${Date.now()}`
      if (data?.phoneNumber === data?.from) {
        if (audioOutside) audioOutside.play().catch((err) => console.error('خطأ تشغيل الصوت:', err))
        api?.open({
          message: t('NewMessageArrive', {
            name: data?.userName || data?.clientProfileName || data?.clientName,
          }),
          description:
            data?.messageType === 'template'
              ? data?.messageComponents?.header?.type === 'text'
                ? data?.messageComponents?.header?.data
                : data?.messageComponents?.body?.data
              : data?.messageContent,
          icon: <MessageCircle className="text-primary" />,
          placement: lng === 'ar' ? 'bottomRight' : 'bottomLeft',
          key,
          showProgress: true,
          duration: 10,
          actions: (
            <div className="flex gap-3 justify-end w-full">
              <Button type="primary" size="small" onClick={() => api.destroy(key)}>
                {t('View')}
              </Button>
              <Button type="link" size="small" onClick={() => api.destroy(key)}>
                {t('Ignore')}
              </Button>
            </div>
          ),
        })
      }
    }
    // getData()
  }

  const messageHandler2 = (data: any) => {
    // getData()
  }
  useEffect(() => {
    if (!connection) return
    connection.on('ReceiveMessage', messageHandler1)
    connection.on('UpdateMessageStatus', messageHandler2)
    connection.on('ChatLifecycleChanged', messageHandler2)

    return () => {
      connection.off('ReceiveMessage', messageHandler1)
      connection.off('UpdateMessageStatus', messageHandler2)
      connection.off('ChatLifecycleChanged', messageHandler2)
    }
  }, [connection])

  const getData = async () => {
    try {
      let res
      setIsDataLoading(true)
      // if (tenant) {
      //   res = await managerChatServiceInstance.getLastMessages()
      // } else {
      //   res = await adminChatServiceInstance.getLastMessages()
      // }
      // setData(res)
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout (Error Code => ECONNABORTED):', error)
      } else console.error(error)
    } finally {
      setIsDataLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <li className={styles.navItemBox}>
      <Popover
        open={open}
        onOpenChange={(value) => {
          if (value) getData()
          setOpen(!open)
        }}
        content={
          <div className={styles.notificationDropdown}>
            <div className={styles.topnavDropdownHeader}>
              <h4 className={styles.notificationTitle}>{t('Messages')}</h4>
            </div>
            <div className={styles.notiContent}>
              <ul className={styles.notificationList}>
                <Spin spinning={isDataLoading}>
                  {data?.lastMessages?.map((item: any, index: number) => (
                    <li
                      className="gap-3 cursor-pointer items-start flex px-2 py-3"
                      key={index}
                      onClick={() => {
                        router.push(
                          `/${lng}/admin/conversations/${item.userType === ChatUserType.Team ? 'team' : 'clients'}/${item.id}`
                        )
                        setOpen(false)
                      }}
                    >
                      <AlphabeticAvatar
                        src={item.userImageUrl}
                        letter={(item.userName || item.clientProfileName)?.substring(0, 1)}
                      />
                      <div className="grow -mt-1">
                        <div className="flex justify-between">
                          <span className="text-[15px] font-semibold">
                            {(item.userName || item.clientProfileName)?.length > 35
                              ? (item.userName || item.clientProfileName)?.substring(0, 35) + '...'
                              : item.userName || item.clientProfileName}
                          </span>
                          <span className="text-xs text-nowrap ">
                            {item.lastMessage ? moment(item.lastMessageTime).fromNow() : ''}
                          </span>
                        </div>
                        {item.lastMessage ? (
                          <div className="flex w-full justify-between">
                            <span className="last-message flex-1 line-clamp-1">
                              {item.lastMessage?.toLowerCase() !== 'unsupportedmediatype' ? (
                                isImageUrl(item.lastMessage) ? (
                                  <span className="flex gap-1">
                                    <Image size={18} /> {t('AnImage')}
                                  </span>
                                ) : item.lastMessage.length > 25 ? (
                                  item.lastMessage.substring(0, 50) + '...'
                                ) : (
                                  item.lastMessage
                                )
                              ) : (
                                t('MessageUnavailable')
                              )}
                            </span>

                            <span className="text-xs text-nowrap">
                              <Badge
                                className="site-badge-count-109"
                                count={item.unreadMessagesCount}
                                style={{ backgroundColor: '#52c41a' }}
                              />
                            </span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </li>
                  ))}
                </Spin>
              </ul>
            </div>
            <div className={styles.topnavDropdownFooter}>
              {/* <Button variant="outlined" className={styles.readLink}>
                    Mark all as read
                  </Button> */}

              <Button
                onClick={() => {
                  router.push(`/${lng}/admin/conversations/clients`)
                  setOpen(false)
                }}
                block
                size="large"
                type="primary"
                className="main-btn"
              >
                {t('ViewAllMessages')}
              </Button>
            </div>
          </div>
        }
        trigger="click"
      >
        <div>
          <MessagesSquare className="font-bold" />
          {data?.unreadMessagesCounts > 0 && (
            <span className={styles.badge}>{data?.unreadMessagesCounts}</span>
          )}
        </div>
      </Popover>
    </li>
  )
}
