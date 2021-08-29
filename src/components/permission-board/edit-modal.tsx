import React, { useMemo } from 'react'
import { Modal, message } from 'antd'
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
} from '@formily/antd'
import { Select } from '@formily/antd-components'

export default props => {
  const { params, accountTypes, onCancel, onOk } = props
  const actions = useMemo(() => createAsyncFormActions(), [])

  const handleOk = () => {
    return actions.submit().then(({ values }: any) => {
      onOk(values)
    })
  }

  return (
    <Modal
      visible
      centered
      onOk={handleOk}
      title="选择可见范围"
      onCancel={onCancel}
      maskClosable={false}
    >
      <SchemaForm
        labelCol={7}
        validateFirst
        wrapperCol={12}
        actions={actions}
        components={{ Select }}
        initialValues={params}
      >
        <Field
          required
          type="string"
          name="accountList"
          title="可见范围"
          x-component="Select"
          x-component-props={{
            allowClear: true,
            mode: 'multiple',
            placeholder: '请选择',
            options: accountTypes,
          }}
        />
      </SchemaForm>
    </Modal>
  )
}
