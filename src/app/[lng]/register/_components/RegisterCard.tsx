'use client'

import { getClientTranslation } from '@/app/i18n/client'
import styles from '@/components/landing-page/hero/hero.module.css'
import { CardContent, CardHeader } from '@/components/ui/card'
import { DrawerType } from '@/lib/constants'
import { LiteEntityDto, LocationType } from '@/lib/services/dto'
import locationServiceInstance from '@/lib/services/locations'
import { Card } from 'antd'
import { useEffect, useState } from 'react'
import AddUpdateForm from '../../admin/companies/_components/form'

export default function RegisterCard({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const [countries, setCountries] = useState<LiteEntityDto[]>([])

  useEffect(
    () => {
      getCountries()
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
    <div className={`${styles.hero} min-h-screen`}>
      <div className="container pt-[160px]">
        <Card className="min-w-full w-full">
          <CardHeader className="bg-[#eee] rounded-sm">
            <div className="flex justify-center lg:justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{t('Register')}</h3>
                <p>{t('RegisterNote')}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-7 min-w-full w-full">
            <AddUpdateForm lng={lng} host={''} type={DrawerType.Add} countries={countries} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
