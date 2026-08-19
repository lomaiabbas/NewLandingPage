'use client';

import { getClientTranslation } from '@/app/i18n/client';
import { DrawerType } from '@/lib/constants';
import { Button, Drawer } from 'antd'
import React, { useEffect, useState } from 'react'
import AddUpdateForm from '../../_components/form';
import { LiteEntityDto, LocationType } from '@/lib/services/dto';
import locationServiceInstance from '@/lib/services/locations';

type Props = {
    drawer: any;
    setDrawer: any;
    lng: string;
    onOK: any;
}  

export default function AddEditDrawer({ lng, drawer, setDrawer,onOK }: Props) {
    const { t } = getClientTranslation(lng);
    const [countries, setCountries] = useState<LiteEntityDto[]>([]);

    useEffect(() => {
        getCountries();
    }, // eslint-disable-next-line
        []);

    const getCountries = async () => {
        let result = await locationServiceInstance.getAllLite({ isActive: true, skipCount: 0, maxResultCount: 1000, type: LocationType.Country });
        setCountries(result.items);
    }
    
  
    return (
        <Drawer
            zIndex={1005}
            size={'large'}
            maskClosable={false}
            title={drawer.type === DrawerType.Add ? t('AddNewApplicationReq') : t('EditApplicationReq')}
            onClose={() => setDrawer({ open: false, data: undefined, type: DrawerType.Add })}
            open={drawer.open}
            placement={lng === "en" ? 'right' : 'left'}>
            <AddUpdateForm host="" onOK={() => {
                setDrawer({ open: false, data: undefined, type: DrawerType.Add });
                onOK();
            }
            } lng={lng} drawer type={drawer.type} countries={countries} />
          
        </Drawer>
    );
}
