import React, { Fragment, useEffect, useState } from 'react'
import { Menu, Dropdown } from 'antd'
import cookies from 'react-cookies'
import { DownOutlined } from '@ant-design/icons'
import { history } from 'umi'
import { useVisible } from '@/hooks'
import http from '@/api'

import ChangePasswordModal from './modal/change-password-modal'

import './index.less'

const { Item } = Menu

export default () => {
  const [name, setName] = useState()
  const [mobile, setMobile] = useState()
  const changePasswordModal = useVisible()

  const handleExit = () => {
    http.post('login/loginOut', {}, { notify: false }).finally(() => {
      cookies.remove('user')
      cookies.remove('resourceId')
      cookies.remove('csm_admin_token')
      history.push('/login')
    })
  }

  const handleChangePassword = () => {
    changePasswordModal.open(mobile)
  }

  const menuContent = (
    <Menu>
      <Item>
        <a onClick={handleChangePassword}>修改密码</a>
      </Item>
      <Item>
        <a onClick={handleExit}>退出登录</a>
      </Item>
    </Menu>
  )

  useEffect(() => {
    const user = cookies.load('user')
    if (user) {
      setName(user.name)
      setMobile(user.mobile)
      if (cookies.load('needUpdatePwd') === 'true') {
        changePasswordModal.open()
      }
    } else {
      history.push('/login')
    }
  }, [])

  return (
    <Fragment>
      <div className="user">
        <i className="icon iconfont icon-user" />
        <Dropdown overlay={menuContent}>
          <span className="user__name">{name}</span>
        </Dropdown>
        <DownOutlined />
      </div>
      {changePasswordModal.visible && (
        <ChangePasswordModal
          mobile={mobile}
          onCancel={changePasswordModal.close}
        />
      )}
    </Fragment>
  )
}
