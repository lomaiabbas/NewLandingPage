import { Modal } from 'antd';
import React from 'react'
import MapContainerForEdit from './map-container-for-edit';
import { getClientTranslation } from '@/app/i18n/client';

export default function MapModal({ data, open, setOpen, lng, disabled=true,setLocation }: { data: any; open: boolean; setOpen: any; lng: string; disabled?: boolean;setLocation?:any }) {
    const { t } = getClientTranslation(lng);

    return (
        <Modal
            title={t("AddressOnMap")}
            open={open}
            zIndex={9999}
            footer={false}
            onCancel={() => setOpen(false)}>
            <div className="map-container" style={{ width: '100%' }}>
                <p className='mb-3 mt-4'>{data?.address}</p>
                <MapContainerForEdit
                    data={{
                        lat: data?.lat,
                        lng: data?.lng,
                        address: data?.address
                    }}
                    disabled={disabled}
                    setLocation={setLocation || null}
                />
            </div>
          
        </Modal>
    );
}
