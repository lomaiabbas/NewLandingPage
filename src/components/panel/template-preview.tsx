'use client'

import { getClientTranslation } from '@/app/i18n/client'
import {
  TEMPLATE_TYPE_DOCUMENT,
  TEMPLATE_TYPE_IMAGE,
  TEMPLATE_TYPE_LOCATION,
  TEMPLATE_TYPE_TEXT,
  TEMPLATE_TYPE_VIDEO,
  defaultTimeFormat24,
} from '@/lib/constants'
import { ModalContext } from '@/lib/context/modal-context'
import {
  renderBodyText,
  renderBodyText2,
  renderBodyText3,
  renderDateTime,
  setTextAlignment,
} from '@/lib/helpers'
import { Image } from 'antd'
import {
  CirclePlay,
  FileText,
  ImageIcon,
  MapPin,
  Reply,
  SquareArrowOutUpRight,
  X,
} from 'lucide-react'
import { useContext } from 'react'
import AnimatedText from './ainmated-text'

export default function TemplatePreview({
  variant,
  data,
  lng,
  id,
  fullWidth,
  print,
}: {
  variant: 'v1' | 'v2' | 'v3' | 'v4'
  data: any
  lng: string
  id: number
  fullWidth?: boolean
  print?: boolean
}) {
  const { modal } = useContext(ModalContext)
  const { t } = getClientTranslation(lng)

  const renderBodyTextWithAnimation = (item: any) => {
    let text = item?.text

    if (!text) return null

    if (item?.example?.[0]?.body_text?.[0]?.length > 0) {
      const parts: (string | JSX.Element)[] = []
      let remainingText = text

      item.example[0].body_text[0].forEach((replaceText: string, index: number) => {
        const placeholder = `{{${index + 1}}}`
        const splitIndex = remainingText.indexOf(placeholder)

        if (splitIndex !== -1) {
          // Push the text before the placeholder
          parts.push(remainingText.substring(0, splitIndex))
          // Push the React component
          parts.push(<AnimatedText key={index} text={placeholder} replaceText={replaceText} />)
          // Update the remaining text
          remainingText = remainingText.substring(splitIndex + placeholder.length)
        }
      })

      // Push any remaining text
      parts.push(remainingText)

      return <>{parts}</>
    }

    return text
  }

  return variant === 'v1' ? (
    <div
      className={`${fullWidth ? `!w-full` : '!w-[320px]'} `}
      key={id + ''}
      style={{
        background: `url(/images/whatsapp-bg.png)`,
        borderRadius: 8,
        minHeight: '325px',
        padding: '15px 20px',
      }}
    >
      <div className={`imessage bg-white ${print ? '!px-3 !pt-0 !pb-0 rounded-[8px]' : ''}`}>
        <p className={`from-them`}>
          {[
            TEMPLATE_TYPE_IMAGE,
            TEMPLATE_TYPE_DOCUMENT,
            TEMPLATE_TYPE_VIDEO,
            TEMPLATE_TYPE_LOCATION,
          ].includes(data?.messageComponents?.header?.type || '') ? (
            <div
              className={`rounded-md z-10 relative mb-2 w-full ${data?.messageComponents?.header?.type === TEMPLATE_TYPE_VIDEO ? '' : 'h-[145px]'} flex justify-center items-center ${data?.messageComponents?.header?.type === TEMPLATE_TYPE_DOCUMENT && data?.messageComponents?.header?.parameters?.[0] ? 'bg-[#57B1E3]' : 'bg-gray-200'} overflow-hidden`}
            >
              {data?.messageComponents?.header?.type === TEMPLATE_TYPE_IMAGE &&
                (data?.messageComponents?.header?.parameters?.[0] ? (
                  <Image
                    src={data?.messageComponents?.header?.parameters?.[0]}
                    className="w-full h-[145px] object-cover "
                  />
                ) : (
                  <ImageIcon size={50} color="#fff" />
                ))}
              {data?.messageComponents?.header?.type === TEMPLATE_TYPE_VIDEO &&
                (data?.messageComponents?.header?.parameters?.[0] ? (
                  <video autoPlay={false} className="video-player min-height" controls>
                    <source
                      src={data?.messageComponents?.header?.parameters?.[0]}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <CirclePlay size={50} color="#fff" />
                ))}
              {data?.messageComponents?.header?.type === TEMPLATE_TYPE_DOCUMENT &&
                (data?.messageComponents?.header?.parameters?.[0] ? (
                  <Image
                    preview={false}
                    src="/images/pdf.jpg"
                    className="!h-[145px] object-contain"
                  />
                ) : (
                  <FileText size={50} color="#fff" />
                ))}
              {data?.messageComponents?.header?.type === TEMPLATE_TYPE_LOCATION && (
                <MapPin size={50} color="#fff" />
              )}
            </div>
          ) : data?.messageComponents?.header?.type === TEMPLATE_TYPE_TEXT ? (
            <b
              style={{ display: 'block', marginBottom: '5px' }}
              className={`${setTextAlignment(data?.messageComponents?.header?.data)}`}
            >
              {data?.messageComponents?.header?.data?.includes('{{1}}')
                ? data?.messageComponents?.header?.data?.replace(
                    '{{1}}',
                    data?.messageComponents?.header?.parameters?.[0]
                  )
                : data?.messageComponents?.header?.data}
            </b>
          ) : null}

          <span
            style={{ display: 'block', marginBottom: '5px' }}
            className={`whitespace-pre-line ${setTextAlignment(data?.messageComponents?.body?.data || '')}`}
            dangerouslySetInnerHTML={{
              __html: renderBodyText2(data?.messageComponents?.body || ''),
            }}
          ></span>
          <span
            style={{ display: 'block', marginBottom: '1px' }}
            className={`text-gray-500 font-light text-[13px] ${setTextAlignment(data?.messageComponents?.footer || '')}`}
          >
            {data?.messageComponents?.footer}
          </span>
          <span
            style={{
              textAlign: lng === 'ar' ? 'left' : 'right',
              width: '100%',
              display: 'block',
              fontSize: '12px',
            }}
          >
            {data?.creationTime && data?.creationTime !== '0001-01-01T00:00:00'
              ? renderDateTime(data?.creationTime, defaultTimeFormat24)
              : t('NotAvailable')}
          </span>
          {data?.messageComponents?.buttons?.map((i: any, index: number) => (
            <span
              style={{
                color: 'var(--primary-color)',
                paddingBlock: '5px',
                borderTop: '1px solid var(--border-color)',
              }}
              className="flex items-start justify-center gap-2"
              key={index}
            >
              {i.type === 'QUICK_REPLY' ? (
                <Reply size={14} />
              ) : i.type === 'URL' ? (
                <SquareArrowOutUpRight size={14} />
              ) : (
                <></>
              )}
              {i.data}
            </span>
          ))}
        </p>
      </div>
    </div>
  ) : variant === 'v2' ? (
    <div
      key={id + ''}
      className="relative"
      style={{
        background: `url(/images/whatsapp-bg.png)`,
        height: '100%',
        minHeight: '325px',
        padding: '15px 20px',
      }}
    >
      <div
        className={`imessage flex ${data?.language === 'en_US' ? (lng == 'en' ? 'justify-start en' : 'justify-end en') : lng == 'ar' ? 'justify-start ar' : 'justify-end ar'}`}
      >
        <p className="from-them">
          {['IMAGE', 'DOCUMENT'].includes(
            data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format
          ) ? (
            <div className="rounded-sm z-10 relative mb-2 w-full h-[125px] bg-gray-200 flex justify-center items-center">
              {data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.example?.[0]
                ?.header_handle?.[0] ? (
                <Image
                  src={
                    data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format ===
                    'DOCUMENT'
                      ? '/images/pdf.jpg'
                      : data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.example?.[0]
                          ?.header_handle?.[0]
                  }
                  alt="image"
                  height={'100%'}
                  width={'100%'}
                  onClick={() => {
                    if (
                      data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format ===
                      'DOCUMENT'
                    ) {
                      modal.info({
                        closable: true,
                        closeIcon: <X className="text-white mt-[6px]" size={20} />,

                        content: (
                          <iframe
                            src={
                              data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]
                                ?.example?.[0]?.header_handle?.[0]
                            }
                            title="iframe"
                            width="100%"
                            className="!h-[calc(100vh_-_80px)] !border-0"
                          ></iframe>
                        ),
                        icon: null,
                        width: '100%',
                        className: 'external-file-modal',
                        footer: false,
                        centered: true,
                      })
                    }
                  }}
                  preview={
                    data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format !==
                    'DOCUMENT'
                  }
                  loading="lazy"
                  className={
                    data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format !==
                    'DOCUMENT'
                      ? 'object-cover rounded-sm bg-gray-200'
                      : 'object-contain bg-[#57B1E3] cursor-pointer'
                  }
                />
              ) : (
                <ImageIcon size={70} color="#fff" />
              )}
            </div>
          ) : data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format === 'VIDEO' ? (
            <video autoPlay={false} className="video-player" controls>
              <source
                src={
                  data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.example?.[0]
                    ?.header_handle?.[0]
                }
                type="video/mp4"
              />
            </video>
          ) : data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format ===
            'LOCATION' ? (
            <div className="rounded-sm z-10 relative mb-2 w-full h-[125px] bg-gray-200 flex justify-center items-center">
              <MapPin size={70} color="#fff" />
            </div>
          ) : (
            <b
              className="block mb-2 relative z-20"
              style={{
                textAlign: data?.language === 'en_US' ? 'left' : 'right',
                direction: data?.language === 'en_US' ? 'ltr' : 'rtl',
              }}
            >
              {data?.components
                ?.filter((i: any) => i.type === 'HEADER')?.[0]
                ?.text?.replace(
                  '{{1}}',
                  data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.example?.[0]
                    ?.header_text?.[0]
                )}
            </b>
          )}
          <span
            className="w-full mb-2 block relative z-20 whitespace-pre-line"
            style={{
              textAlign: data?.language === 'en_US' ? 'left' : 'right',
              direction: data?.language === 'en_US' ? 'ltr' : 'rtl',
            }}
            dangerouslySetInnerHTML={{
              __html: renderBodyText(data?.components?.filter((i: any) => i.type === 'BODY')?.[0]),
            }}
          ></span>

          <span
            className="w-full block relative z-20 text-gray-700"
            style={{
              textAlign: data?.language === 'en_US' ? 'left' : 'right',
              direction: data?.language === 'en_US' ? 'ltr' : 'rtl',
              marginBottom: '1px',
            }}
          >
            {data?.components?.filter((i: any) => i.type === 'FOOTER')?.[0]?.text}
          </span>
          <span
            style={{
              textAlign: data?.language !== 'en_US' ? 'left' : 'right',
              width: '100%',
              display: 'block',
              fontSize: '12px',
            }}
          >
            {data?.creationTime && data?.creationTime !== '0001-01-01T00:00:00'
              ? renderDateTime(data?.creationTime, defaultTimeFormat24)
              : t('NotAvailable')}
          </span>
          {data?.components
            ?.filter((i: any) => i.type === 'BUTTONS')?.[0]
            ?.buttons?.map((i: any, index: number) => (
              <span
                style={{
                  color: 'var(--primary-color)',
                  paddingBlock: '5px',
                  borderTop: '1px solid var(--border-color)',
                }}
                className="flex items-start justify-center gap-2"
                key={index}
              >
                {i.type === 'QUICK_REPLY' ? (
                  <Reply size={14} />
                ) : i.type === 'URL' ? (
                  <SquareArrowOutUpRight size={14} />
                ) : (
                  <></>
                )}
                {i.text}
              </span>
            ))}
        </p>
      </div>
      {/* <span className={`ribbon ${item.language === "en_US" ? 'left' :'right'}`}><span>{t(item.status)}</span></span>
          <span className={`ribbon ribbon2 ${item.language === "en_US" ? 'left' :'right'}`}><span>{t(item.category)}</span></span> */}
    </div>
  ) : variant === 'v3' ? (
    <div
      key={id + ''}
      className="!max-w-[320px] sticky top-10"
      style={{
        background: `url(/images/whatsapp-bg.png)`,
        borderRadius: 8,
        minHeight: '325px',
        padding: '15px 20px',
      }}
    >
      <div className="imessage">
        <p className={`from-them`}>
          {[
            TEMPLATE_TYPE_IMAGE,
            TEMPLATE_TYPE_DOCUMENT,
            TEMPLATE_TYPE_VIDEO,
            TEMPLATE_TYPE_LOCATION,
          ].includes(data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.format) ? (
            <div
              className={`rounded-md z-10 relative mb-2 w-full ${data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.format === TEMPLATE_TYPE_VIDEO ? '' : 'h-[145px]'} flex justify-center items-center ${data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.format === TEMPLATE_TYPE_DOCUMENT && data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.example?.[0]?.header_handle?.[0] ? 'bg-[#57B1E3]' : 'bg-gray-200'} overflow-hidden`}
            >
              {data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.format ===
                TEMPLATE_TYPE_IMAGE &&
                (data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.example?.[0]
                  ?.header_handle?.[0] ? (
                  <Image
                    src={
                      data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.example?.[0]
                        ?.header_handle?.[0]
                    }
                    className="w-full h-[145px] object-cover "
                  />
                ) : (
                  <ImageIcon size={50} color="#fff" />
                ))}
              {data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.format ===
                TEMPLATE_TYPE_VIDEO &&
                (data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.example?.[0]
                  ?.header_handle?.[0] ? (
                  <video autoPlay={false} className="video-player min-height" controls>
                    <source
                      src={
                        data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.example?.[0]
                          ?.header_handle?.[0]
                      }
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <CirclePlay size={50} color="#fff" />
                ))}
              {data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.format ===
                TEMPLATE_TYPE_DOCUMENT &&
                (data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.example?.[0]
                  ?.header_handle?.[0] ? (
                  <Image
                    preview={false}
                    src="/images/pdf.jpg"
                    className="!h-[145px] object-contain"
                  />
                ) : (
                  <FileText size={50} color="#fff" />
                ))}
              {data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.format ===
                TEMPLATE_TYPE_LOCATION && <MapPin size={50} color="#fff" />}
            </div>
          ) : data?.components?.filter((c: any) => c.type === 'HEADER')?.[0]?.format ===
            TEMPLATE_TYPE_TEXT ? (
            <b
              style={{ display: 'block', marginBottom: '5px' }}
              className={`${setTextAlignment(data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.text)}`}
            >
              {data?.components
                ?.filter((i: any) => i.type === 'HEADER')?.[0]
                ?.text.includes('{{1}}') ? (
                <>
                  {
                    data?.components
                      ?.filter((i: any) => i.type === 'HEADER')?.[0]
                      ?.text?.split('{{1}}')?.[0]
                  }
                  <AnimatedText
                    text="{{1}}"
                    replaceText={
                      data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.example?.[0]
                        ?.header_text?.[0]
                    }
                  />

                  {
                    data?.components
                      ?.filter((i: any) => i.type === 'HEADER')?.[0]
                      ?.text?.split('{{1}}')?.[1]
                  }
                </>
              ) : (
                data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.text
              )}
            </b>
          ) : null}

          <span
            style={{ display: 'block', marginBottom: '5px' }}
            className={`whitespace-pre-line ${setTextAlignment(data?.components?.filter((i: any) => i.type === 'BODY')?.[0]?.text)}`}
          >
            {renderBodyTextWithAnimation(
              data?.components?.filter((i: any) => i.type === 'BODY')?.[0]
            )}
          </span>
          <span
            style={{ display: 'block', marginBottom: '2px' }}
            className={`text-gray-500 font-light text-[13px] ${setTextAlignment(data?.components?.filter((c: any) => c.type === 'FOOTER')?.[0]?.text)}`}
          >
            {data?.components?.filter((c: any) => c.type === 'FOOTER')?.[0]?.text}
          </span>
          <span
            style={{
              textAlign: lng === 'ar' ? 'left' : 'right',
              width: '100%',
              display: 'block',
              fontSize: '12px',
            }}
          >
            {data?.creationTime && data?.creationTime !== '0001-01-01T00:00:00'
              ? renderDateTime(data?.creationTime, defaultTimeFormat24)
              : t('NotAvailable')}
          </span>
          {data?.components
            ?.filter((c: any) => c.type === 'BUTTONS')?.[0]
            ?.buttons?.map((i: any, index: number) => (
              <span
                style={{
                  color: 'var(--primary-color)',
                  paddingBlock: '5px',
                  borderTop: '1px solid var(--border-color)',
                }}
                className="flex items-start justify-center gap-2"
                key={index}
              >
                {i.type === 'QUICK_REPLY' ? (
                  <Reply size={14} />
                ) : i.type === 'URL' ? (
                  <SquareArrowOutUpRight size={14} />
                ) : (
                  <></>
                )}
                {i.text}
              </span>
            ))}
        </p>
      </div>
    </div>
  ) : (
    <div
      key={id + ''}
      className={fullWidth ? `!w-full` : '!w-[320px]'}
      style={{
        background: `url(/images/whatsapp-bg.png)`,
        height: '100%',
        minHeight: '325px',
        padding: '15px 20px',
      }}
    >
      <div
        className={`imessage flex ${data?.language === 'en_US' ? (lng == 'en' ? 'justify-start en' : 'justify-end en') : lng == 'ar' ? 'justify-start ar' : 'justify-end ar'}`}
      >
        <p className="from-them">
          {['IMAGE', 'DOCUMENT'].includes(
            data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format
          ) ? (
            <div className="rounded-sm z-10 relative mb-2 w-full h-[125px] bg-gray-200 flex justify-center items-center">
              {data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.example
                ?.header_handle?.[0] ? (
                <Image
                  src={
                    data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format ===
                    'DOCUMENT'
                      ? '/images/pdf.jpg'
                      : data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.example
                          ?.header_handle?.[0]
                  }
                  alt="image"
                  height={'100%'}
                  width={'100%'}
                  onClick={() => {
                    if (
                      data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format ===
                      'DOCUMENT'
                    ) {
                      modal.info({
                        closable: true,
                        closeIcon: <X className="text-white mt-[6px]" size={20} />,
                        content: (
                          <iframe
                            src={
                              data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]
                                ?.example?.header_handle?.[0]
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
                  }}
                  preview={
                    data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format !==
                    'DOCUMENT'
                  }
                  loading="lazy"
                  className={
                    data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format !==
                    'DOCUMENT'
                      ? 'object-cover rounded-sm bg-gray-200'
                      : 'object-contain bg-[#57B1E3] cursor-pointer'
                  }
                />
              ) : (
                <ImageIcon size={70} color="#fff" />
              )}
            </div>
          ) : data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format === 'VIDEO' ? (
            <video autoPlay={false} className="video-player" controls>
              <source
                src={
                  data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.example
                    ?.header_handle?.[0]
                }
                type="video/mp4"
              />
            </video>
          ) : data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.format ===
            'LOCATION' ? (
            <div className="rounded-sm z-10 relative mb-2 w-full h-[125px] bg-gray-200 flex justify-center items-center">
              <MapPin size={70} color="#fff" />
            </div>
          ) : (
            <b
              className="block mb-2 relative z-20"
              style={{
                textAlign: data?.language === 'en_US' ? 'left' : 'right',
                direction: data?.language === 'en_US' ? 'ltr' : 'rtl',
              }}
            >
              {data?.components
                ?.filter((i: any) => i.type === 'HEADER')?.[0]
                ?.text?.replace(
                  '{{1}}',
                  data?.components?.filter((i: any) => i.type === 'HEADER')?.[0]?.example
                    ?.header_text?.[0]
                )}
            </b>
          )}
          <span
            className="w-full mb-2 block relative z-20 whitespace-pre-line"
            style={{
              textAlign: data?.language === 'en_US' ? 'left' : 'right',
              direction: data?.language === 'en_US' ? 'ltr' : 'rtl',
            }}
            dangerouslySetInnerHTML={{
              __html: renderBodyText3(data?.components?.filter((i: any) => i.type === 'BODY')?.[0]),
            }}
          ></span>

          <span
            className="w-full mb-2 block relative z-20"
            style={{
              textAlign: data?.language === 'en_US' ? 'left' : 'right',
              direction: data?.language === 'en_US' ? 'ltr' : 'rtl',
            }}
          >
            {data?.components?.filter((i: any) => i.type === 'FOOTER')?.[0]?.text}
          </span>
          <span
            style={{
              textAlign: data?.language !== 'en_US' ? 'left' : 'right',
              width: '100%',
              display: 'block',
              fontSize: '12px',
            }}
          >
            {data?.creationTime && data?.creationTime !== '0001-01-01T00:00:00'
              ? renderDateTime(data?.creationTime, defaultTimeFormat24)
              : t('NotAvailable')}
          </span>
          {data?.components
            ?.filter((i: any) => i.type === 'BUTTONS')?.[0]
            ?.buttons?.map((i: any, index: number) => (
              <span
                style={{
                  color: 'var(--primary-color)',
                  paddingBlock: '5px',
                  borderTop: '1px solid var(--border-color)',
                }}
                className="flex items-start justify-center gap-2"
                key={index}
              >
                {i.type === 'QUICK_REPLY' ? (
                  <Reply size={14} />
                ) : i.type === 'URL' ? (
                  <SquareArrowOutUpRight size={14} />
                ) : (
                  <></>
                )}
                {i.text}
              </span>
            ))}
        </p>
      </div>
      {/* <span className={`ribbon ${item.language === "en_US" ? 'left' :'right'}`}><span>{t(item.status)}</span></span>
          <span className={`ribbon ribbon2 ${item.language === "en_US" ? 'left' :'right'}`}><span>{t(item.category)}</span></span> */}
    </div>
  )
}
