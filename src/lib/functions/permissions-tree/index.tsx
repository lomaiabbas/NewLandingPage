export const buildAppPermissionsTree = (groupsData: any[], t: (key: string) => string) => {
  let temp: any[] = []
  let groupIndex = 0

  for (let group of groupsData) {
    // Only show groups that have granted permissions
    const grantedPermissions = group.permissions?.filter((p: any) => p.isGranted)
    if (!grantedPermissions?.length) continue

    const level1Key = groupIndex.toString()

    const level1Node: any = {
      // title: tenant && group?.name == 'ContentManagement' ? t('Content') : t(group.name),
      title: t(group.name),
      name: group.name,
      key: level1Key,
      children: [],
    }

    let level2Index = 0

    // 🔹 Get parent permissions (parentName === null)
    const parents = group.permissions.filter((p: any) => p.parentName === null)

    for (let parent of parents) {
      if (!parent.isGranted) continue

      // 🔹 Get children of this parent
      const children = group.permissions.filter(
        (p: any) =>
          p.parentName === parent.name && p.isGranted && !p.name.includes('ManagePermissions')
      )

      const level2Key = `${level1Key}-${level2Index}`

      // 🟢 ALWAYS create fake level 2 node
      const level2Node: any = {
        title: t(parent.name + '1'), // Fake node
        name: parent.name + '1',
        key: level2Key,
        children: [],
      }

      // 🔹 Base permission as first child (real parent)
      level2Node.children.push({
        title: t(parent.name),
        name: parent.name,
        key: `${level2Key}-0`,
        children: [],
      })

      // 🔹 Sub-permissions (if exist)
      children.forEach((child: any, i: number) => {
        level2Node.children.push({
          title: t(child.name),
          name: child.name,
          key: `${level2Key}-${i + 1}`,
          children: [],
        })
      })

      level1Node.children.push(level2Node)
      level2Index++
    }

    temp.push(level1Node)
    groupIndex++
  }

  return temp
}

export const buildMobilePermissionsTree = (groups: any[], t: (key: string) => string) => {
  const buildTree = (permissions: any[], parentName?: string, parentKey = ''): any[] => {
    const items = permissions.filter((p) => (p.parentName || '') === (parentName || ''))

    return items
      .map((permission, index) => {
        const key = parentKey ? `${parentKey}-${index}` : `${index}`

        const children = buildTree(permissions, permission.name, key)

        if (!permission.isGranted && children.length === 0) {
          return null
        }

        return {
          title: t(permission.name),
          key,
          children,
        }
      })
      .filter(Boolean)
  }

  return groups
    .map((group, index) => ({
      title: t(group.name),
      key: `${index}`,
      children: buildTree(group.permissions, undefined, `${index}`),
    }))
    .filter((group) => group.children.length > 0)
}
