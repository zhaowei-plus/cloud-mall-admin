import React, { Fragment } from 'react'
import cs from 'classnames'
import { Layout } from '@/components'
import { getColumns } from './config'
import { useTable } from '@/hooks'

import Empty from './components/empty'

import './index.less'

const { Content } = Layout

export default () => {
  const { table, XmTable } = useTable('account/list')

  const columns = getColumns()
  const isEmpty = table.pagination.total === 0

  return (
    <Layout>
      <Content
        wrapperClassName={cs('info', {
          info__empty: isEmpty,
        })}
      >
        {isEmpty ? (
          <Empty />
        ) : (
          <Fragment>
            <h1>
              收款账户新增、更新或存在问题请直接反馈客服人员，联系电话：0571-58110101。
            </h1>
            {table.pagination.total > 0 ? (
              <XmTable columns={columns} rowSelection={false} />
            ) : (
              <div className="info__empty">
                <h1>
                  暂无收款账户，请联系客服人员做配置，以便商品正常上架售卖。
                </h1>
              </div>
            )}
          </Fragment>
        )}
      </Content>
    </Layout>
  )
}
