import React, { useMemo, useEffect, useState } from 'react'
import { Modal } from 'antd'
import {
  SchemaForm,
  createFormActions,
  SchemaMarkupField as Field,
} from '@formily/antd'
import { Select } from '@formily/antd-components'
import http from '@/api'

interface IProps {
  params?: any
  onCancel: () => void
  onOk: (params: object) => void
}

export default (props: IProps) => {
  const { params = {}, onCancel, onOk } = props
  const { itemId } = params
  const [detail, setDetail] = useState<any>()
  const [options, setOptions] = useState([])
  const actions = useMemo(() => createFormActions(), [])

  const fetchDecList = () => {
    http.get('commodity/decList', {}, { loading: false }).then(res => {
      const { success, data = {} } = res
      if (success) {
        setOptions(
          JSON.parse(
            JSON.stringify(data.rows)
              .replace(/itemCode/g, 'value')
              .replace(/name/g, 'label')
          )
        )
      }
    })
  }

  const fetchDetail = itemId => {
    http.get('commodity/itemCode', { itemId }, { loading: false }).then(res => {
      const { success, data = {} } = res
      if (success) {
        setDetail(data)
      }
    })
  }

  useEffect(() => {
    fetchDecList()
  }, [])

  useEffect(() => {
    itemId && fetchDetail(itemId)
  }, [itemId])

  const initialValues = useMemo(() => {
    if (detail) {
      const { itemCode } = detail
      return {
        ...params,
        itemCode,
      }
    }
    return params
  }, [detail])

  return (
    <Modal
      visible
      centered
      width={480}
      onCancel={onCancel}
      maskClosable={false}
      onOk={() => actions.submit()}
      title={`${!itemId ? '新增' : '修改'}商品`}
    >
      <SchemaForm
        labelCol={6}
        wrapperCol={16}
        actions={actions}
        validateFirst={true}
        onSubmit={onOk}
        components={{ Select }}
        initialValues={initialValues}
      >
        <Field
          required
          title="商品"
          x-component="Select"
          name="itemCode"
          enum={options}
          x-props={{
            placeholder: '请输入',
            showSearch: true,
            optionFilterProp: 'title',
            getPopupContainer: node => node.parentNode,
          }}
        />
      </SchemaForm>
    </Modal>
  )
}
