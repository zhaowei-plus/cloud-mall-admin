import React, { useMemo, useState } from 'react'
import { Select } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import debounce from 'lodash/debounce'

import http from '@/api'

import './index.less'

const FirmSearch = props => {
  const { value = [], mutators, editable = true } = props
  const { materialId, placeholder } = props.props['x-props']
  const [options, setOptions] = useState([])

  const fetchFirm = orgId => {
    if (orgId) {
      http.get('push/filterOrgs', { orgId, materialId }).then(res => {
        const { success, data = {} } = res
        if (success) {
          const { orgId, orgName } = data
          setOptions([
            {
              label: orgName,
              value: orgId,
            },
          ])
        }
      })
    }
  }

  const handleSelect = id => {
    const isExist = value.find(d => d.value === id)
    if (!isExist) {
      const selectedItem = options.find(d => d.value === id)
      if (selectedItem) {
        mutators.change([selectedItem, ...value])
      }
    }
  }

  const handleDelete = id => {
    mutators.change(value.filter(d => d.value !== id))
  }

  const defaultValue = useMemo(() => {
    if (value.length > 0) {
      return value[0].label
    }
  }, [value])

  const renderContent = () => {
    if (materialId) {
      return (
        <div className="firm-search__header">
          <Select
            showSearch
            value={defaultValue}
            showArrow={false}
            filterOption={false}
            notFoundContent={null}
            onSelect={handleSelect}
            placeholder={placeholder}
            defaultActiveFirstOption={false}
            onSearch={debounce(fetchFirm, 500)}
            getPopupContainer={node => node.parentNode}
            style={{
              width: 480,
            }}
            options={options}
          />
        </div>
      )
    }

    return <div className="firm-search__input">请选择活动！</div>
  }

  const renderValue = () => {
    if (value.length > 0) {
      return (
        <div className="firm-search__content">
          {value.map(item => (
            <div className="firm" key={item.value}>
              <span className="title">
                {item.label} ({item.value})
              </span>
              {editable && (
                <CloseCircleFilled onClick={() => handleDelete(item.value)} />
              )}
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="firm-search">
      {editable && renderContent()}
      {renderValue()}
    </div>
  )
}

FirmSearch.isFieldComponent = true

export default FirmSearch
