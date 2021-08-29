import React from 'react'
import cookies from 'react-cookies'
import { Layout } from '@/components'
import List from './components/list'

import './index.less'

const { Content } = Layout

export default () => {
  const { regionCodeList = [] } = cookies.load('user')
  return (
    <Layout>
      <Content wrapperClassName="group-detail">
        <div className="info">
          <label className="info__title">集团明细</label>
        </div>
        <div className="content">
          <List regionCodeList={regionCodeList.join(',')} />
        </div>
      </Content>
    </Layout>
  )
}
