import React, { useEffect } from 'react'
import { Modal, message } from 'antd'
import { useLocation } from 'umi'

import { Action, Layout, Search, Preview } from '@/components'
import { useVisible, useTable } from '@/hooks'
import { getSchema, getColumns } from './config'

import http from '@/api'
import { IResponse } from '@/assets/constant'

import './index.less'

const { Content } = Layout

export default props => {
  const { history } = props
  const { pathname } = useLocation()

  const { table, XmTable } = useTable('material/list')
  const { selectedRows } = table.params

  const handleSearch = (params: any = {}) => {
    const {
      activityBeginTime,
      activityEndTime,
      regionCode = [],
      ...rest
    } = params
    if (activityBeginTime && activityEndTime) {
      rest.activityBeginTime = `${activityBeginTime} 00:00:00`
      rest.activityEndTime = `${activityEndTime} 23:59:59`
    }
    if (regionCode.length > 0) {
      rest.regionCode = regionCode[regionCode.length - 1]
    }
    table.onSearch(rest)
  }

  const handleAdd = () => {
    history.push(`${pathname}/add`)
  }

  const handleEdit = () => {
    // 是否可编辑
    const EditStatus = [
      1, // 待上架
      2, // 未开始
      3, // 进行中
      4, // 已推送
    ]

    const canEdit = selectedRows.every((record: any) =>
      EditStatus.includes(record.status)
    )
    if (selectedRows.length === 1 && canEdit) {
      const [record] = selectedRows
      history.push(`${pathname}/edit/${record.id}`)
    } else {
      message.destroy()
      message.warning('请选择待上架、未开始、进行中或已推送状态的记录')
      return false
    }
  }

  const handlePreview = () => {
    if (selectedRows.length === 1) {
      const [{ id, activityUrl }] = selectedRows
      Preview.iframe(activityUrl, '', { materialId: id })
    } else {
      message.destroy()
      message.warning('请单选记录做预览')
      return false
    }
  }

  const handleDetail = () => {
    if (selectedRows.length === 1) {
      const [record] = selectedRows
      history.push(`${pathname}/detail/${record.id}`)
    } else {
      message.destroy()
      message.warning('请单选记录做查看')
      return false
    }
  }

  const handleCopy = () => {
    if (selectedRows.length === 1) {
      const [record] = selectedRows
      history.push(`${pathname}/add?id=${record.id}`)
    } else {
      message.destroy()
      message.warning('请单选记录做复制')
      return false
    }
  }

  const handleStatus = nextStatus => {
    // 是否可上架：待上架（1）
    const canPutOn = selectedRows.every((record: any) => record.status === 1)
    // 是否可下架：未开始（2）、进行中（3）、已推送（4）
    const canPutOff = selectedRows.every((record: any) =>
      [2, 3, 4].includes(record.status)
    )

    let content: any
    let successText = ''
    if (nextStatus === 1) {
      if (selectedRows.length > 0 && canPutOn) {
        // 上架
        content = (
          <div>
            <p>活动上架后，若处于活动时间内，会上架到对应可见位置。</p>
            <p style={{ fontSize: 16 }}>确定上架吗？</p>
          </div>
        )
        successText = '上架成功'
      } else {
        message.destroy()
        message.warning('请选择待上架状态的记录')
        return false
      }
    }

    if (nextStatus === 0) {
      if (selectedRows.length > 0 && canPutOff) {
        // 下架
        content = (
          <div>
            <p>
              活动下架后，相应可见位置会下架，不再支持推送和分享，统计数据仍保留。
            </p>
            <p style={{ fontSize: 16 }}>确定下架吗？</p>
          </div>
        )
        successText = '下架成功'
      } else {
        message.destroy()
        message.warning('请选择未开始、进行中或已推送状态的记录')
        return false
      }
    }

    if (content) {
      Modal.confirm({
        centered: true,
        title: '提示',
        content,
        onOk: () =>
          http
            .post('material/status', {
              ids: selectedRows.map((record: any) => record.id),
              status: nextStatus,
            })
            .then((res: IResponse) => {
              message.destroy()
              if (res.success) {
                message.success(successText)
                table.onFetch()
              } else {
                message.success(res.msg)
              }
            }),
      })
    }
  }

  const handleDelete = () => {
    // 是否可删除：已过期（5）、已下架（6）
    const canDelete = selectedRows.every((record: any) =>
      [5, 6].includes(record.status)
    )

    if (selectedRows.length > 0 && canDelete) {
      Modal.confirm({
        centered: true,
        title: '提示',
        content: (
          <div>
            <p>活动删除后，活动统计中将无法查到该活动素材的相关数据。</p>
            <p style={{ fontSize: 16 }}>确定删除吗？</p>
          </div>
        ),
        onOk: () =>
          http
            .post('material/delete', {
              ids: selectedRows.map((record: any) => record.id),
            })
            .then((res: IResponse) => {
              message.destroy()
              if (res.success) {
                message.success('删除成功')
                table.onFetch()
              } else {
                message.success(res.msg)
              }
            }),
      })
    } else {
      message.destroy()
      message.warning('请选择已过期或已下架状态的记录')
      return false
    }
  }

  const schema = getSchema()
  const columns = getColumns()
  const actionMap = {
    63: handleAdd, // 新增
    64: handleEdit, // 修改
    65: handlePreview, // 预览
    67: handleDetail, // 查看
    68: handleCopy, // 复制
    69: () => handleStatus(1), // 上架
    70: () => handleStatus(0), // 下架
    71: handleDelete, // 删除
  }

  return (
    <Layout>
      <Content wrapperClassName="activity-material">
        <Search schema={schema} onSearch={handleSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 'max-content' }} />
      </Content>
    </Layout>
  )
}
