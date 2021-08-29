import React, { useState, memo } from 'react'
import { Modal, message } from 'antd'
import {
  SchemaForm,
  createFormActions,
  SchemaMarkupField as Field,
} from '@formily/antd'

import http from '@/api'

const actions = createFormActions()

const AddEditForm = ({ visible, onCancel, record, callback }) => {
  const [loading, setLoading] = useState(false)

  const updateData = (url, values, title) => {
    setLoading(true)

    http
      .post(url, values)
      .then(() => {
        message.success(title)
        callback()
        handleCancel()
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleSubmit = values => {
    if (record.id) {
      updateData(
        'friendMaintain/update',
        { ...values, id: record.id },
        '编辑成功'
      )
    } else {
      updateData('friendMaintain/add', values, '新增成功')
    }
  }

  const handleCancel = () => {
    onCancel()

    actions.reset({ validate: false })
  }

  const title = record.id ? '编辑友好客户' : '新增友好客户'

  return (
    <Modal
      visible={visible}
      title={title}
      confirmLoading={loading}
      onCancel={handleCancel}
      destroyOnClose
      onOk={() => actions.submit()}
    >
      <SchemaForm
        actions={actions}
        onSubmit={handleSubmit}
        labelCol={6}
        wrapperCol={18}
        initialValues={{
          orgId: record.orgId,
          friendMobile: record.friendMobile,
        }}
      >
        <Field
          name="orgId"
          type="string"
          title="企业编码"
          required
          x-rules={[{ whitespace: true, message: '不能为空' }]}
          x-component-props={{ placeholder: '请输入' }}
        />
        <Field
          name="friendMobile"
          type="string"
          required
          title="手机号码"
          x-rules="phone"
          x-component-props={{ placeholder: '请输入' }}
        />
      </SchemaForm>
    </Modal>
  )
}

export default memo(AddEditForm)
