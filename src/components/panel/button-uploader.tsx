import { getClientTranslation } from '@/app/i18n/client'
import { App } from 'antd'
import { Loader2 } from 'lucide-react'

interface ButtonUploaderProps {
  title?: any
  id?: string
  loading?: boolean
  handleChange?: any
  lng: string
}

const ButtonUploader = (props: ButtonUploaderProps) => {
  const { handleChange, id, title, loading, lng } = props
  const { t } = getClientTranslation(lng)
  const { message } = App.useApp()

  const checkSingleFile = (files: any) => {
    let file = files[0]

    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      message.error(t('UploadExcelFile'), 5)
    }
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return true
    }
    return false
  }

  return (
    <label
      htmlFor={id}
      className={`ant-btn ant-btn-primary h-[40px] ant-btn-block ${loading ? 'ant-btn-loading' : ''}`}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        color: '#fff !important',
      }}
    >
      <input
        accept={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
        id={id}
        onChange={(e) => {
          e.preventDefault()
          if (checkSingleFile(e.target.files)) handleChange(e.target.files?.[0])
        }}
        type="file"
        style={{ display: 'none' }}
      />
      {loading ? <Loader2 className="animate-spin2" color="#fff" size={20} /> : <></>}
      &nbsp;
      <span style={{ color: '#fff' }}>{title}</span>
    </label>
  )
}

export default ButtonUploader
