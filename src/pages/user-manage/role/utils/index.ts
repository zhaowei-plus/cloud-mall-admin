// 获取已选中的结点key集合
export const getCheckedKeys = (treeSource = []) => {
  const checkedKeys = []

  const calcCheckedKeys = (treeSource = [], checkedKeys = []) => {
    treeSource.forEach(treeNode => {
      if (treeNode.checked) {
        checkedKeys.push(treeNode.key)
      }

      if (Array.isArray(treeNode.children)) {
        calcCheckedKeys(treeNode.children, checkedKeys)
      }
    })
  }

  calcCheckedKeys(treeSource, checkedKeys)

  return checkedKeys
}

// 获取已选择结点的路径集合（不包含已选择结点）
export const getCheckedPaths = (treeSource = [], checkedKeys = []) => {
  const checkedPaths = []

  const calcCheckedPath = (treeSource = [], checkedKeys = []) => {
    let result = false
    treeSource.forEach(treeNode => {
      if (checkedKeys.includes(treeNode.key)) {
        result = true
      } else if (
        Array.isArray(treeNode.children) &&
        calcCheckedPath(treeNode.children, checkedKeys)
      ) {
        checkedPaths.push(treeNode.key)
        result = true
      }
    })
    return result
  }

  calcCheckedPath(treeSource, checkedKeys)

  return checkedPaths
}
