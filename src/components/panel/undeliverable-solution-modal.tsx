import { getClientTranslation } from '@/app/i18n/client'
import { Modal, Space, Tooltip } from 'antd'
import { AlertTriangle, Lightbulb, ShieldCheck, Smartphone } from 'lucide-react'
import { ReactNode, useState } from 'react'

interface SolutionModalProps {
  trigger?: ReactNode
  lng: string
  errorCode?: string
}

const UndeliverableSolutionModal = ({ lng, trigger, errorCode = '131026' }: SolutionModalProps) => {
  const [open, setOpen] = useState(false)
  const { t } = getClientTranslation(lng)

  const reasons = [
    t('RecipientNotOnWhatsApp'),
    t('RecipientNotAcceptedTerms'),
    t('RecipientUsingOldVersion'),
  ]

  const solutions = [
    t('ConfirmCanMessageYou'),
    t('AskToAcceptLatestTerms'),
    t('UpdateWhatsAppVersion'),
  ]

  const versions = [
    { platform: 'Android', version: '2.21.15.15' },
    { platform: 'SMBA', version: '2.21.15.15' },
    { platform: 'iOS', version: '2.21.170.4' },
    { platform: 'SMBI', version: '2.21.170.4' },
    { platform: 'KaiOS', version: '2.2130.10' },
    { platform: t('Web'), version: '2.2132.6' },
  ]

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        <Tooltip title={t('Solution')}>{trigger}</Tooltip>
      </span>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={700}
        centered
        styles={{
          content: {
            padding: `20px ${lng === 'ar' ? '24px' : '10px'} 20px ${lng === 'ar' ? '10px' : '24px'}`,
          },
          body: {
            maxHeight: '85vh',
            overflowY: 'auto',
          },
        }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 border-b pb-4">
            <Lightbulb className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold">{t('Solution')}</h2>
              <p className="text-sm text-gray-500">
                {t('ErrorCode')}:{' '}
                <span className="font-mono font-semibold text-primary">{errorCode}</span>
              </p>
            </div>
          </div>

          {/* Reasons */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold">{t('MessageUndeliverable')}</h3>
            </div>

            <p className="text-sm text-gray-500">{t('MessageUndeliverableDescription')}</p>

            <ul className="space-y-2">
              {reasons.map((reason, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                  {reason}
                </li>
              ))}
            </ul>

            {/* Versions table */}
            <div className="border rounded-md overflow-hidden mt-4">
              <div className="bg-gray-50 px-4 py-2 text-sm font-semibold border-b">
                {t('MinimumSupportedVersions')}
              </div>

              {versions.map((v, i) => (
                <div
                  key={i}
                  className="flex justify-between px-4 py-2 border-t first:border-t-0 text-sm"
                >
                  <span className="text-gray-500">{v.platform}</span>
                  <span className="font-mono">{v.version}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Solutions */}
          <section className="space-y-3 border-t pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <h3 className="font-semibold">{t('SuggestedSolution')}</h3>
            </div>

            <p className="text-sm text-gray-500">{t('ContactUserOutsideWhatsApp')}</p>

            <ul className="space-y-3">
              {solutions.map((solution, i) => (
                <li key={i}>
                  <Space className="text-sm" align="start">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs">
                      {i + 1}
                    </span>
                    {solution}
                  </Space>
                </li>
              ))}
            </ul>
          </section>

          {/* Note */}
          <div className="bg-gray-100 rounded-md p-4 flex gap-3">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <div className="text-sm">
              <strong>{t('Note1')}:</strong> {t('EnsureLatestVersionNote')}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default UndeliverableSolutionModal
