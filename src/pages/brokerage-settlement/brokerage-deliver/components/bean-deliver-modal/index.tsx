import React, { useMemo } from 'react'
import { Modal, message } from 'antd'
import {
  SchemaForm,
  createFormActions,
  SchemaMarkupField as Field,
} from '@formily/antd'

import http from '@/api'

export default (props: any) => {
  const { params = {}, onCancel, onOk } = props
  const { id } = params

  const actions = useMemo(() => createFormActions(), [])

  const handleOk = () => {
    actions.submit().then(({ values = {} }) => {
      const { order = {} } = values
      const { successFileKey, friendCommission } = order
      Modal.confirm({
        centered: true,
        title: '提示',
        content: (
          <div>
            <p>确定要发放彩豆吗？</p>
            <p>实际需发放彩豆数：{friendCommission}</p>
          </div>
        ),
        onOk: () =>
          http
            .post('beSettlement/beDeliver/sendBean', {
              channelId: id,
              successFileKey,
              friendCommission,
            })
            .then(res => {
              const { success, data } = res
              if (success) {
                message.success('彩豆发放成功')
                onOk()
              }
            }),
      })
    })
  }

  return (
    <Modal
      visible
      centered
      width={480}
      title="彩豆发放"
      okText="发放彩豆"
      onOk={handleOk}
      onCancel={onCancel}
    >
      <SchemaForm labelCol={6} wrapperCol={16} actions={actions}>
        <Field
          required
          type="order-upload"
          title="订单"
          name="order"
          x-props={{
            placeholder: '请选择',
            action: '/cmmc-market/settlement/uploadFile',
            file: '彩豆发放模板.xlsx',
            params: {
              channelId: id,
            },
          }}
        />
      </SchemaForm>
    </Modal>
  )
}
