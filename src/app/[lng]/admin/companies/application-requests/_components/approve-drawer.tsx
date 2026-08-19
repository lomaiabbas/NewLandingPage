'use client'

import { getClientTranslation } from '@/app/i18n/client'
import { useAppContext } from '@/lib/context'
import type { TreeDataNode, TreeProps } from 'antd'
import { Button, Drawer, Tree } from 'antd'
import React, { useEffect, useState } from 'react'

type Props = {
  drawer: any
  setDrawer: any
  lng: string
  onOK: any
  setFinalizeAcception?: any
}

export default function ApproveDrawer({
  lng,
  drawer,
  setDrawer,
  onOK,
  setFinalizeAcception,
}: Props) {
  const { t } = getClientTranslation(lng)
  const [isSubmittingData, setIsSubmittingData] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0'])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [treeData, setTreeData] = useState<TreeDataNode[]>([])
  const { features } = useAppContext()

  useEffect(
    () => {
      setCheckedKeys([])
      setExpandedKeys(['0'])
    }, // eslint-disable-next-line
    [drawer]
  )

  useEffect(
    () => {
      if (features) {
        const keys = Object.keys(features)
        let temp: any[] = []
        let index = 0,
          childIndex = 0
        for (let feature of keys) {
          if (
            feature !== 'SettingManagement' &&
            feature !== 'UsageManagement' &&
            feature !== 'FinancialManagement'
          )
            if (feature.includes('.Enable')) {
              childIndex = 0
              temp.push({
                title: t(feature),
                name: feature,
                key: index.toString(),
                children: [],
              })
              index++
            } else {
              let d = temp.filter(
                (i: any) =>
                  feature.substring(0, feature.indexOf('.')) ===
                  i.name.substring(0, feature.indexOf('.'))
              )?.[0]
              if (d) {
                d?.children?.push({
                  title: t(feature),
                  name: feature,
                  key: d.key + '-' + childIndex,
                  children: [],
                })
              }
              childIndex++
            }
        }
        setTreeData(temp)
      }
    }, // eslint-disable-next-line
    [features]
  )

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue as React.Key[])
  }

  return (
    <Drawer
      zIndex={1005}
      title={t('ApproveApplicationReq')}
      maskClosable={false}
      onClose={() => setDrawer({ open: false, data: undefined })}
      open={drawer.open}
      placement={lng === 'en' ? 'right' : 'left'}
    >
      <h3 className="mb-3 font-semibold">{t('AssignPermissions')}</h3>
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
      />

      <Button
        className="mt-3"
        type="primary"
        block
        onClick={async () => {
          setIsSubmittingData(true)
          await onOK(checkedKeys, treeData)
          setFinalizeAcception?.(true)
          setIsSubmittingData(false)
        }}
        size="large"
        loading={isSubmittingData}
      >
        {t('Approve')}
      </Button>
    </Drawer>
  )
}
