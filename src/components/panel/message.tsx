import { getClientTranslation } from '@/app/i18n/client'
import {
  defaultDateTimeFormat,
  TEMPLATE_TYPE_DOCUMENT,
  TEMPLATE_TYPE_IMAGE,
  TEMPLATE_TYPE_LOCATION,
  TEMPLATE_TYPE_TEXT,
  TEMPLATE_TYPE_VIDEO,
} from '@/lib/constants'
import { useAppContext } from '@/lib/context'
import { ModalContext } from '@/lib/context/modal-context'
import {
  formatMessageText,
  normalizeWhatsAppError,
  renderBodyText2,
  setTextAlignment,
} from '@/lib/helpers'
import { MessageDto } from '@/lib/services/chats/dto'
import { MessageStatus, TemplateTypes } from '@/lib/services/types'
import { Alert, Flex, Image, Space } from 'antd'
import {
  Check,
  CheckCheck,
  CircleAlert,
  Clock8,
  Lightbulb,
  MessageSquareX,
  Reply,
  SendHorizonal,
  SquareArrowOutUpRight,
  X,
} from 'lucide-react'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import UndeliverableSolutionModal from './undeliverable-solution-modal'

export default function Message({
  item,
  messages,
  allMessages,
  index,
  selectedChat,
  lng,
  isMe,
}: any) {
  const { t } = getClientTranslation(lng)
  const { tenant, companyInfo, grantedPolicies, targetChatInfo, setTargetChatInfo } =
    useAppContext()
  const { modal } = useContext(ModalContext)
  const { push } = useRouter()

  let refMessage = undefined
  if (item.contextId) {
    refMessage = allMessages?.filter((i: MessageDto) => i.messageId === item.contextId)?.[0]
  }

  const STATUS_MESSAGES: Partial<Record<any, string>> = {
    [MessageStatus.AwaitingReengagement]: 'AwaitingReengagementMessage',
  }

  const handleErrorMessage = () => {
    let message =
      item?.status === MessageStatus.Failed
        ? t(normalizeWhatsAppError(item?.errors))
        : STATUS_MESSAGES[item?.status]
          ? t(STATUS_MESSAGES[item?.status] as string)
          : item?.errors

    const isTemplateNotApproved = Number(item?.status) === MessageStatus.FailedTemplateNotApproved

    if (isTemplateNotApproved) {
      message = t('MessageUndeliverable')
    }

    return (
      <Alert
        message={
          isTemplateNotApproved ? (
            <Space>
              <span>{message}</span>
              <UndeliverableSolutionModal
                lng={lng}
                trigger={
                  <Lightbulb
                    size={16}
                    className="cursor-pointer text-yellow-500 hover:scale-110 transition"
                  />
                }
              />
            </Space>
          ) : (
            message
          )
        }
        showIcon
        icon={<CircleAlert size={17} color="#d50000" />}
        type="error"
        className="max-w-[325px]"
      />
    )
  }

  return (
    <div
      id={`msg-${item?.messageId}`}
      className={`flex items-start 
        ${
          (item.from !== selectedChat?.phoneNumber &&
            !(messages?.length >= index + 1 && messages[index - 1]?.to === item.to)) ||
          (item.from === selectedChat?.phoneNumber &&
            !(messages?.length >= index + 1 && messages[index - 1]?.to === item.to))
            ? 'gap-1'
            : 'gap-0'
        } mb-2 md:mb-0 ${item.useName ? 'relative pt-[25px]' : ''} ${item.to.replace(/\s+/g, '') !== selectedChat?.phoneNumber ? 'self' : 'other'}`}
    >
      <div className="flex gap-2 items-center relative ">
        <div
          className={`shadow-sm message break-words  !min-w-[250px]
            ${item.useName ? 'relative' : ''}
          ${item.messageId === targetChatInfo?.messageId ? 'ring-2 ring-primary/20 animate-[customPulse_1.6s_ease-in-out]' : ''}
          ${item?.messageContent?.toLowerCase() === 'unsupportedmediatype' ? '!bg-gray-100 unsupported' : ''}
           ${item?.messageContent?.toLowerCase()?.startsWith('http') ? '' : ''} 
           ${messages?.length >= index + 1 ? (messages[index + 1]?.to === item.to ? `without-bubble` : '') : ''}
            ${isMe ? 'self rtl' : 'other ltr'}`}
          key={index}
        >
          {item.useName && (
            <div
              className={`absolute items-center text-nowrap flex gap-20 top-[-1.5rem] text-xs ${item.to !== selectedChat?.phoneNumber ? 'w-[89%] flex-row-reverse' : 'pe-[6px] w-[97%]'}`}
            >
              <Space className="w-full flex justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <SendHorizonal
                    className={`relative top-[2px] ${item.to !== selectedChat?.phoneNumber ? '' : '-scale-x-1 rotate-180'}`}
                    size={15}
                  />
                  {t('SentBy', { name: item.useName })}
                </div>
                {/* Clickable link */}
                {(grantedPolicies?.includes('ToolsManagement.SentTemplatesFortHost') ||
                  grantedPolicies?.includes('ToolsManagement.SentTemplates') ||
                  grantedPolicies?.includes('ToolsManagement.EInvitationsTemplatesFortHost') ||
                  grantedPolicies?.includes('ToolsManagement.EInvitationsTemplates')) &&
                  item.templateHistoryId &&
                  (item?.templateType || item?.templateType !== 0) && (
                    <div
                      className="group relative flex items-center gap-1 cursor-pointer"
                      dir={lng === 'ar' ? 'rtl' : 'ltr'}
                      onClick={() => {
                        setTargetChatInfo({
                          cahtId: selectedChat?.id,
                          messageId: item?.messageId,
                          phoneNumber: selectedChat?.phoneNumber,
                        })
                        push(
                          item?.templateType === TemplateTypes.EInvitations
                            ? `/${lng}/admin/tools/sent-einvitations/${item.templateHistoryId}?tab=2`
                            : `/${lng}/admin/tools/sent-templates/${item.templateHistoryId}?tab=2`
                        )
                      }}
                    >
                      <span className="text-[11px] font-medium text-gray-500 transition-colors duration-200  group-hover:text-primary">
                        {t('Details')}
                      </span>

                      <SquareArrowOutUpRight
                        size={13}
                        className="text-gray-500 transition-all duration-200  group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />

                      <span className="absolute -bottom-[2px] left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                    </div>
                  )}
              </Space>
            </div>
          )}
          {item.contextId && refMessage && (
            <div className="reply-msg">
              {refMessage.messageType === 'text' ? (
                refMessage.messageContent
              ) : refMessage.messageType === 'template' ? (
                <>
                  <b className="block mb-2 relative z-20">
                    {refMessage?.messageComponents?.header?.data}
                  </b>
                  <span
                    className="w-full mb-2 block relative z-20 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: renderBodyText2(refMessage?.messageComponents?.body).replace(
                        /\n/g,
                        '<br />'
                      ),
                    }}
                  ></span>
                  {refMessage?.messageComponents?.buttons?.length > 0 &&
                    item.messageType === 'flow' &&
                    refMessage?.messageComponents?.buttons?.map((button: any, index: number) => (
                      <span
                        key={index}
                        style={{
                          paddingBlock: '5px',
                          textAlign: 'center',
                          borderTop: '1px solid #ddd',
                        }}
                        className="flex items-start justify-center gap-1"
                      >
                        {button?.type === 'QUICK_REPLY' ? (
                          <Reply size={14} />
                        ) : button?.type === 'URL' ? (
                          <SquareArrowOutUpRight size={14} />
                        ) : (
                          <></>
                        )}
                        <span
                          className={`${
                            item?.messageContent
                              ?.substring(
                                0,
                                item?.messageContent?.indexOf('/') > -1
                                  ? item?.messageContent?.indexOf('/')
                                  : item?.messageContent?.length
                              )
                              ?.trim() !==
                            button?.data?.substring(0, button?.data?.indexOf('/'))?.trim()
                              ? 'text-gray-400'
                              : 'text-primary font-semibold'
                          }`}
                        >
                          {button?.data?.substring(0, button?.data?.indexOf('/'))?.trim()}
                        </span>
                        <span>/</span>
                        <span
                          className={`${
                            item?.messageContent
                              ?.substring(
                                0,
                                item?.messageContent?.indexOf('/') > -1
                                  ? item?.messageContent?.indexOf('/')
                                  : item?.messageContent?.length
                              )
                              ?.trim() !==
                            button?.data?.substring(button?.data?.indexOf('/') + 1)?.trim()
                              ? 'text-gray-400'
                              : 'text-primary font-semibold'
                          }`}
                        >
                          {button?.data?.substring(button?.data?.indexOf('/') + 1)?.trim()}
                        </span>
                      </span>
                    ))}
                </>
              ) : (
                <Image
                  src={refMessage.messageContent}
                  alt="image"
                  className="!w-[200px] !h-[150px] rounded-[8px] shadow-sm object-cover bg-cover"
                />
              )}
            </div>
          )}
          {/* {item.messageType === 'flow' && (
            <div className="reply-msg !h-auto">
              <>
                <b className="block mb-2 relative z-20">
                  {item?.messageContent?.substring(0, item?.messageContent?.indexOf('/'))}
                </b>
              </>
            </div>
          )} */}
          {item?.messageContent?.toLowerCase() !== 'unsupportedmediatype' ? (
            item.messageType === 'flow' ? (
              item.messageContent?.substring(item?.messageContent?.indexOf('/') + 1)?.trim()
            ) : item.messageType === 'text' ? (
              <span
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: formatMessageText(item.messageContent),
                }}
              />
            ) : item.messageType === 'template' || item.messageType === 'sendTemplate' ? (
              <div
                className={`imessage flex ${setTextAlignment(item?.messageComponents?.body?.data)}`}
              >
                <p
                  className={`!p-0 ${setTextAlignment(item?.messageComponents?.body?.data) === 'text-right rtl' ? '!ps-[0.3rem]' : '!pe-[0.3rem]'}`}
                >
                  {[
                    TEMPLATE_TYPE_IMAGE,
                    TEMPLATE_TYPE_DOCUMENT,
                    TEMPLATE_TYPE_VIDEO,
                    TEMPLATE_TYPE_LOCATION,
                  ].includes(item?.messageComponents?.header?.type) ? (
                    <div
                      className={`rounded-[8px] z-10 relative mb-2 w-full ${item?.messageComponents?.header?.type === TEMPLATE_TYPE_VIDEO ? '' : 'h-[145px]'} flex justify-center items-center bg-gray-200 overflow-hidden shadow-md`}
                    >
                      {item?.messageComponents?.header?.type === TEMPLATE_TYPE_IMAGE && (
                        <Image
                          src={
                            item?.customTemplateImageUrl ||
                            item?.messageComponents?.header?.parameters?.[0]
                          }
                          className="w-full h-[145px] object-cover rounded-[8px]"
                        />
                      )}
                      {item?.messageComponents?.header?.type === TEMPLATE_TYPE_VIDEO && (
                        <video
                          autoPlay={false}
                          className="video-player rounded-[8px] min-height"
                          controls
                        >
                          <source
                            src={item?.messageComponents?.header?.parameters?.[0]}
                            type="video/mp4"
                          />
                        </video>
                      )}
                      {item?.messageComponents?.header?.type === TEMPLATE_TYPE_DOCUMENT && (
                        <div className="w-full h-full overflow-hidden relative">
                          <div
                            className="absolute inset-0 z-10 cursor-pointer"
                            onClick={() =>
                              modal.info({
                                closable: true,
                                closeIcon: <X className="text-white mt-[6px]" size={20} />,
                                content: (
                                  <iframe
                                    src={
                                      item?.customTemplateImageUrl ||
                                      item?.messageComponents?.header?.parameters?.[0]
                                    }
                                    title="iframe"
                                    width="100%"
                                    className="!h-[calc(100vh_-_80px)] !border-0"
                                  ></iframe>
                                ),
                                icon: null,
                                className: 'external-file-modal',
                                footer: false,
                                width: '100%',
                                centered: true,
                              })
                            }
                          ></div>
                          <embed
                            src={
                              item?.customTemplateImageUrl ||
                              item?.messageComponents?.header?.parameters?.[0]
                            }
                            type="application/pdf"
                            className="w-full h-full border-none"
                            onClick={() =>
                              modal.info({
                                closable: true,
                                closeIcon: <X className="text-white mt-[6px]" size={20} />,
                                content: (
                                  <iframe
                                    src={
                                      item?.customTemplateImageUrl ||
                                      item?.messageComponents?.header?.parameters?.[0]
                                    }
                                    title="iframe"
                                    width="100%"
                                    className="!h-[calc(100vh_-_80px)] !border-0"
                                  ></iframe>
                                ),
                                icon: null,
                                className: 'external-file-modal',
                                footer: false,
                                width: '100%',
                                centered: true,
                              })
                            }
                          />
                        </div>
                      )}
                      {item?.messageComponents?.header?.type === TEMPLATE_TYPE_LOCATION && (
                        <iframe
                          title="Google Map"
                          className="w-full h-full rounded-[8px] shadow-lg"
                          src={`https://www.google.com/maps?q=${item?.messageComponents?.header?.parameters?.[2]},${item?.messageComponents?.header?.parameters?.[3]}&hl=es&z=13&output=embed`}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      )}
                    </div>
                  ) : item?.messageComponents?.header?.type === TEMPLATE_TYPE_TEXT ? (
                    <b className="block mb-2 relative z-20">
                      {item?.messageComponents?.header?.data?.includes('{{1}}')
                        ? item?.messageComponents?.header?.data?.replace(
                            '{{1}}',
                            item?.messageComponents?.header?.parameters?.[0]
                          )
                        : item?.messageComponents?.header?.data}
                    </b>
                  ) : null}

                  <span
                    className="w-full mb-2 block relative z-20 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: renderBodyText2(item?.messageComponents?.body).replace(
                        /\n/g,
                        '<br />'
                      ),
                    }}
                  ></span>
                  <span
                    className="w-full block relative z-20 text-gray-500 font-light text-[13px]"
                    style={{
                      marginBottom: '1px',
                    }}
                  >
                    {item?.messageComponents?.footer}
                  </span>
                  <span className="mt-4 block" />
                  {item?.messageComponents?.buttons?.length > 0 &&
                    item?.messageComponents?.buttons?.map((button: any, index: number) => (
                      <span
                        key={index}
                        style={{
                          color: allMessages?.filter(
                            (i: MessageDto) =>
                              i.contextId === item.messageId && button.type === 'QUICK_REPLY'
                          )?.[0]
                            ? '#ccc'
                            : 'var(--primary-color)',
                          paddingBlock: '5px',
                          textAlign: 'center',
                          borderTop: '1px solid #ddd',
                        }}
                        className="flex items-start justify-center gap-2"
                      >
                        {button?.type === 'QUICK_REPLY' ? (
                          <Reply size={14} />
                        ) : button?.type === 'URL' ? (
                          <SquareArrowOutUpRight size={14} />
                        ) : (
                          <></>
                        )}
                        {button?.data}
                      </span>
                    ))}
                </p>
              </div>
            ) : (
              item.messageType !== 'flow' && (
                <Image
                  src={item.messageContent}
                  alt="image"
                  className="!w-[200px] !h-[150px] rounded-[8px] shadow-sm object-cover bg-cover"
                />
              )
            )
          ) : (
            <div className={`${setTextAlignment(t('MessageUnavailable'))} flex gap-3 items-center`}>
              <div className="rounded-full bg-red-400 w-[40px] h-[40px] flex items-center justify-center">
                <MessageSquareX size={24} color="#fff" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-[15px] mb-1">{t('MessageUnavailable')}</h3>
                <p className="text-[13px]">{t('ThisContentMayHaveBeenUnspportedUntilNow')}</p>
              </div>
            </div>
          )}
          <Flex justify="space-between" align="center">
            <span>
              {item.status === MessageStatus.Pending ? (
                <Clock8 size={17} color="#999" />
              ) : item.status === MessageStatus.Failed ? (
                <CircleAlert size={17} color="#d50000" />
              ) : item.status === MessageStatus.Delivered ? (
                <CheckCheck size={17} color="#999" />
              ) : item.status === MessageStatus.Read ? (
                <CheckCheck size={17} color="#61C4E9" />
              ) : (
                <Check size={17} color="#999" />
              )}
            </span>
            <span className="time">
              {moment().diff(moment(item.messageTime), 'hours') >= 24
                ? moment(item.messageTime).format(defaultDateTimeFormat)
                : moment(item.messageTime).fromNow()}
            </span>
          </Flex>
        </div>
        {item.status === MessageStatus.Failed && handleErrorMessage()}
      </div>
    </div>
  )
}
