import React, { useState, useMemo, useEffect } from 'react'
import { Layout } from 'antd'
import cookies from 'react-cookies'
import { withRouter } from 'react-router'
import http from '@/api'
import { flatMenuPage } from '@/assets/utils'
import User from './user'
import Sider from './sider'
import Company from './company'
import Category from './category'

import './index.less'

interface IRoute {
  name: string
  path: string
  component?: any
  children?: Array<IRoute>
}

interface IMenu {
  key: number
  title: string
  children: Array<IRoute>
}

const { Header, Content } = Layout

interface IProps {
  children?: React.ReactNode
  history?: any
  location?: any
}

// 路由分层级
const Container = (props: IProps) => {
  const {
    history,
    children,
    location: { pathname },
  } = props

  const [menus, setMenus] = useState<Array<IMenu>>([])
  const [flatMenus, setFlatMenus] = useState({})
  const [active, setActive] = useState(-1)
  const fetchMenus = () => {
    http.post('platform/menu', {}).then(({ success, data = [] }: any) => {
      if (success) {
        setMenus(data)
        setActive(data[0].key)
        setFlatMenus(flatMenuPage(data))
      }
    })
  }

  const resetCurrentPath = key => {
    const menu = menus.find(item => item.key === key)
    if (menu) {
      const [first] = menu.children
      if (Array.isArray(first.children) && first.children.length > 0) {
        const [{ path }] = first.children
        const { resourceId } = flatMenus[path]
        cookies.save('resourceId', resourceId)
        history.push(path)
      } else {
        history.push(first.path)
      }
    }
  }

  const handleChange = key => {
    setActive(key)
    resetCurrentPath(key)
  }

  useEffect(() => {
    fetchMenus()
  }, [])

  useEffect(() => {
    const current = flatMenus[pathname]
    if (current) {
      setActive(current.menu)
    }
  }, [pathname, flatMenus])

  const routes = useMemo(() => {
    const menu = menus.find(item => item.key === active)
    if (menu) {
      return menu.children
    }
    return []
  }, [active, menus])

  if (!cookies.load('user')) {
    history.push('/login')
  }

  return (
    <Layout className="xm-container">
      <Header className="xm-container__header">
        <Company />
        <Category active={active} menus={menus} onChange={handleChange} />
        <User />
      </Header>
      <Layout className="xm-container__content">
        <Sider key={active} routes={routes} />
        <Layout className="main-content">
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default withRouter(Container)
