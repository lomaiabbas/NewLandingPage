'use client'

import { getClientTranslation } from '@/app/i18n/client'
import Loader from '@/components/panel/loader'
import companiesServiceInstance from '@/lib/services/companies'
import type { TreeDataNode, TreeProps } from 'antd'
import { Alert, Button, Drawer, Tabs, Tree } from 'antd'
import React, { useEffect, useState } from 'react'

type Props = {
  drawer: any
  setDrawer: any
  lng: string
  onOK: any
  setFinalizeAcception?: any
}

export default function ManageFeaturesDrawer({
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

  const [activeTab, setActiveTab] = useState('app')

  const [appTreeData, setAppTreeData] = useState<TreeDataNode[]>([])
  const [mobileTreeData, setMobileTreeData] = useState<TreeDataNode[]>([])

  const [appCheckedKeys, setAppCheckedKeys] = useState<React.Key[]>([])
  const [mobileCheckedKeys, setMobileCheckedKeys] = useState<React.Key[]>([])
  const [dependencyAlert, setDependencyAlert] = useState('')

  useEffect(() => {
    setCheckedKeys([])
    setExpandedKeys(['0'])
    setActiveTab('app')
    setAppTreeData([])
    setMobileTreeData([])
    setAppCheckedKeys([])
    setMobileCheckedKeys([])
    setDependencyAlert('')
  }, [drawer])

  const buildFeatureTree = (
    features: any[],
    t: any,
    checkedKeys: string[],
    parentName?: string,
    parentKey = ''
  ): any[] => {
    const items = features.filter((f) => (f.parentName || '') === (parentName || ''))

    return items.map((feature, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`

      const hasChildren = features.some((f) => f.parentName === feature.name)

      if (feature.value === 'true' && !hasChildren) {
        checkedKeys.push(key)
      }

      return {
        title: t(feature.name),
        name: feature.name,
        key,
        children: buildFeatureTree(features, t, checkedKeys, feature.name, key),
      }
    })
  }

  const buildTreeData = (groupsTemp: any[], isMobile?: any) => {
    if (groupsTemp?.length > 0) {
      let temp: any[] = []
      let checkedTemp: any[] = []
      let index = 0,
        childIndex = 0,
        superIndex = 0
      if (isMobile) {
        for (let group of groupsTemp) {
          if (
            group.name !== 'SettingManagement' &&
            group.name !== 'UsageManagement' &&
            group.name !== 'FinancialManagement'
          ) {
            const checked: string[] = []

            temp.push({
              title: t(group.name),
              name: group.name,
              key: index.toString(),
              children: buildFeatureTree(group.features, t, checked, undefined, index.toString()),
            })

            checkedTemp.push(...checked)

            index++
          }
        }
      } else
        for (let group of groupsTemp) {
          if (
            group.name !== 'SettingManagement' &&
            group.name !== 'UsageManagement' &&
            group.name !== 'FinancialManagement'
          ) {
            if (group.features?.filter((item: any) => item.name.includes('.Enable'))?.length > 1) {
              childIndex = 0
              superIndex = 0
              temp.push({
                title: t(group.name),
                name: group.name,
                key: index.toString(),
                children: [],
              })
              for (let feature of group.features) {
                if (feature.name.includes('.Enable')) {
                  let d = temp.filter(
                    (i: any) => feature.name?.substring(0, feature.name.indexOf('.')) === i.name
                  )?.[0]
                  if (d) {
                    d?.children?.push({
                      title: t(feature.name),
                      name: feature.name,
                      key: d.key + '-' + superIndex,
                      children: [],
                    })
                    // if (feature.value === 'true') {
                    //   checkedTemp.push(d.key + '-' + childIndex)
                    // }
                    superIndex++
                  }
                } else {
                  let childrens = temp.filter((i: any) => i.children?.length > 0)
                  for (let child of childrens) {
                    let d = child?.children?.filter((i: any) => feature.parentName === i.name)?.[0]
                    if (d) {
                      d?.children?.push({
                        title: t(feature.name),
                        name: feature.name,
                        key: d.key + '-' + childIndex,
                        children: [],
                      })
                      if (feature.value === 'true') {
                        checkedTemp.push(d.key + '-' + childIndex)
                      }
                      childIndex++
                    }
                  }
                }
              }
            } else {
              for (let feature of group.features) {
                if (feature.name.includes('.Enable')) {
                  childIndex = 0
                  temp.push({
                    title: t(feature.name),
                    name: feature.name,
                    key: index.toString(),
                    children: [],
                  })
                  if (feature.value === 'true' && group.features.length === 1) {
                    checkedTemp.push(index.toString())
                  }
                  index++
                } else {
                  let d = temp.filter(
                    (i: any) =>
                      feature.name.substring(0, feature.name.indexOf('.')) ===
                      i.name.substring(0, feature.name.indexOf('.'))
                  )?.[0]
                  if (d) {
                    d?.children?.push({
                      title: t(feature.name),
                      name: feature.name,
                      key: d.key + '-' + childIndex,
                      children: [],
                    })
                    if (feature.value === 'true') {
                      checkedTemp.push(d.key + '-' + childIndex)
                    }
                  }
                  childIndex++
                }
              }
            }
            index++
          }
        }

      return {
        treeData: temp,
        checkedKeys: checkedTemp,
      }
    }
  }

  const getData = async () => {
    let result: any = await companiesServiceInstance.getFeatures(drawer.data.tenantId)
    let groupsTemp = result.groups

    const priority = [
      'Analytics',
      'ChatManagement',
      'TemplatesManagement',
      'SentTemplatesManagement',
      'EInvitationsTemplatesManagement',
      'CampaignManagement',
      'OccasionManagement',
      'InvitationOwner',
      'ContentManagement',
      'ContactsManagement',
      'StaffManagement',
      'WhatsAppAccountActivity',
      'Channels',
      'ApiKeys',
      'TechnicalSupport',
      'UsageManagement',
    ]

    groupsTemp.sort((a: any, b: any) => {
      const aIndex = priority.indexOf(a.name)
      const bIndex = priority.indexOf(b.name)

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      return a.name.localeCompare(b.name)
    })

    const appGroups = groupsTemp.filter((g: any) => !g.name.startsWith('Mobile'))

    const mobileGroups = groupsTemp.filter((g: any) => g.name.startsWith('Mobile'))

    const appData: any = buildTreeData(appGroups)
    const mobileData: any = buildTreeData(mobileGroups, true)

    setAppTreeData(appData.treeData)
    setAppCheckedKeys(appData.checkedKeys)

    setMobileTreeData(mobileData.treeData)
    setMobileCheckedKeys(mobileData.checkedKeys)
  }

  useEffect(() => {
    if (drawer.open) {
      getData()
    } else {
      setTreeData([])
      setCheckedKeys([])
    }
  }, [drawer])

  const scrollToTop = () => {
    document.querySelector('.ant-drawer-body')?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const featureDependencies: Record<string, string[]> = {
    'ContentManagement.Content.Enable': ['EInvitationsTemplatesManagement.Enable'],
    'ContentManagement.UpdateDailyConnectTemplate': ['EInvitationsTemplatesManagement.Enable'],
    'ContentManagement.UpdateDailyConnectTemplateForUser': [
      'EInvitationsTemplatesManagement.Enable',
    ],
    'ContentManagement.UpdateInvitationMessages': ['EInvitationsTemplatesManagement.Enable'],
    'ContentManagement.UpdateInvitationQrMessages': ['EInvitationsTemplatesManagement.Enable'],

    'StaffManagement.Staff.Create': ['StaffManagement.Roles.Create'],
    'StaffManagement.Staff.Update': ['StaffManagement.Roles.Create'],
  }

  const findNodeByKey = (nodes: any[], key: React.Key): any => {
    for (const node of nodes) {
      if (node.key === key) return node

      if (node.children?.length) {
        const found = findNodeByKey(node.children, key)
        if (found) return found
      }
    }

    return null
  }

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue as React.Key[])
  }

  // const onAppCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
  //   setAppCheckedKeys(checkedKeysValue as React.Key[])
  // }

  const onAppCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    const keys = checkedKeysValue as React.Key[]

    const lastCheckedKey = keys.find((k) => !appCheckedKeys.includes(k))

    if (lastCheckedKey) {
      const currentNode = findNodeByKey(appTreeData, lastCheckedKey)

      const dependencies = featureDependencies[currentNode?.name] || []

      for (const dependencyName of dependencies) {
        const dependencyNode = findNodeByName(appTreeData, dependencyName)

        const isChecked = dependencyNode ? keys.includes(dependencyNode.key) : false

        if (!isChecked) {
          setDependencyAlert(
            t('FeatureDependencyMessage', {
              feature: t(currentNode.name),
              dependency: t(dependencyName),
            })
          )

          scrollToTop()
          return
        }
      }
    }

    setAppCheckedKeys(keys)
  }

  const findNodeByName = (nodes: any[], name: string): any => {
    for (const node of nodes) {
      if (node.name === name) return node

      if (node.children?.length) {
        const found = findNodeByName(node.children, name)
        if (found) return found
      }
    }

    return null
  }

  const onMobileCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    const keys = checkedKeysValue as React.Key[]

    const loginNode = findNodeByName(mobileTreeData, 'MobileFeatures.Login.Enable')

    const hasAnyOtherChecked = keys.some((k) => k !== loginNode?.key)

    let finalKeys = [...keys]

    if (hasAnyOtherChecked && loginNode) {
      finalKeys.push(loginNode.key)
    }

    setMobileCheckedKeys([...new Set(finalKeys)])
  }

  return (
    <Drawer
      zIndex={1005}
      width="500px"
      title={t('ManageFeatures')}
      maskClosable={false}
      onClose={() => setDrawer({ open: false, data: undefined })}
      open={drawer.open}
      placement={lng === 'en' ? 'right' : 'left'}
    >
      {appTreeData?.length > 0 || mobileTreeData?.length > 0 ? (
        <>
          <h3 className="mb-3 font-semibold">{t('AssignPermissions')}</h3>
          {/* <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}
          /> */}
          {dependencyAlert && (
            <Alert
              message={dependencyAlert}
              type="warning"
              closable
              showIcon
              className="!p-3 mb-3 sticky top-0 z-50"
              onClose={() => setDependencyAlert('')}
            />
          )}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'app',
                label: t('ApplicationFeaturesManagement'),
                children: (
                  <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    checkedKeys={appCheckedKeys}
                    onCheck={onAppCheck}
                    treeData={appTreeData}
                  />
                ),
              },
              {
                key: 'mobile',
                label: t('MobileFeaturesManagement'),
                children: (
                  <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    checkedKeys={mobileCheckedKeys}
                    onCheck={onMobileCheck}
                    treeData={mobileTreeData}
                  />
                ),
              },
            ]}
          />

          <Button
            type="primary"
            className="mt-3"
            block
            onClick={async () => {
              setIsSubmittingData(true)
              // await onOK(checkedKeys, treeData)

              await onOK(
                {
                  app: appCheckedKeys,
                  mobile: mobileCheckedKeys,
                },
                {
                  app: appTreeData,
                  mobile: mobileTreeData,
                }
              )
              setFinalizeAcception?.(true)
              setIsSubmittingData(false)
            }}
            size="large"
            loading={isSubmittingData}
          >
            {t('Save')}
          </Button>
        </>
      ) : (
        <Loader />
      )}
    </Drawer>
  )
}
