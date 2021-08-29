import React, { useEffect, useState } from 'react'
import { Modal, Spin } from 'antd'
import { SchemaForm, SchemaMarkupField as Field } from '@formily/antd'
import { useFetch } from '@/hooks'
import http from '@/api'

import components from './form'

import './index.less'

export default (props: any) => {
  const { params = {}, onCancel } = props
  const { id } = params
  const [fields, setFields] = useState([])

  const fetchDetail = params => {
    return http
      .get('activityOrder/reservation/detail', params, { loading: false })
      .then(res => {
        const { success, data } = res
        if (success) {
          setFields(data)
        }
      })
  }
  const detail = useFetch(fetchDetail)
  useEffect(() => {
    id && detail.onFetch({ id })
  }, [id])

  return (
    <Modal
      centered
      visible
      width={480}
      title="预约信息"
      footer={null}
      onCancel={onCancel}
      className="reservation-modal"
    >
      <Spin spinning={detail.loading}>
        {fields.length > 0 && (
          <SchemaForm
            labelCol={8}
            wrapperCol={14}
            editable={false}
            previewPlaceholder={' '}
            components={components}
          >
            {fields.map((field, index) => (
              <Field
                x-component="XmString"
                title={field.fieldName}
                default={field.fieldValue}
              />
            ))}
          </SchemaForm>
        )}
      </Spin>
    </Modal>
  )
}
