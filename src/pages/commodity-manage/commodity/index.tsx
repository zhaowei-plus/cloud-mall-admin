import React, { useEffect, useState } from 'react'
import { Modal, message } from 'antd'
import { history } from 'umi'
import cookies from 'react-cookies'
import { Layout, Action, Search } from '@/components'
import { useVisible, useTable } from '@/hooks'
import http from '@/api'

import { IResponse } from '@/assets/constant'

import { getSchema, getColumns } from './config'
import CommodityModal from './components/commodity-modal'

const { Content } = Layout

export default () => {
  const commodityModal = useVisible()
  const { table, XmTable } = useTable('commodity/list')
  const [categories, setCategories] = useState([])
  const resourceId = cookies.load('resourceId')
  const { selectedRows } = table.params

  const fetchCategories = () => {
    http.get('category/list', { pageEnable: false, resourceId }).then(res => {
      const { success, data } = res
      if (success) {
        setCategories(
          [{ label: '空', value: -1 }].concat(
            data.rows.map(d => ({ label: d.name, value: d.id }))
          )
        )
      }
    })
  }

  const handleAdd = () => {
    commodityModal.open({
      url: `/commodity-manage/commodity/add`,
    })
  }

  const handleDetail = () => {
    message.destroy()

    if (selectedRows.length === 0) {
      message.warn('请选择查看的商品信息')
      return false
    }
    if (selectedRows.length > 1) {
      message.warn('请单选商品信息')
      return false
    }

    history.push(`/commodity-manage/commodity/detail/${selectedRows[0].id}`)
  }

  const handleEdit = () => {
    message.destroy()

    if (selectedRows.length === 0) {
      message.warn('请选择修改的商品信息')
      return false
    }
    if (selectedRows.length > 1) {
      message.warn('请单选商品信息')
      return false
    }

    commodityModal.open({
      url: `/commodity-manage/commodity/edit`,
      itemId: selectedRows[0].id,
    })

    // history.push(`/commodity-manage/commodity/edit/${selectedRows[0].id}`)
  }

  const setStatus = (url, status) => {
    http
      .post(`commodity/${url}`, {
        itemList: selectedRows.map((record: any) => record.id),
        status,
      })
      .then((res: IResponse) => {
        if (res.success) {
          message.success('操作成功')
          table.onFetch()
        }
      })
  }

  // 上架/下架
  const handlePublish = async (url, nextStatus: number) => {
    const StatusMap = {
      1: '上架',
      0: '下架',
    }

    message.destroy()

    if (selectedRows.length === 0) {
      message.warn(`请选择待${StatusMap[nextStatus]}的商品`)
      return false
    }

    // 是否可以上架：已下架(0)、待上架(2)状态
    const canOnline = selectedRows.every((record: any) =>
      [0, 2].includes(record.status)
    )

    // 是否可下架：已上架(1)状态
    const canOffline = selectedRows.every((record: any) =>
      [1].includes(record.status)
    )

    // 上架
    if (nextStatus === 1 && !canOnline) {
      message.warn('请选择待上架的商品')
      return false
    }

    // 下架
    if (nextStatus === 0) {
      if (!canOffline) {
        message.warn('请选择已上架的商品')
        return false
      } else {
        http
          .get('commodity/check', {
            itemIdList: selectedRows.map((record: any) => record.id).join(','),
          })
          .then(res => {
            if (res.data) {
              Modal.confirm({
                centered: true,
                title: '提示',
                content: `商品已配置精选页面，若下架精选页内会自动移除。确定下架商品吗？`,
                onOk: () => setStatus(url, nextStatus),
              })
            } else {
              Modal.confirm({
                centered: true,
                title: '提示',
                content: `确定${StatusMap[nextStatus]}商品吗？`,
                onOk: () => setStatus(url, nextStatus),
              })
            }
          })
        return true
      }
    }

    Modal.confirm({
      centered: true,
      title: '提示',
      content: `确定${StatusMap[nextStatus]}商品吗？`,
      onOk: () => setStatus(url, nextStatus),
    })
  }

  const handleOk = params => {
    const { url, ...rest } = params
    history.push(`${url}/${window.btoa(JSON.stringify(rest))}`)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const actionMap = {
    33: handleAdd, // 新增
    34: handleDetail, // 查看
    35: handleEdit, // 修改
    36: () => handlePublish('online', 1), // 上架
    37: () => handlePublish('offline', 0), // 下架
  }

  const schema = getSchema(categories)
  const columns = getColumns()

  return (
    <Layout>
      <Content wrapperClassName="commodity">
        <Search schema={schema} onSearch={table.onSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 1200 }} />
      </Content>
      {commodityModal.visible && (
        <CommodityModal
          params={commodityModal.params}
          onCancel={commodityModal.close}
          onOk={handleOk}
        />
      )}
    </Layout>
  )
}
