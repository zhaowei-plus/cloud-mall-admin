import React from 'react'
import { message, Alert, Modal, Button } from 'antd'

import { Layout, Action, ImportExcel } from '@/components'
import { useTable } from '@/hooks'
import http from '@/api'
import template from '@/assets/files/黑名单导入模板.xlsx'

const { Content } = Layout

export default (): JSX.Element => {
  const { table, XmTable } = useTable('blackList/list')

  const remove = ids => {
    http.post('blackList/delete', { ids: ids }).then(() => {
      message.success('删除成功')
      table.onSearch()
    })
  }

  const handleBatchDelete = () => {
    const ids = table.params.selectedRows.map(it => it.id)

    if (!ids.length) return message.warn('请至少选择一条数据')
    Modal.confirm({
      title: '确定要删除吗？',
      content: '名单删除后，该部分用户将正常接收后续的活动推送提醒。',
      onOk: () => {
        remove(ids)
      },
    })
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'title',
    },
    {
      title: '导入时间',
      dataIndex: 'importTime',
    },
    {
      title: '创建人手机号',
      dataIndex: 'creatorMobile',
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
          <a
            href={`/cmmc-market/forbid/customer/export?id=${it.id}&caiyun=true`}
          >
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
          <a
            href={`/cmmc-market/forbid/customer/export?id=${it.id}&caiyun=false`}
          >
            {it.uncaiyunNum}
          </a>
        ) : (
          0
        )
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

  const actionMap = {
    91: handleBatchDelete,
  }

  const componentMap = {
    90: ({ index }) => (
      <ImportExcel
        name="file"
        action="/cmmc-market/forbid/customer/import"
        onLoaded={handleLoaded}
        className="mr2"
      >
        {loading => (
          <Button type={!index ? 'primary' : 'default'} loading={loading}>
            导入黑名单
          </Button>
        )}
      </ImportExcel>
    ),
  }

  return (
    <Layout>
      <Content>
        <Alert
          message="黑名单用户无法收到营销平台和客户经理的全部方式的推送，同时适用与集团和市场活动。"
          type="warning"
        />
        <div>
          <Action actionMap={actionMap} componentMap={componentMap} />
          <a href={template}>模板下载</a>
        </div>
        <XmTable columns={columns} rowSelection scroll={{ x: 1100 }} />
      </Content>
    </Layout>
  )
}
