import React, { useMemo, useState, useEffect } from 'react'
import { Select } from 'antd'
import http from '@/api'

const ListSearch = props => {
  const { value = [], mutators, editable = true } = props
  const { placeholder, params = {}, url } = props.props['x-props']
  const [options, setOptions] = useState([])

  const fetchList = (name = '') => {
    http
      .get(url, {
        name,
        ...params,
      })
      .then(res => {
        const { success, data = [] } = res
        if (success) {
          setOptions(
            data.map(d => ({
              label: d.name,
              value: d.id,
            }))
          )
        }
      })
  }

  const handleChange = (value, option) => {
    mutators.change(option)
  }

  const defaultValue = useMemo(() => {
    if (value.length > 0) {
      return value.map(item => item.value)
    }
  }, [value])

  useEffect(() => {
    fetchList()
  }, [])

  if (!editable) {
    return value
      .map(d => (options.find(item => item.value === Number(d)) || {}).label)
      .join('.')
  }

  return (
    <Select
      style={{
        width: 480,
      }}
      allowClear
      showSearch
      mode="multiple"
      value={defaultValue}
      maxTagCount={5}
      options={options}
      optionFilterProp="label"
      notFoundContent={null}
      onChange={handleChange}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      getPopupContainer={node => node.parentNode}
    />
  )
}

ListSearch.isFieldComponent = true

export default ListSearch
