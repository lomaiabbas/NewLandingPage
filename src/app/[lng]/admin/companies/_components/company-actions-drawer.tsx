import { getClientTranslation } from '@/app/i18n/client'
import { FALLBACK_IMAGE } from '@/lib/constants'
import { renderIndustry } from '@/lib/helpers'
import { popupConfirm } from '@/lib/popup-confirm'
import Rules from '@/lib/rules'
import channelsForAdminServiceInstance from '@/lib/services/channels-for-admin'
import { CompanyChannelForAdminDetailsResponseDto } from '@/lib/services/channels-for-admin/dto'
import { ActiveStatus } from '@/lib/services/dto'
import {
  Button,
  Col,
  Descriptions,
  DescriptionsProps,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Switch,
  Tag,
  Tooltip,
} from 'antd'
import {
  CalendarPlus,
  Check,
  LinkIcon,
  Loader2,
  MailPlus,
  Phone,
  PlugIcon,
  PlusSquare,
  RefreshCcw,
  Webhook,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface CompanyActionsDrawerProps {
  lng: string
  company: any
  open: boolean
  onClose: () => void
  onUpdate: () => void
}

const actionsType = {
  connectMeta: 'connect-meta',
  resetMeta: 'reset-meta',
  subscribeOrUnsubscribeWebhook: 'subscribe-or-unsubscribe-webhook',
  // unsubscribeWebhook: 'unsubscribe-webhook',
  registerOrUnregisterPhone: 'register-or-unregister-phone',
  // unregisterPhone: 'unregister-phone',
  dailyTemplate: 'daily-template',
  invitationAr: 'invitation-ar',
  invitationEn: 'invitation-en',
}

export function CompanyActionsDrawer({
  lng,
  company,
  open,
  onClose,
  onUpdate,
}: CompanyActionsDrawerProps) {
  const { t } = getClientTranslation(lng)
  const [form] = Form.useForm()
  const [runningAction, setRunningAction] = useState<string | null>(null)
  const [completedAction, setCompletedAction] = useState<string | null>(null)
  const [channelDetails, setChannelDetails] = useState<CompanyChannelForAdminDetailsResponseDto>()
  const [isChannelDetailsLoading, setIsChannelDetailsLoading] = useState(false)
  const [openConnectMetaModal, setOpenConnectMetaModal] = useState(false)
  const [isConnectMetaLoading, setIsConnectMetaLoading] = useState(false)

  const getData = async (company: any) => {
    try {
      setIsChannelDetailsLoading(true)
      let result: any = await channelsForAdminServiceInstance.getChannelsForAdminDetails(
        company?.id
      )
      setChannelDetails(result)
    } catch (error) {
      console.error(error)
    } finally {
      setIsChannelDetailsLoading(false)
    }
  }

  useEffect(() => {
    if (company && open) {
      getData(company)
    }
  }, [open, company])

  useEffect(() => {
    if (openConnectMetaModal && channelDetails) {
      form.setFieldValue(
        'whatsAppBusinessPhoneNumberId',
        channelDetails?.whatsAppBusinessPhoneNumberId
      )
      form.setFieldValue('whatsAppBusinessAccountId', channelDetails?.whatsAppBusinessAccountId)
      form.setFieldValue('whatsAppBusinessId', channelDetails?.whatsAppBusinessId)
      form.setFieldValue('arTemplateFlowId', channelDetails?.arTemplateFlowId)
      form.setFieldValue('enTemplateFlowId', channelDetails?.enTemplateFlowId)
    } else {
      form.setFieldValue('whatsAppBusinessPhoneNumberId', undefined)
      form.setFieldValue('whatsAppBusinessAccountId', undefined)
      form.setFieldValue('whatsAppBusinessId', undefined)
      form.setFieldValue('arTemplateFlowId', undefined)
      form.setFieldValue('enTemplateFlowId', undefined)
    }
  }, [openConnectMetaModal, channelDetails])

  const handleCompanyAction = async ({
    actionKey,
    confirmMsg,
    successMsg,
    errorMsg,
    service,
  }: {
    actionKey: string
    confirmMsg: string
    successMsg: string
    errorMsg: string
    service?: () => Promise<void>
  }) => {
    popupConfirm(
      async () => {
        try {
          if (service) await service()

          message.success(
            t(successMsg, {
              name: lng === 'ar' ? company?.arName : company?.enName,
            }),
            5
          )

          setCompletedAction(actionKey)
          setRunningAction(null)
          setTimeout(() => setCompletedAction(null), 1500)
          await getData(company)
          await onUpdate()
        } catch {
          message.error(t(errorMsg))
          setRunningAction(null)
          setTimeout(() => setCompletedAction(null), 1500)
        }
      },
      confirmMsg,
      '',
      () => {
        setRunningAction(null)
      }
    )
  }

  const handleOpenConnectMetaModal = async () => {
    setOpenConnectMetaModal(true)
  }

  const handleConnectMeta = async (values: any) => {
    try {
      setIsConnectMetaLoading(true)

      channelsForAdminServiceInstance.connectCompanyWithMeta({
        ...values,
        companyId: company?.id,
      })

      setCompletedAction(actionsType.connectMeta)
      setRunningAction(null)
      setTimeout(() => setCompletedAction(null), 1500)
      setOpenConnectMetaModal(false)
      form.resetFields()
      message.success(
        t('TheCompanyChannelHasBeenSuccessfullyConnectedWithMeta', {
          name: lng === 'ar' ? company?.arName : company?.enName,
        }),
        5
      )
      await getData(company)
      await onUpdate()
    } finally {
      setIsConnectMetaLoading(false)
    }
  }

  const handleResetMeta = () =>
    handleCompanyAction({
      actionKey: actionsType.resetMeta,
      confirmMsg: t('AreYouSureYouWantToResetThisCompanyWithMeta', {
        name: lng === 'ar' ? company?.arName : company?.enName,
      }),
      successMsg: 'TheCompanyChannelHasBeenSuccessfullyResetWithMeta',
      errorMsg: 'FailedToResetWithMeta',
      service: async () => {
        await channelsForAdminServiceInstance.deleteChannel(company?.id, channelDetails?.id)
      },
    })

  const handleSubscribeOrUnsubscribeWebhook = (reAction?: boolean) =>
    reAction
      ? handleCompanyAction({
          actionKey: actionsType.subscribeOrUnsubscribeWebhook,
          confirmMsg: t('AreYouSureYouWantToSubscribeWebhookForThisCompany', {
            name: lng === 'ar' ? company?.arName : company?.enName,
          }),
          successMsg: 'TheCompanyWebhookHasBeenSuccessfullySubscribed',
          errorMsg: 'FailedToSubscribeWebhook',
          service: async () => {
            await channelsForAdminServiceInstance.subscribeWebhook(company?.id)
          },
        })
      : channelDetails?.isLinkedWebhook
        ? handleCompanyAction({
            actionKey: actionsType.subscribeOrUnsubscribeWebhook,
            confirmMsg: t('AreYouSureYouWantToUnsubscribeWebhookForThisCompany', {
              name: lng === 'ar' ? company?.arName : company?.enName,
            }),
            successMsg: 'TheCompanyWebhookHasBeenSuccessfullyUnsubscribed',
            errorMsg: 'FailedToUnsubscribeWebhook',
            service: async () => {
              await channelsForAdminServiceInstance.unsubscribeWebhook(company?.id)
            },
          })
        : handleCompanyAction({
            actionKey: actionsType.subscribeOrUnsubscribeWebhook,
            confirmMsg: t('AreYouSureYouWantToSubscribeWebhookForThisCompany', {
              name: lng === 'ar' ? company?.arName : company?.enName,
            }),
            successMsg: 'TheCompanyWebhookHasBeenSuccessfullySubscribed',
            errorMsg: 'FailedToSubscribeWebhook',
            service: async () => {
              await channelsForAdminServiceInstance.subscribeWebhook(company?.id)
            },
          })

  const handleCreateDailyConnectionTemplate = () =>
    handleCompanyAction({
      actionKey: actionsType.dailyTemplate,
      confirmMsg: t('AreYouSureYouWantToCreateDailyConnectionTemplate', {
        name: lng === 'ar' ? company?.arName : company?.enName,
      }),
      successMsg: 'DailyConnectionTemplateCreatedSuccessfully',
      errorMsg: 'FailedToCreateDailyConnectionTemplate',
      service: async () => {
        await channelsForAdminServiceInstance.dailyTemplateConnect(company?.id)
      },
    })

  const handleCreateEInvitationTemplateArabic = () =>
    handleCompanyAction({
      actionKey: actionsType.invitationAr,
      confirmMsg: t('AreYouSureYouWantToCreateEInvitationTemplateArabic', {
        name: lng === 'ar' ? company?.arName : company?.enName,
      }),
      successMsg: 'EInvitationTemplateArabicCreatedSuccessfully',
      errorMsg: 'FailedToCreateEInvitationTemplateArabic',
      service: async () => {
        await channelsForAdminServiceInstance.createEInvitationTemplateArabic(company?.id)
      },
    })

  const handleCreateEInvitationTemplateEnglish = () =>
    handleCompanyAction({
      actionKey: actionsType.invitationEn,
      confirmMsg: t('AreYouSureYouWantToCreateEInvitationTemplateEnglish', {
        name: lng === 'ar' ? company?.arName : company?.enName,
      }),
      successMsg: 'EInvitationTemplateEnglishCreatedSuccessfully',
      errorMsg: 'FailedToCreateEInvitationTemplateEnglish',
      service: async () => {
        await channelsForAdminServiceInstance.createEInvitationTemplateEnglish(company?.id)
      },
    })

  const handleRegisterOrUnregisterPhoneNumber = (reAction?: boolean) =>
    reAction
      ? handleCompanyAction({
          actionKey: actionsType.registerOrUnregisterPhone,
          confirmMsg: t('AreYouSureYouWantToRegisterPhoneNumberWithMeta', {
            name: lng === 'ar' ? company?.arName : company?.enName,
          }),
          successMsg: 'RegisterPhoneNumberWithMetaSuccessfully',
          errorMsg: 'FailedToRegisterPhoneNumberWithMeta',
          service: async () => {
            await channelsForAdminServiceInstance.registerPhoneNumber(company?.id)
          },
        })
      : channelDetails?.isRegisteredNumber
        ? handleCompanyAction({
            actionKey: actionsType.registerOrUnregisterPhone,
            confirmMsg: t('AreYouSureYouWantToUnregisterPhoneNumberWithMeta', {
              name: lng === 'ar' ? company?.arName : company?.enName,
            }),
            successMsg: 'UnregisterPhoneNumberWithMetaSuccessfully',
            errorMsg: 'FailedToUnregisterPhoneNumberWithMeta',
            service: async () => {
              await channelsForAdminServiceInstance.unregisterPhoneNumber(company?.id)
            },
          })
        : handleCompanyAction({
            actionKey: actionsType.registerOrUnregisterPhone,
            confirmMsg: t('AreYouSureYouWantToRegisterPhoneNumberWithMeta', {
              name: lng === 'ar' ? company?.arName : company?.enName,
            }),
            successMsg: 'RegisterPhoneNumberWithMetaSuccessfully',
            errorMsg: 'FailedToRegisterPhoneNumberWithMeta',
            service: async () => {
              await channelsForAdminServiceInstance.registerPhoneNumber(company?.id)
            },
          })

  const actionHandlers = {
    [actionsType.connectMeta]: handleOpenConnectMetaModal,
    [actionsType.subscribeOrUnsubscribeWebhook]: handleSubscribeOrUnsubscribeWebhook,
    [actionsType.registerOrUnregisterPhone]: handleRegisterOrUnregisterPhoneNumber,
    [actionsType.dailyTemplate]: handleCreateDailyConnectionTemplate,
    [actionsType.invitationAr]: handleCreateEInvitationTemplateArabic,
    [actionsType.invitationEn]: handleCreateEInvitationTemplateEnglish,
  }

  const handleActionWithFeedback = async (key: string, label: string) => {
    setRunningAction(key)
    setCompletedAction(null)
    await actionHandlers[key]?.()
  }

  const integrationCards: {
    key: string
    icon: React.ReactNode
    label: string
    statusKey?: string
    statusPrimaryColor?: string
    isChecked?: boolean
    accentClass: string
    iconButtonForCreate?: React.ReactNode
    onReAction?: any
    tooltipText?: string
  }[] = Boolean(channelDetails)
    ? [
        {
          key: actionsType.connectMeta,
          icon: <LinkIcon className="h-4 w-4" />,
          label: t('MetaChannelConnection'),
          statusKey: Boolean(
            channelDetails?.whatsAppBusinessAccountId &&
              channelDetails?.whatsAppBusinessPhoneNumberId
          )
            ? t('Connected')
            : t('Disconnected'),
          statusPrimaryColor: Boolean(
            channelDetails?.whatsAppBusinessAccountId &&
              channelDetails?.whatsAppBusinessPhoneNumberId
          )
            ? 'text-primary'
            : '',
          accentClass: 'from-primary/10 to-primary/5 !border-primary/20',
          tooltipText: t('Reset'),
          onReAction: () => handleResetMeta(),
          iconButtonForCreate: (
            <Button type="primary">
              <PlugIcon size={20} />
            </Button>
          ),
        },
        {
          key: actionsType.subscribeOrUnsubscribeWebhook,
          icon: <Webhook className="h-4 w-4" />,
          label: t('WebhookSubscription'),
          statusKey: Boolean(channelDetails?.isLinkedWebhook) ? t('Subscribed') : t('Unsubscribed'),
          accentClass: channelDetails?.isLinkedWebhook
            ? 'from-destructive/10 to-destructive/5'
            : 'from-primary/10 to-primary/5 border-primary/20',
          statusPrimaryColor: Boolean(channelDetails?.isLinkedWebhook) ? 'text-primary' : '',
          isChecked: channelDetails?.isLinkedWebhook,
          tooltipText: t('RescribeWebhook'),
          onReAction: () => handleSubscribeOrUnsubscribeWebhook(true),
        },
        {
          key: actionsType.registerOrUnregisterPhone,
          icon: <Phone className="h-4 w-4" />,
          label: t('MetaPhoneNumberRegistration'),
          accentClass: channelDetails?.isRegisteredNumber
            ? 'from-destructive/10 to-destructive/5'
            : 'from-success/10 to-success/5 border-success/20',
          statusKey: Boolean(channelDetails?.isRegisteredNumber)
            ? t('Registered')
            : t('Unregistered'),
          statusPrimaryColor: Boolean(channelDetails?.isRegisteredNumber) ? 'text-primary' : '',
          isChecked: Boolean(channelDetails?.isRegisteredNumber),
          tooltipText: t('ReregisterPhoneNumber'),
          onReAction: () => handleRegisterOrUnregisterPhoneNumber(true),
        },
      ]
    : [
        {
          key: actionsType.connectMeta,
          icon: <LinkIcon className="h-4 w-4" />,
          label: t('MetaChannelConnection'),
          accentClass: 'from-primary/10 to-primary/5 !border-primary/20',
          statusKey: Boolean(
            channelDetails?.whatsAppBusinessAccountId &&
              channelDetails?.whatsAppBusinessPhoneNumberId
          )
            ? t('Connected')
            : t('Disconnected'),
          statusPrimaryColor: Boolean(
            channelDetails?.whatsAppBusinessAccountId &&
              channelDetails?.whatsAppBusinessPhoneNumberId
          )
            ? 'text-primary'
            : '',
          tooltipText: t('Reset'),
          onReAction: () => handleResetMeta(),
          iconButtonForCreate: (
            <Button type="primary">
              <PlugIcon size={20} />
            </Button>
          ),
        },
      ]

  const templateCards: {
    key: string
    icon: React.ReactNode
    statusPrimaryColor?: string
    iconButtonForCreate?: React.ReactNode
    label: string
    isChecked?: boolean
    accentClass: string
  }[] = [
    {
      key: actionsType.dailyTemplate,
      icon: <CalendarPlus className="h-4 w-4 text-primary" />,
      label: t('CreateDailyConnectionTemplate'),
      accentClass: 'from-primary/10 to-primary/5 border-primary/20',
      isChecked: Boolean(channelDetails?.isHaveTemplateDailyConnect),
      statusPrimaryColor: Boolean(channelDetails?.isHaveTemplateDailyConnect) ? 'text-primary' : '',
      iconButtonForCreate: <PlusSquare size={20} color="#07c692" />,
    },
    {
      key: actionsType.invitationAr,
      icon: <MailPlus className="h-4 w-4 text-green-600" />,
      label: t('CreateEInvitationTemplateFlowArabic'),
      accentClass: 'from-accent/20 to-accent/10',
      isChecked: Boolean(channelDetails?.arTemplateFlowId),
      statusPrimaryColor: Boolean(channelDetails?.arTemplateFlowId) ? 'text-primary' : '',
      iconButtonForCreate: <PlusSquare size={20} color="#07c692" />,
    },
    {
      key: actionsType.invitationEn,
      icon: <MailPlus className="h-4 w-4 text-blue-600" />,
      label: t('CreateEInvitationTemplateFlowEnglish'),
      accentClass: 'from-accent/20 to-accent/10',
      isChecked: Boolean(channelDetails?.enTemplateFlowId),
      statusPrimaryColor: Boolean(channelDetails?.enTemplateFlowId) ? 'text-primary' : '',
      iconButtonForCreate: <PlusSquare size={20} color="#07c692" />,
    },
  ]

  const basicInfoItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: t('ID'),
      children: company?.id,
    },
    {
      key: '2',
      label: t('Status'),
      children: (
        <Tag color={company?.status === ActiveStatus.Active ? 'green-inverse' : 'red-inverse'}>
          {company?.status === ActiveStatus.Active ? t('Active') : t('Inactive')}
        </Tag>
      ),
    },
    {
      key: '3',
      label: t('Industry'),
      children:
        company?.industry !== null && company?.industry !== undefined
          ? t(renderIndustry(+company?.industry))
          : t('NotAvailable'),
    },
    {
      key: '10',
      label: t('CompanyEmail'),
      children: company?.email || t('NotAvailable'),
    },
    {
      key: '4',
      label: t('Country'),
      children: company?.city?.country?.text || t('NotAvailable'),
    },
    {
      key: '5',
      label: t('City'),
      children: company?.city?.text || t('NotAvailable'),
    },
  ]

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={'large'}
      loading={isChannelDetailsLoading}
      title={
        <div className="flex items-center gap-3">
          <Image
            width={50}
            height={50}
            className="rounded-md object-contain"
            src={(lng === 'ar' ? company?.arLogo : company?.enLogo) ?? FALLBACK_IMAGE}
            alt={lng === 'ar' ? company?.arName : company?.enName}
          />
          <div className="min-w-0">
            <div className="text-md font-semibold text-foreground">
              {lng === 'ar' ? company?.arName : company?.enName}
            </div>
          </div>
        </div>
      }
      placement={lng === 'en' ? 'right' : 'left'}
    >
      <Spin spinning={!company}>
        <Row className="w-full" gutter={[0, 15]}>
          {/* Company info summary */}
          <Col span={24}>
            <Descriptions
              className="!p-3 rounded-[10px] bg-[#f0f2f480]"
              layout="vertical"
              colon={false}
              items={basicInfoItems}
            />
          </Col>

          <Col span={24}>
            <Divider className="!m-2" />
          </Col>

          {/* Integrations - Interactive Cards */}

          <Col span={24}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {t('Integrations')}
            </h4>

            <Row className="w-full" gutter={[15, 15]}>
              {integrationCards.map((card) => (
                <ActionCard
                  lng={lng}
                  key={card.key}
                  actionKey={card.key}
                  icon={card.icon}
                  label={card.label}
                  accentClass={card.accentClass}
                  statusBadge={card.statusKey}
                  statusPrimaryColor={card?.statusPrimaryColor}
                  isChecked={Boolean(card?.isChecked)}
                  isRunning={runningAction === card.key}
                  isCompleted={completedAction === card.key}
                  onReAction={card?.onReAction}
                  tooltipText={card?.tooltipText}
                  iconButtonForCreate={card?.iconButtonForCreate}
                  onExecute={() => handleActionWithFeedback(card.key, card.label)}
                  disabled={runningAction !== null}
                />
              ))}
            </Row>
          </Col>

          <Col span={24}>
            <Divider className="!m-2" />
          </Col>

          {/* Templates */}
          {Boolean(channelDetails) ? (
            <Col span={24}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t('Templates')}
              </h4>

              <Row className="w-full" gutter={[15, 15]}>
                {templateCards.map((card) => (
                  <ActionCard
                    lng={lng}
                    key={card.key}
                    actionKey={card.key}
                    icon={card.icon}
                    label={card.label}
                    accentClass={card.accentClass}
                    isRunning={runningAction === card.key}
                    isCompleted={completedAction === card.key}
                    statusBadge={card.isChecked && company ? t('Created') : t('NotCreated')}
                    statusPrimaryColor={card?.statusPrimaryColor}
                    isChecked={Boolean(card?.isChecked)}
                    iconButtonForCreate={card?.iconButtonForCreate}
                    onExecute={() => handleActionWithFeedback(card.key, card.label)}
                    disabled={runningAction !== null}
                  />
                ))}
              </Row>
            </Col>
          ) : (
            <></>
          )}
        </Row>
      </Spin>

      <Modal
        title={t('MetaChannelConnection')}
        open={openConnectMetaModal}
        centered
        footer={null}
        zIndex={9999}
        onCancel={() => {
          setRunningAction(null)
          setOpenConnectMetaModal(false)
        }}
      >
        <Form
          form={form}
          onFinish={handleConnectMeta}
          className="h-full flex flex-col justify-between"
          layout="vertical"
          autoComplete="off"
        >
          <div>
            <Form.Item
              className="mb-0"
              rules={[new Rules().getMandatoryRule()]}
              label={t('WhatsAppBusinessPhoneNumberId')}
              name="whatsAppBusinessPhoneNumberId"
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              className="mb-0"
              rules={[new Rules().getMandatoryRule()]}
              label={t('WhatsAppBusinessAccountId')}
              name="whatsAppBusinessAccountId"
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item className="mb-0" label={t('WhatsAppBusinessId')} name="whatsAppBusinessId">
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item className="mb-0" label={t('ArTemplateFlowId')} name="arTemplateFlowId">
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item className="mb-1" label={t('EnTemplateFlowId')} name="enTemplateFlowId">
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item className="flex-1 !mb-0 flex justify-end">
              <Button type="primary" htmlType="submit" size="large" loading={isConnectMetaLoading}>
                {t('Save')}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Drawer>
  )
}

function ActionCard({
  lng,
  actionKey,
  icon,
  label,
  accentClass,
  statusBadge,
  statusPrimaryColor,
  iconButtonForCreate,
  isRunning,
  isCompleted,
  isChecked,
  tooltipText,
  onReAction,
  onExecute,
  disabled,
}: {
  lng: string
  actionKey: string
  icon: React.ReactNode
  label: string
  accentClass: string
  statusPrimaryColor?: string
  statusBadge?: React.ReactNode
  iconButtonForCreate?: React.ReactNode
  isRunning: boolean
  isCompleted: boolean
  isChecked: boolean
  tooltipText?: string
  onReAction?: () => void
  onExecute: () => void
  disabled: boolean
}) {
  const { t } = getClientTranslation(lng)

  return (
    <Col key={actionKey} span={12}>
      <div
        className={`flex-1 relative flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition-all duration-300 border !h-[85px] ${
          isRunning ? 'scale-[0.98] opacity-70' : ''
        } ${isCompleted ? 'border-success/40 bg-success/5' : ''} ${accentClass}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
              isCompleted
                ? 'bg-success/15 text-success'
                : isRunning
                  ? 'bg-primary/15 text-primary'
                  : 'bg-background/80 text-foreground/70 group-hover:text-foreground group-hover:bg-background'
            }`}
          >
            {isCompleted ? (
              <Check className="h-4 w-4 animate-in zoom-in-50 duration-200" />
            ) : isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              icon
            )}
          </div>
          <div className="min-w-0">
            <p
              className={`text-sm font-medium leading-tight transition-colors ${
                isCompleted ? 'text-success' : ''
              }`}
            >
              {isCompleted ? `${t('Done')}!` : label}
            </p>
            {statusBadge && !isRunning && !isCompleted && (
              <span className={`text-xs font-medium ${statusPrimaryColor}`}>{statusBadge}</span>
            )}
          </div>
        </div>

        <Space direction="vertical" align="center">
          {onReAction && (
            <Tooltip title={tooltipText}>
              <RefreshCcw
                className="cursor-pointer text-blue-500 hover:text-blue-700"
                // color="#3b82f6"
                size={18}
                onClick={onReAction}
              />
            </Tooltip>
          )}
          {!isRunning && !isCompleted ? (
            iconButtonForCreate ? (
              isChecked ? (
                <></>
              ) : (
                <div className="cursor-pointer" onClick={() => !disabled && onExecute()}>
                  {iconButtonForCreate}
                </div>
              )
            ) : (
              <Switch
                checked={isChecked}
                onClick={() => !disabled && onExecute()}
                className="data-[state=checked]:bg-success"
              />
            )
          ) : (
            <></>
          )}
        </Space>

        {/* Optional running progress bar at bottom */}
        {isRunning && (
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-muted/30 overflow-hidden rounded-b-xl">
            <div className="h-full bg-primary animate-[shimmer_0.8s_ease-in-out_infinite] w-1/2 rounded-full" />
          </div>
        )}
      </div>
    </Col>
  )
}
