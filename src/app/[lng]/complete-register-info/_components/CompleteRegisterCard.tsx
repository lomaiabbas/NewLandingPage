'use client'

import { getClientTranslation } from '@/app/i18n/client'
import Loader from '@/components/panel/loader'
import { CardContent, CardHeader } from '@/components/ui/card'
import banksServiceInstance from '@/lib/services/banks'
import companiesForManagerServiceInstance from '@/lib/services/companies-for-manager'
import { ApplicationRequestStatus, LiteEntityDto, LocationType } from '@/lib/services/dto'
import locationServiceInstance from '@/lib/services/locations'
import { Card } from 'antd'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CompleteInfoForm from './form'

export default function CompleteRegisterCard({ lng, host }: { lng: string; host: string }) {
  const { t } = getClientTranslation(lng)
  const [countries, setCountries] = useState<LiteEntityDto[]>([])
  const [banks, setBanks] = useState<LiteEntityDto[]>([])
  const searchParams = useSearchParams()
  const otp = searchParams.get('otp')
  const phone = searchParams.get('phone')
  const countryCode = searchParams.get('countrycode')
  const [data, setData] = useState<any>(undefined)

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
      getBanks()
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
  const getBanks = async () => {
    let result = await banksServiceInstance.getAllLite({ skipCount: 0, maxResultCount: 1000 })
    setBanks(result.items)
  }

  return (
    <div className=" min-w-full w-full">
      <Card className=" min-w-full w-full">
        <CardHeader className="bg-[#eee] rounded-sm">
          <div className="flex justify-center lg:justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">
                {data?.status === ApplicationRequestStatus.Rejected ||
                data?.status === ApplicationRequestStatus.WaitingForApproval
                  ? t('UpdateApplicationReq')
                  : t('CompleteApplicationReq')}
              </h3>
              <p>{t('RegisterNote')}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-7 min-w-full w-full">
          {data ? (
            <CompleteInfoForm
              host={host}
              lng={lng}
              countries={countries}
              data={data}
              completeInfo={otp ? true : false}
              banks={banks}
            />
          ) : (
            <Loader />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
