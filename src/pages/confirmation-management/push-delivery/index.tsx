import React from 'react'
import { Modal, message, Space } from 'antd'
import { useLocation } from 'umi'

import { Layout, Search, Preview, Action } from '@/components'
import { useTable } from '@/hooks'
import { getColumns, getSchema } from './config'

import http from '@/api'
import dayjs from 'dayjs'

const { Content } = Layout

export default props => {
  const { history } = props
  const { pathname } = useLocation()

  const { table, XmTable } = useTable(
    'confirmationManagement/pushDelivery/list'
  )
  const { selectedRows } = table.params

  const handleSearch = (params: any = {}) => {
    const { expiryDateStart, expiryDateEnd, ...rest } = params
    if (expiryDateStart && expiryDateEnd) {
      rest.expiryDateStart = `${expiryDateStart} 00:00:00`
      rest.expiryDateEnd = `${expiryDateEnd} 23:59:59`
    }
    table.onSearch(rest)
  }

  const handleAdd = () => {
    history.push(`${pathname}/add`)
  }

  const handleEdit = () => {
    if (selectedRows.length === 1) {
      // 是否含有推送中或已结束的记录
      const isCanEdit = selectedRows.every((item: any) =>
        [1, 5].includes(item.status)
      )
      if (isCanEdit) {
        return message.warn('请选择非“推送中”或“已结束”的记录')
      }
      history.push(`${pathname}/edit/${selectedRows[0].id}`)
    } else {
      message.destroy()
      message.warning('请单选记录做编辑')
      return false
    }
  }

  const handlePreview = () => {
    if (selectedRows.length === 1) {
      const [record] = selectedRows
      Preview.iframe(record.activityUrl)
    } else {
      message.destroy()
      message.warning('请单选记录做预览')
      return false
    }
  }

  const handlePush = () => {
    const ids = selectedRows.map(it => it.id)
    if (!ids.length) {
      return message.warn('请至少选择一条数据')
    }

    // 是否含有推送中或已结束的记录
    const isPushingStatus = selectedRows.every((item: any) =>
      [1, 5].includes(item.status)
    )
    if (isPushingStatus) {
      return message.warn('请选择非“推送中”或“已结束”的记录')
    }

    // 截止时间是否晚于当前时间
    const deTime = selectedRows.every(
      (item: any) => dayjs(item.expiryDate).valueOf() <= dayjs().valueOf()
    )
    if (deTime) {
      return message.warn('请选择截止时间前的记录')
    }

    Modal.confirm({
      centered: true,
      title: '确认弹窗',
      content: (
        <div>
          <p>推送后目标用户将收到确认单。</p>
          <p>确定推送吗？</p>
        </div>
      ),
      onOk: () => {
        http
          .post('confirmationManagement/pushDelivery/push', { ids })
          .then(res => {
            const { success } = res
            if (success) {
              message.success('推送成功')
              table.onFetch()
            }
          })
      },
    })
  }
  const handleInfo = () => {
    if (selectedRows.length === 1) {
      history.push(`${pathname}/detail/${selectedRows[0].id}`)
    } else {
      return message.warn('请单选记录查看')
    }
  }

  const handleDetail = () => {
    if (selectedRows.length === 1) {
      history.push(`${pathname}/detail-list/${selectedRows[0].id}`)
    } else {
      return message.warn('请单选记录查看详情')
    }
  }

  const actionMap = {
    156: handleAdd, // 新增
    157: handleEdit, // 编辑
    159: handlePreview, // 预览
    160: handlePush, // 推送
    158: handleInfo, // 查看
    161: handleDetail, // 详情
  }

  const schema = getSchema()
  const columns = getColumns()

  return (
    <Layout>
      <Content>
        <Search schema={schema} onSearch={handleSearch} />
        <Space style={{ margin: 10 }}>
          <div>
            说明：再次推送仅会下发到待确认的用户，且同一条确认单每天用户仅能收到一次。
          </div>
        </Space>
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 'max-content' }} />
      </Content>
    </Layout>
  )
}
