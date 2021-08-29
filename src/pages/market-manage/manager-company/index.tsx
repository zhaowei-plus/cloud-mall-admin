import React from 'react'
import { Layout, Search } from '@/components'

import { useTable } from '@/hooks'
import { getSchema, getColumns } from './config'

const { Content } = Layout

const columns = getColumns()

const schema = getSchema()

export default (): JSX.Element => {
  const { table, XmTable } = useTable('managerCompany/list')

  return (
    <Layout>
      <Content>
        <Search schema={schema} onSearch={table.onSearch} />
        <XmTable
          columns={columns}
          rowSelection={false}
          className="mt2"
          scroll={{ x: 800 }}
        />
      </Content>
    </Layout>
  )
}
