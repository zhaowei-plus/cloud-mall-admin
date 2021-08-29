import React, { useEffect, useMemo } from 'react'
import { Layout, Menu } from 'antd'
import cookies from 'react-cookies'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router'
import http from '@/api'
import { formatPath, getMenuKey } from '@/assets/utils'

import './index.less'

const { Sider } = Layout
const { SubMenu } = Menu

interface IRoute {
  key?: number
  title?: string
  path?: string
  children?: Array<IRoute>
}

interface IProps {
  children?: React.ReactNode
  history?: any
  location?: any
  routes?: Array<any>
}

interface IResponse {
  success: boolean
  data: Array<IRoute>
}

const Index: React.FC = (props: IProps) => {
  const {
    history,
    location: { pathname },
    routes,
  } = props

  const dispatch = useDispatch()
  const fetchBtnAuthority = resourceId => {
    if (resourceId) {
      cookies.save('resourceId', resourceId)
      http
        .post('platform/btnAuthority', { resourceId, menuId: resourceId })
        .then(({ success, data = [] }: IResponse) => {
          if (success) {
            dispatch({
              type: 'SET_BUTTONS',
              payload: data,
            })
          }
        })
    }
  }

  // 选择的菜单项发生改变
  const paths = useMemo(
    () =>
      pathname
        .split('/')
        .filter(Boolean)
        .map(
          (d: any, index: number, arr: any) =>
            `/${arr.slice(0, index + 1).join('/')}`
        ),
    [pathname]
  )

  useEffect(() => {
    // 请求菜单
    const getMenuKey = (routes = [], paths = []) => {
      let menuKey = []

      const calcMenuKey = (routes = [], paths = []) => {
        routes.some(({ key, path, children }) => {
          if (paths.includes(path)) {
            menuKey.push(key)
            if (Array.isArray(children) && children.length > 0) {
              calcMenuKey(children, paths)
            }
            return true
          }
          return false
        })
      }

      calcMenuKey(routes, paths)
      return menuKey
    }

    const menuPaths = getMenuKey(routes, paths)
    fetchBtnAuthority(menuPaths.pop())
  }, [paths, routes])

  const handleClick = ({ key }) => {
    if (key !== pathname) {
      const paths = formatPath(key)
      const menuPaths = getMenuKey(routes, paths)
      const resourceId = menuPaths.pop()
      cookies.save('resourceId', resourceId)
      history.push(key)
    }
  }

  const renderRoutes = (routes: Array<any>) =>
    routes.map(({ key, title, path, children = [], show = true }) => {
      if (Array.isArray(children) && children.length > 0) {
        return (
          <SubMenu key={path} title={title}>
            {renderRoutes(children)}
          </SubMenu>
        )
      }
      return <Menu.Item key={path}>{title}</Menu.Item>
    })

  const defaultOpenKeys = routes
    .filter(it => Array.isArray(it.children) && it.children.length > 0)
    .map(d => d.path)

  return (
    <Sider style={{ backgroundColor: '#fff' }} className="sider">
      {routes.length > 0 && (
        <Menu
          mode="inline"
          defaultOpenKeys={defaultOpenKeys}
          selectedKeys={paths}
          onClick={handleClick}
        >
          {renderRoutes(routes)}
        </Menu>
      )}
    </Sider>
  )
}

export default withRouter(Index)
