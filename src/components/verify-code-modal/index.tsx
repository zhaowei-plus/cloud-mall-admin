import React, { useMemo } from 'react'
import { Modal } from 'antd'
import cookies from 'react-cookies'
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
} from '@formily/antd'
import http from '@/api'

export default props => {
  const { params = {}, exportDataType, onOk, onCancel } = props
  const { mobile } = cookies.load('user')
  const actions = useMemo(() => createAsyncFormActions(), [])

  const handleOk = () => {
    return actions.submit().then(({ values }: any) => {
      const { captcha } = values
      return http
        .post('dataCenter/checkVerifyCode', { exportDataType, captcha })
        .then(res => {
          if (res.success) {
            Modal.confirm({
              centered: true,
              title: '导出',
              content:
                '您确定要导出数据吗？导出数据存在泄漏风险，请谨慎执行，点击确定后请耐心等待，不要关闭浏览器',
              onOk: () => onOk(values),
            })
          }
        })
    })
  }

  return (
    <Modal
      visible
      centered
      onOk={handleOk}
      title="导出前身份校验"
      onCancel={onCancel}
      maskClosable={false}
    >
      <SchemaForm
        labelCol={7}
        validateFirst
        wrapperCol={12}
        actions={actions}
        previewPlaceholder="-"
        initialValues={{ ...params, mobile }}
      >
        <Field
          required
          type="verify-code"
          name="mobile"
          title="手机号码"
          x-props={{
            url: 'dataCenter/verifyCode',
            params: {
              exportDataType,
            },
          }}
        />
        <Field
          required
          type="xm-number"
          name="captcha"
          title="验证码"
          x-props={{
            placeholder: '请输入',
          }}
        />
      </SchemaForm>
    </Modal>
  )
}
