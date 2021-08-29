import React from 'react'
import { Layout } from '@/components'
import ActivityCard from './components/activity-card'
import ActivityList from './components/activity-list'

const { Content } = Layout

export default () => {
  return (
    <Layout>
      <Content style={{ paddingTop: 0 }}>
        <ActivityCard />
        <ActivityList />
      </Content>
    </Layout>
  )
}
