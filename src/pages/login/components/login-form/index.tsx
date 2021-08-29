import React from 'react'
import md5 from 'js-md5'
import SchemaForm, { SchemaMarkupField as Field, Submit } from '@formily/antd'
import { ISubmit } from '@/assets/constant'
import './index.less'

export default props => {
  const { onLogin } = props
  const onSubmit = (params: ISubmit) => {
    const { username, password } = params
    return onLogin({ username, password: md5(password) })
  }

  return (
    <div className="login-from">
      <SchemaForm labelCol={0} wrapperCol={24} onSubmit={onSubmit}>
        <Field
          type="string"
          name="username"
          x-props={{
            placeholder: '请输入手机号',
          }}
          x-rules={[{ required: true, message: '请输入手机号' }]}
        />
        <Field
          type="xm-password"
          name="password"
          x-props={{
            placeholder: '请输入密码',
          }}
          x-rules={[{ required: true, message: '请输入密码' }]}
        />
        <Submit className="btn-submit">登录</Submit>
      </SchemaForm>
    </div>
  )
}
