'use client';

import { getClientTranslation } from '@/app/i18n/client';
import { defaultDateFormat } from '@/lib/constants';
import { renderDateTime } from '@/lib/helpers';
import { Descriptions, Drawer, Tabs, Tag } from 'antd'
import { DescriptionsProps, TabsProps } from 'antd/lib';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

type Props = {
    drawer: any;
    setDrawer: any;
    lng: string;
}  

export default function ContactDetailsDrawer({ lng, drawer, setDrawer }: Props) {
    const { t } = getClientTranslation(lng);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [activeKey, setActiveKey] = useState(searchParams.get('tab') || "1");

    const basicInfoItems: DescriptionsProps['items'] = [
        {
            key: '1',
            label: t('ID'),
            children: drawer?.data?.id,
        },
        {
            key: '2',
            label: t('FirstName'),
            children: drawer?.data?.firstName,
        },
        {
            key: '3',
            label: t('LastName'),
            children: drawer?.data?.sureName,
        },
        {
            key: '4',
            label: t("PhoneNumber"),
            children: drawer?.data?.phoneNumber ? <span style={{ direction: 'ltr', display: 'inline-block' }}>{drawer?.data?.countryCode + drawer?.data?.phoneNumber}</span> : t("NotAvailable"),
        },
        {
            key: '5',
            label: t("Email"),
            children: drawer?.data?.email || t("NotAvailable"),
        },
        {
            key: '6',
            label: t("AnotherPhoneNumber"),
            children: drawer?.data?.secondPhoneNumber ? <span style={{ direction: 'ltr', display: 'inline-block' }}>{drawer?.data?.secondCountryCode + drawer?.data?.secondPhoneNumber}</span> : t("NotAvailable"),
        },
        {
            key: '7',
            label: t("CreationDate"),
            children: drawer?.data?.creationTime ? renderDateTime(drawer?.data?.creationTime, defaultDateFormat) : t("NotAvailable"),
        },
        {
            key: '8',
            label: t("Note"),
            span: 2,
            children: drawer?.data?.note ? <p style={{ whiteSpace: 'pre-line' }}>{drawer?.data?.note}</p> : t("NotAvailable"),
        }
    ];

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: t("BasicInfo"),
            children: (<Descriptions layout="vertical" colon={false} items={basicInfoItems} />)
        },
        {
            key: '2',
            label: t("Templates"),
            children: (<></>)
        },
        {
            key: '3',
            label: t("Conversations"),
            children: (<></>)
        }
    ];
   
    
    return (
        <Drawer
            zIndex={1005}
            title={t('ContactInfo')}
            onClose={() => {
                setDrawer({ open: false, data: undefined });
                setActiveKey("1");
            }}
            open={drawer.open}
            size={"large"}
            placement={lng === "en" ? 'right' : 'left'}>
          
            <Tabs
                className='min-w-full w-full'
                items={items}
                onChange={(activeKey: string) => {
                    setActiveKey(activeKey);
                    const params = new URLSearchParams(searchParams);
                    params.set("tab", activeKey || "1");
                    router.replace(`${pathname}?${params.toString()}`);
                }}
                defaultActiveKey={activeKey}
            />
       
        </Drawer>
    );
}
