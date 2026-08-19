'use client'

import { getClientTranslation } from '@/app/i18n/client'
import { defaultTimeFormat24 } from '@/lib/constants'
import { setTextAlignment } from '@/lib/helpers'
import { Image } from 'antd'
import { Mic, Plus } from 'lucide-react'
import moment from 'moment'

export default function SMSPreview({ data, lng, id }: { data: any; lng: string; id: number }) {
  const { t } = getClientTranslation(lng)

  return (
    <div
      key={id + ''}
      className="!max-w-[320px] border mx-auto flex flex-col justify-between sticky top-10 shadow-md bg-white rounded-[10px] overflow-x-hidden"
      style={{
        borderRadius: 8,
        minHeight: '325px',
      }}
    >
      <div className="h-[70px] py-4 bg-gray-100  flex flex-col gap-1 items-center justify-center">
        <Image
          preview={false}
          src="/images/logo.svg"
          className="!w-[35px] !h-[35px] object-contain rounded-full shadow-sm bg-white"
        />
        <span className="text-xs font-semibold">{t('AtrasLink')}</span>
      </div>
      <div className="flex-1"></div>
      <span className="text-center w-full font-semibold block text-xs mb-1">
        {moment().format(defaultTimeFormat24)}
      </span>
      <div className="imessage !shadow-sm !bg-white mb-4 w-[85%] ms-6">
        <p className={`from-them gray !shadow-sm !bg-gray-200 `}>
          <span
            style={{ display: 'block', marginBottom: '5px' }}
            className={`whitespace-pre-line ${setTextAlignment(data.value)}`}
          >
            {data.value}
          </span>
        </p>
      </div>
      <div className="px-3 py-3 items-center flex gap-3 border-t">
        <div className="gap-3 flex items-center flex-1 py-2 px-2 text-gray-500 border-gray-300 border rounded-[25px]">
          <Mic className="text-gray-400" />
          {t('SMSMessage')}
        </div>
        <div className="!w-10 flex justify-center items-center text-gray-500 !h-10 bg-gray-100 rounded-full">
          <Plus size={20} className="text-gray-500" />
        </div>
      </div>
    </div>
  )
}
