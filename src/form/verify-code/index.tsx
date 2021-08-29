import React, { useState, useEffect } from 'react'
import { Input, message } from 'antd'
import cs from 'classnames'
import http from '@/api'
import { IResponse } from '@/assets/constant'
import './index.less'

const VerifyCode = props => {
  const { value, url, params = {}, mutators } = props
  const [verifyCode, setVerifyCode] = useState<number>(0)

  const handleChange = (e: any) => {
    mutators.change(e.target.value)
  }

  const handleSmsCode = () => {
    message.destroy()
    if (!value) {
      message.warn('请输入手机号码')
      return false
    } else if (!/^1[3456789]\d{9}$/.test(value)) {
      message.warn('请输入正确格式的手机号码')
      return false
    }

    // 获取短信验证码
    return http
      .get(url, { phone: value, ...params }, { notify: false })
      .then((res: IResponse) => {
        if (res.success) {
          message.success('验证码发送成功')
          setVerifyCode(60)
        }
      })
      .catch(error => {
        message.error(error.msg || '验证码发送失败')
      })
  }

  useEffect(() => {
    if (verifyCode > 0) {
      setTimeout(() => {
        setVerifyCode(verifyCode - 1)
      }, 1000)
    }
  }, [verifyCode])

  return (
    <div className="verify-code">
      <Input
        value={value}
        placeholder="请输入手机号码"
        onChange={handleChange}
        style={{
          width: 136,
        }}
        disabled
      />
      <a
        className={cs('verify-code-btn', {
          disabled: verifyCode > 0,
        })}
        onClick={handleSmsCode}
      >
        {verifyCode > 0 ? (
          <span className="time-keep">重新获取 {verifyCode}s</span>
        ) : (
          '获取短信验证码'
        )}
      </a>
    </div>
  )
}

export default VerifyCode
