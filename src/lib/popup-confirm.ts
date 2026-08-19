import { Modal } from 'antd'
import { t } from 'i18next'

export function popupConfirm(
  onOk: () => void,
  content = t('AreYouSure?'),
  title = t('PleaseConfirm'),
  onCancel = () => {}
) {
  Modal.confirm({
    title,
    content,
    onOk,
    onCancel,
    zIndex: 9999999999,
    cancelText: t('Cancel'),
    okText: t('OK'),
  })
}
