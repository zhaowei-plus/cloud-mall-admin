import React from 'react'
import { Layout } from '@/components'

import './index.less'

const { Content } = Layout

export default () => {
  return (
    <Layout>
      <Content wrapperClassName="home">
        {!!HOME ? (
          <div
            className="home--bg"
            style={{ backgroundImage: `url(${require(HOME)})` }}
          />
        ) : (
          <h1>欢迎登录{TITLE}！</h1>
        )}
      </Content>
    </Layout>
  )
}
