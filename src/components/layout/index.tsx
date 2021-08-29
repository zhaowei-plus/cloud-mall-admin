import React from 'react'
import { Spin, PageHeader } from 'antd'
import { useSelector } from 'react-redux'
import { IStore } from '@/assets/constant'
import cs from 'classnames'

import './index.less'

/**
 * 公用布局组件
 */
const Layout = (props: any) => {
  const loading = useSelector((state: IStore) => state.loading)
  const { children } = props
  return (
    <Spin spinning={loading > 0} wrapperClassName="page-layout">
      {children}
    </Spin>
  )
}

const Header = (props: any) => {
  const { wrapperClassName = '', ...rest } = props
  return <PageHeader {...rest} className={`page-header ${wrapperClassName}`} />
}

const Content = (props: any) => {
  const {
    children,
    wrapperClassName = '', // 额外样式
    ...rest // 其他属性，如 style 等
  } = props
  return (
    <div className={`page-content ${wrapperClassName}`} {...rest}>
      {children}
    </div>
  )
}

const Footer = (props: any) => {
  const {
    hidden,
    children,
    wrapperClassName = '', // 额外样式
    ...rest // 其他属性，如 style 等
  } = props
  return (
    <div
      className={cs(`page-footer ${wrapperClassName}`, { hidden: hidden })}
      {...rest}
    >
      {children}
    </div>
  )
}

Layout.Header = Header
Layout.Content = Content
Layout.Footer = Footer

export default Layout
