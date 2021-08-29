import React, { useState, useEffect, useMemo } from 'react'
import cs from 'classnames'
import { Checkbox } from 'antd'
import http from '@/api'

import './index.less'

const BizConfigs = (props: any) => {
  const { value = [], editable = true, mutators } = props
  const [options, setOptions] = useState([])

  const handleChange = values => {
    mutators.change(values)
  }

  const fetchOptions = () => {
    http.get('confirmationManagement/pushDelivery/configList').then(res => {
      const { success, data } = res
      if (success) {
        setOptions(
          data.map(item => ({
            label: `${item.bizType} ${item.regionName} ${item.content}`,
            value: item.id,
            ...item,
          }))
        )
      }
    })
  }

  useEffect(() => {
    fetchOptions()
  }, [])

  const selectOptions = useMemo(() => {
    return value
      .map(item => options.find(d => d.value === item) || {})
      .map(item => item.bizType)
      .filter(Boolean)
  }, [value, options])

  return (
    <div className="biz-configs">
      <div className="biz-configs__value">
        {editable && '已选：'}
        {selectOptions.join(',')}
      </div>
      <div
        className={cs('biz-configs__select', {
          hidden: !editable,
        })}
      >
        {options.length > 0 ? (
          <Checkbox.Group
            value={value}
            options={options}
            onChange={handleChange}
          />
        ) : (
          '暂无可选项'
        )}
      </div>
    </div>
  )
}

BizConfigs.isFieldComponent = true

export default BizConfigs
