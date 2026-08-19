'use client'

import { getClientTranslation } from '@/app/i18n/client'
import { CardContent, CardHeader } from '@/components/ui/card'
import { DrawerType } from '@/lib/constants'
import companiesForManagerServiceInstance from '@/lib/services/companies-for-manager'
import { LiteEntityDto, LocationType } from '@/lib/services/dto'
import locationServiceInstance from '@/lib/services/locations'
import { Card } from 'antd'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddUpdateForm from '../../admin/companies/_components/form'

export default function UpdateRegisterCard({ lng, host }: { lng: string; host: string }) {
  const { t } = getClientTranslation(lng)
  const [countries, setCountries] = useState<LiteEntityDto[]>([])
  const searchParams = useSearchParams()
  const otp = searchParams.get('otp')
  const phone = searchParams.get('phone')
  const countryCode = searchParams.get('countrycode')
  const [data, setData] = useState(undefined)

  const getData = async () => {
    let result = await companiesForManagerServiceInstance.companySignupInfo({
      phoneNumber: phone,
      countryCode: '+' + countryCode?.substring(1),
      code: otp,
      subDomainName: host,
    })
    setData(result)
  }

  useEffect(
    () => {
      getCountries()
      if (otp && phone && countryCode) {
        getData()
      }
    }, // eslint-disable-next-line
    []
  )

  const getCountries = async () => {
    let result = await locationServiceInstance.getAllLite({
      isActive: true,
      skipCount: 0,
      maxResultCount: 1000,
      type: LocationType.Country,
    })
    setCountries(result.items)
  }

  return (
    <Card className=" min-w-full w-full">
      <CardHeader className="bg-[#eee] rounded-sm">
        <div className="flex justify-center lg:justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">{t('UpdateRegisterInfo')}</h3>
            <p>{t('RegisterNote')}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-7 min-w-full w-full">
        <AddUpdateForm
          lng={lng}
          host={host}
          type={DrawerType.Edit}
          countries={countries}
          updateRegisterInfo
          data={data}
        />
      </CardContent>
    </Card>
  )
}
