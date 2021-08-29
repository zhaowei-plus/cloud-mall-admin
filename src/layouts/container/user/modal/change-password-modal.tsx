import React from 'react'
import { Modal, message } from 'antd'
import cookies from 'react-cookies'
import md5 from 'js-md5'
import { history } from 'umi'
import http from '@/api'
import { ISubmit, IResponse } from '@/assets/constant'
import { SchemaForm, Submit, FormButtonGroup } from '@formily/antd'
import { getSchema } from '../config'

import './index.less'

interface IProps {
  mobile: string
  onCancel: () => void
}

export default (props: IProps) => {
  const { mobile, onCancel } = props

  const onSubmit = (params: ISubmit) => {
    const { cerifyCode, newPassword, confirmPassword } = params
    // 1、完整信息校验
    if (!(cerifyCode && newPassword && confirmPassword)) {
      message.warn('请填写完整信息')
      return false
    }

    // 密码校验可参考：http://www.aijquery.cn/Html/jqueryjiqiao/200.html

    // 数字，数字或字母组合，6 ~ 18位
    if (!/^[a-zA-Z0-9]{6,18}$/.test(newPassword)) {
      message.warn('请输入6-18位字符的密码（可含数字、大小写字母）')
      return false
    }

    if (newPassword !== confirmPassword) {
      message.warn('请输入一致的密码')
      return false
    }

    // 发送请求，修改密码
    http
      .post('login/changePswd', {
        verifyCode: cerifyCode,
        newPwd: md5(newPassword),
      })
      .then((res: IResponse) => {
        if (res.success) {
          message.success('密码修改成功')
          cookies.save('needUpdatePwd', false)
          history.push('/login')
          onCancel()
        } else {
          message.error(res.msg || '密码修改失败')
        }
      })
  }

  const handleCancel = () => {
    if (cookies.load('needUpdatePwd') === 'true') {
      history.push('/login')
    }

    onCancel()
  }

  const schema = getSchema()
  return (
    <Modal
      visible
      centered
      footer={null}
      title="密码修改"
      onCancel={handleCancel}
      maskClosable={false}
      wrapClassName="change-password-modal"
    >
      <SchemaForm
        labelCol={6}
        wrapperCol={14}
        onSubmit={onSubmit}
        schema={{
          type: 'object',
          properties: schema,
        }}
        defaultValue={{ mobile }}
        className="change-password"
      >
        <FormButtonGroup align="center">
          <Submit>确定</Submit>
        </FormButtonGroup>
      </SchemaForm>
    </Modal>
  )
}
