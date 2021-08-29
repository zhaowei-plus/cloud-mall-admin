import React from 'react'
import { TreeSelect } from 'antd'

import { formatRegions, flatRegion } from '@/assets/utils'

const { SHOW_PARENT } = TreeSelect

const SelectArea = (props: any) => {
  const { value = [], editable = true, mutators } = props
  const { level, ...rest } = props.props['x-props']

  const handleChange = params => {
    mutators.change(params)
  }

  // 文本态
  if (!editable) {
    const treeDataArray = flatRegion(level)
    return treeDataArray
      .filter(item => value.includes(Number(item.value)))
      .map(item => item.label)
      .join(',')
  }

  // 编辑态
  return (
    <TreeSelect
      {...rest}
      treeCheckable
      value={value}
      treeData={formatRegions(level)}
      onChange={handleChange}
      showCheckedStrategy={SHOW_PARENT}
    />
  )
}

SelectArea.isFieldComponent = true

export default SelectArea
