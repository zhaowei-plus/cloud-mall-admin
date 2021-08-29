import React from 'react'
import { Modal, message } from 'antd'
import querystring from 'querystring'
import dayjs from 'dayjs'

import { Layout, Action, Search } from '@/components'
import { useVisible, useTable } from '@/hooks'
import http from '@/api'
import { getSchema, getColumns } from './config'

import AddModal from './components/add-modal'

import './index.less'

const { Header, Content } = Layout

export default props => {
  const { history, location } = props
  const { pathname } = location
  const addModal = useVisible()
  const { table, XmTable } = useTable('beSettlement/orderCheck/list')
  const { selectedRows, ...tableParams } = table.params

  const handleSearch = (params: any = {}) => {
    const { auditStartMonth, auditEndMonth, ...rest } = params
    if (auditStartMonth && auditEndMonth) {
      rest.auditStartMonth = dayjs(auditStartMonth).format('YYYYMM')
      rest.auditEndMonth = dayjs(auditEndMonth).format('YYYYMM')
    }
    table.onSearch(rest)
  }

  const handleAdd = () => {
    addModal.open()
  }

  const handleDeliver = () => {
    message.destroy()

    if (selectedRows.length !== 1) {
      message.warn('请单选记录做发放')
      return false
    }

    const [{ id: bizId, channelId }] = selectedRows
    http.get('beSettlement/orderCheck/beanCheck', { bizId }).then(res => {
      const { success, data } = res
      if (success) {
        Modal.confirm({
          centered: true,
          title: '提示',
          content: (
            <div>
              <p>确定要发放彩豆吗？</p>
              <p>实际需发彩豆数：{data}</p>
            </div>
          ),
          onOk: () =>
            http
              .post('beSettlement/orderCheck/sendBean', { bizId, channelId })
              .then(res => {
                if (res.success) {
                  message.success('彩豆发放成功')
                  table.onFetch()
                }
              }),
        })
      }
    })
  }

  const handleDetail = () => {
    message.destroy()

    if (selectedRows.length !== 1) {
      message.warn('请单选记录查看')
      return false
    }
    history.push(`${pathname}/detail/${selectedRows[0].id}`)
  }

  const handleExport = () => {
    const ids = selectedRows.map((record: any) => record.id).join(',')
    if (table.pagination.total === 0) {
      message.destroy()
      message.error('导出失败，订单记录为空')
      return false
    }
    window.location.href = `/cmmc-market/orderAudit/export?${querystring.stringify(
      {
        ids,
        ...tableParams,
      }
    )}`
  }

  const actionMap = {
    142: handleAdd, // 新增稽核
    143: handleDeliver, // 发放彩豆
    144: handleDetail, // 查看
    145: handleExport, // 导出
  }

  const schema = getSchema()
  const columns = getColumns()

  return (
    <Layout>
      <Content>
        <Search schema={schema} onSearch={handleSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 1200 }} />
      </Content>
      {addModal.visible && (
        <AddModal
          params={addModal.params}
          onCancel={addModal.close}
          onOk={() => {
            addModal.close()
            table.onFetch()
          }}
        />
      )}
    </Layout>
  )
}
