import React, { useEffect, useState } from 'react'
import cs from 'classnames'
import dayjs from 'dayjs'
import { history } from 'umi'
import { message, Modal } from 'antd'
import cookies from 'react-cookies'
import { IResponse } from '@/assets/constant'
import http from '@/api'
import LoginForm from './components/login-form'
import LoginQRCode from './components/login-qrcode'

import './index.less'

const LoginTypes = [
  // { label: '密码登陆', value: 0 },
  { label: '扫码登陆', value: 1 },
]

export default () => {
  // 维护公告显示时间范围
  const showMaintenanceAnnouncement =
    dayjs('2021-04-07 00:00:00').isBefore(dayjs()) &&
    dayjs().isBefore(dayjs('2021-04-11 10:00:00'))
  const [loginType, setLoginType] = useState(1)

  const onLogin = accessParam => {
    return http
      .post('login/loginIn', { accessParam, loginType })
      .then(({ success, data = {}, msg }: IResponse) => {
        if (success) {
          const { needUpdatePwd, regionCode, ...user } = data
          cookies.save('user', user)
          cookies.save('regionCode', regionCode)
          cookies.save('needUpdatePwd', needUpdatePwd) // 是否需要更新密碼
          history.push('/home')
        } else {
          message.error(msg || '登录失败')
        }
      })
  }

  useEffect(() => {
    showMaintenanceAnnouncement &&
      Modal.info({
        centered: true,
        title: '尊敬的用户',
        content: (
          <div>
            <p>
              因系统升级，渝企信将于4月10日晚22:00至4月11日上午10点期间开展业务维护更新。业务维护期间渝企信功能应用将暂无法使用，预计4月11日上午10点恢复。维护期间造成不便敬请谅解，感谢您的理解与支持！
            </p>
            <p style={{ textAlign: 'right' }}>渝企信</p>
          </div>
        ),
        okText: '知道了',
      })
  }, [])

  const isTest = !!TEST
  return (
    <div className="login">
      <div className="login__header">
        <img src={require(LOGO)} className="icon" />
        <span className="title">{TITLE}</span>
      </div>
      <div className="login__content">
        <div className="header">
          {isTest && (
            <div
              className={cs('login-type', {
                actived: loginType === 0,
              })}
              onClick={() => setLoginType(0)}
            >
              密码登陆
            </div>
          )}
          <div
            className={cs('login-type', {
              actived: loginType === 1,
            })}
            onClick={() => setLoginType(1)}
          >
            扫码登陆
          </div>
        </div>
        <div className="content">
          {loginType === 0 && (
            <LoginForm onLogin={onLogin} loginType={loginType} />
          )}
          {loginType === 1 && (
            <LoginQRCode onLogin={onLogin} loginType={loginType} />
          )}
        </div>
      </div>
      <div className="login__footer">
        <p className="tips">尚未开通账号请联系管理员</p>
      </div>
    </div>
  )
}
