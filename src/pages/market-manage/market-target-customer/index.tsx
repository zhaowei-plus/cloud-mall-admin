import React from 'react'
import { message, Alert, Button, Modal } from 'antd'
import { css } from 'emotion'

import { Layout, Search, Action, ImportExcel } from '@/components'
import { useTable } from '@/hooks'
import http from '@/api'
import { getSchema } from './config'
import template from '@/assets/files/目标成员导入模板.xlsx'
import { STATUS } from './constant'

const { Content } = Layout

const alertCl = css(`
  padding: 20px;
  color: #262a30;
  line-height: 20px;
  background-color: #f7f8f9;
  border: 1px solid #e9ecf0;
  border-radius: 4px;
  margin-bottom:16px;
`)

export default (): JSX.Element => {
  const { table, XmTable } = useTable(
    'targetCustomer/list',
    {},
    { listStyle: 3 }
  )

  const schema = getSchema()

  const remove = ids => {
    http.post('targetCustomer/delete', { idList: ids }).then(() => {
      message.success('删除成功')
      table.onSearch()
    })
  }

  const handleBatchDelete = () => {
    const ids = table.params.selectedRows.map(it => it.id)

    if (!ids.length) return message.warn('请至少选择一条数据')

    Modal.confirm({
      title: '确定要删除吗？',
      onOk: () => {
        remove(ids)
      },
    })
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'code',
    },
    {
      title: '名称',
      dataIndex: 'title',
    },
    {
      title: '创建人手机号',
      dataIndex: 'creatorMobile',
    },
    {
      title: '导入时间',
      dataIndex: 'importTime',
    },

    {
      title: '导入量',
      dataIndex: 'totalNum',
    },
    {
      title: '渝企信用户数',
      key: 'caiyunNum',
      render: it =>
        it.caiyunNum ? (
          <a href={`/cmmc-market/aims/user/export?id=${it.id}&caiyun=true`}>
            {it.caiyunNum}
          </a>
        ) : (
          0
        ),
    },
    {
      title: '非渝企信用户数',
      key: 'uncaiyunNum',
      render: it => {
        return it.uncaiyunNum ? (
          <a href={`/cmmc-market/aims/user/export?id=${it.id}&caiyun=false`}>
            {it.uncaiyunNum}
          </a>
        ) : (
          0
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: value => {
        const item = STATUS.find(item => value === item.value)
        if (item) {
          return item.label
        }
        return '-'
      },
    },
  ]

  const handleLoaded = res => {
    if (res.success) {
      message.success('导入成功')
      table.onSearch()
    } else {
      message.error(res.msg || '导入出错，请重试')
    }
  }

  const component = ({ index }) => (
    <ImportExcel
      name="file"
      action="/cmmc-market/market/user/import"
      onLoaded={handleLoaded}
    >
      {loading => (
        <Button loading={loading} type={!index ? 'primary' : 'default'}>
          导入目标成员
        </Button>
      )}
    </ImportExcel>
  )

  const actionMap = {
    89: handleBatchDelete,
  }

  const componentMap = {
    88: component,
  }

  return (
    <Layout>
      <Content>
        <Alert
          className={alertCl}
          message="该部分目标客户仅针对市场类活动生效"
        />
        <Search schema={schema} onSearch={table.onSearch} />
        <div>
          <Action actionMap={actionMap} componentMap={componentMap} />
          <a href={template}>模板下载</a>
        </div>
        <XmTable columns={columns} scroll={{ x: 1280 }} />
      </Content>
    </Layout>
  )
}
