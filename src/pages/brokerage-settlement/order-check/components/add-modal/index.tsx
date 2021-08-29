import React, { useEffect, useMemo, useState } from 'react'
import { Modal, Button, message } from 'antd'
import dayjs from 'dayjs'
import {
  SchemaForm,
  createFormActions,
  SchemaMarkupField as Field,
  FormSlot,
} from '@formily/antd'
import http from '@/api'
import useEffects from './effects'

import style from './index.less'

export default (props: any) => {
  const { params = {}, onCancel, onOk } = props
  const { channel } = params
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
      const { order, auditMonth, ...rest } = values
      const { successFileKey } = order
      http
        .post(
          'beSettlement/orderCheck/add',
          {
            successFileKey,
            auditMonth: dayjs(auditMonth).format('YYYYMM'),
            ...rest,
          },
          { loading: false }
        )
        .then(res => {
          const { success } = res
          if (success) {
            message.success('新增成功')
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
      onOk={onOk}
      title="新增稽核"
      onCancel={onCancel}
      maskClosable={false}
      className={style['add-modal']}
      footer={
        <Button onClick={handleOk} type="primary">
          确定
        </Button>
      }
    >
      <SchemaForm
        labelCol={6}
        wrapperCol={16}
        actions={actions}
        effects={useEffects}
        initialValues={{ channel }}
      >
        <FormSlot>
          <div className={style['notice']}>注：请选择分公司和对应订单年月</div>
        </FormSlot>
        <Field
          required
          title="分公司"
          name="channelId"
          type="string"
          enum={channels}
          x-props={{
            placeholder: '请选择',
          }}
        />
        <Field
          required
          title="年月"
          name="auditMonth"
          type="date"
          x-props={{
            placeholder: '请选择',
            picker: 'month',
            style: {
              width: 180,
            },
            disabledDate: currentDate =>
              dayjs(currentDate).format('YYYY-MM') >= dayjs().format('YYYY-MM'),
          }}
        />
        <Field
          required
          visible={false}
          title="订单"
          name="order"
          type="order-upload"
          x-props={{
            placeholder: '请上传',
            action: '/cmmc-market/orderAudit/uploadFile',
            file: '订单稽核模板.xlsx',
          }}
        />
      </SchemaForm>
    </Modal>
  )
}
