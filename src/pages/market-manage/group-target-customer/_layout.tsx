import React from 'react'
import { Tabs } from 'antd'

import { Layout } from '@/components'
import Enterprise from './enterprise'
import Member from './member'
import TargetCustomer from './target-customer'

const { TabPane } = Tabs

const { Content } = Layout

export default () => {
  return (
    <Tabs type="card">
      <TabPane tab="目标企业" key="1">
        <Enterprise />
      </TabPane>
      <TabPane tab="目标成员" key="2">
        <Member />
      </TabPane>
      <TabPane tab="追加目标客户" key="3">
        <TargetCustomer />
      </TabPane>
    </Tabs>
  )
}
