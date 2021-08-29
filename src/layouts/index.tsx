import React from 'react'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { IRouteComponentProps } from 'umi'
import zhCN from 'antd/es/locale/zh_CN'

import './index.less'

import store from '@/store'
import Container from './container'

export default ({ history, location, children }: IRouteComponentProps) => {
  if (location.pathname === '/login') {
    return children
  }

  if (location.pathname === '/') {
    history.push('/home')
  }

  return (
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <Container>{children}</Container>
      </Provider>
    </ConfigProvider>
  )
}
