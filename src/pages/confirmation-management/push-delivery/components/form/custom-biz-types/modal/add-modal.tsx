import React, { useMemo } from 'react'
import { Modal } from 'antd'
import { SchemaForm, createFormActions } from '@formily/antd'
import { getAddSchema } from '../config'
import { formatFormSchema } from '@/assets/utils'

export default props => {
  const { onCancel, onOk } = props
  const actions = useMemo(() => createFormActions(), [])
  const schema = getAddSchema()
  return (
    <Modal
      visible
      centered
      onOk={() => actions.submit()}
      onCancel={onCancel}
      title="新增"
      className="tag-select-modal"
    >
      <SchemaForm
        labelCol={6}
        wrapperCol={16}
        actions={actions}
        onSubmit={onOk}
        schema={{
          type: 'object',
          properties: formatFormSchema(schema),
        }}
      />
    </Modal>
  )
}
