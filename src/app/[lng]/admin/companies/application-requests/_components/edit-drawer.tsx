'use client';

import { getClientTranslation } from '@/app/i18n/client';
import { DrawerType } from '@/lib/constants';
import { Drawer } from 'antd'
import React, { useEffect, useState } from 'react'
import { LiteEntityDto, LocationType } from '@/lib/services/dto';
import locationServiceInstance from '@/lib/services/locations';
import CompleteInfoForm from '@/app/[lng]/complete-register-info/_components/form';
import banksServiceInstance from '@/lib/services/banks';
import applicationReqsServiceInstance from '@/lib/services/application-reqs';
import Loader from '@/components/panel/loader';
import { ApplicationRequestDto } from '@/lib/services/application-reqs/dto';

type Props = {
    drawer: any;
    setDrawer: any;
    lng: string;
    onOK: any;
}  

export default function EditDrawer({ lng, drawer, setDrawer, onOK }: Props) {
    const { t } = getClientTranslation(lng);
    const [countries, setCountries] = useState<LiteEntityDto[]>([]);
    const [banks, setBanks] = useState<LiteEntityDto[]>([]);
    const [data, setData] = useState<ApplicationRequestDto>();
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        getCountries();
        getBanks();
    }, // eslint-disable-next-line
        []);

    useEffect(() => {
        if (drawer?.data?.id) {
            getData(drawer?.data?.id);
        }
    }, // eslint-disable-next-line
        [drawer]);

    const getData = async (id: number) => {
        setLoadingData(true);
        let result = await applicationReqsServiceInstance.get(id);
        setData(result);
        setLoadingData(false);
    }

    const getCountries = async () => {
        let result = await locationServiceInstance.getAllLite({ isActive: true, skipCount: 0, maxResultCount: 1000, type: LocationType.Country });
        setCountries(result.items);
    }
    const getBanks = async () => {
        let result = await banksServiceInstance.getAllLite({ skipCount: 0, maxResultCount: 1000 });
        setBanks(result.items);
    }
  
    return (
        <Drawer
            zIndex={1005}
            size={'large'}
            title={t('EditApplicationReq')}
            maskClosable={false}
            onClose={() => setDrawer({ open: false, data: undefined, type: DrawerType.Add })}
            open={drawer.open}
            placement={lng === "en" ? 'right' : 'left'}>
            {!loadingData ?
                <CompleteInfoForm
                    lng={lng}
                    drawer
                    onClose={() => setDrawer({ open: false, data: undefined, type: DrawerType.Add })}
                    countries={countries}
                    banks={banks}
                    onOk={onOK}
                    editBasicFromAdmin
                    data={data} /> : <Loader />}
          
        </Drawer>
    );
}
