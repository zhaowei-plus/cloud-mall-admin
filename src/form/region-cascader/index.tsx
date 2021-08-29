import React from 'react'
import { Cascader } from 'antd'
import store from '@/store'
import { PROVINCE } from '@/assets/constant'
import { formatRegions, formatRegionPath } from '@/assets/utils'

const RegionCascader = props => {
  const { value = [], onChange, disabled = false, level, ...rest } = props
  const province = store.getState().province
  // 文本态
  if (disabled) {
    return value.length > 0
      ? formatRegionPath(value[value.length - 1], 'label').join('/')
      : ''
  }

  const options = ((level, options) => {
    if (province === PROVINCE.CQ) {
      if (!level) {
        // 如果是重庆市，则默认选到区县一级（4级）
        return formatRegions(4, options)
      }
    }
    return formatRegions(level, options)
  })(level, rest.options)

  // 编辑态
  return (
    <Cascader
      {...rest}
      value={formatRegionPath(
        value[value.length - 1],
        'value',
        level,
        rest.options
      )}
      options={options}
      onChange={onChange}
    />
  )
}

export default RegionCascader
