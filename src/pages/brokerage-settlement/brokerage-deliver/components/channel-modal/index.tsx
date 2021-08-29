import React, { useEffect, useMemo, useState } from 'react'
import { Modal, message } from 'antd'
import {
  SchemaForm,
  createFormActions,
  SchemaMarkupField as Field,
  FormSlot,
} from '@formily/antd'
import http from '@/api'

import './index.less'

export default (props: any) => {
  const { params = {}, onCancel, onOk } = props
  const { id } = params
  const [channels, setChannels] = useState([])
  const actions = useMemo(() => createFormActions(), [])

  const fetchChannels = () => {
    http.get('channel/list', {}, { loading: false }).then(res => {
      const { success, data = {} } = res
      if (success) {
        const { rows = [] } = data
        setChannels(
          rows.map(item => ({ label: item.channelName, value: item.id }))
        )
      }
    })
  }

  const handleOk = () => {
    actions.submit().then(({ values = {} }) => {
      const { channel } = values
      http.post('channel/saveChannel', { id: channel }).then(res => {
        if (res.success) {
          message.success('设置成功')
          onOk()
        }
      })
    })
  }

  useEffect(() => {
    fetchChannels()
  }, [])

  return (
    <Modal
      centered
      visible
      width={480}
      title="分公司选择"
      onOk={handleOk}
      onCancel={onCancel}
      className="channel-model"
    >
      <SchemaForm
        labelCol={6}
        wrapperCol={16}
        actions={actions}
        initialValues={{ channel: id }}
      >
        <FormSlot>
          <div className="notice">注：请选择要发放的分公司</div>
        </FormSlot>
        <Field
          required
          title="分公司"
          name="channel"
          type="string"
          enum={channels}
          x-props={{
            placeholder: '请选择',
          }}
        />
      </SchemaForm>
    </Modal>
  )
}
