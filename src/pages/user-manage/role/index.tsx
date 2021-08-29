import React, { useEffect, useState } from 'react'
import { Modal, message } from 'antd'
import cookies from 'react-cookies'
import { Layout, Action, Search } from '@/components'
import { useVisible, useTable } from '@/hooks'
import http from '@/api'

import { getSchema, getColumns } from './config'

import AddModal from './components/add-modal'
import MenuPermConfigModal from './components/menu-perm-config-modal'
import { IResponse } from '@/assets/constant'

import './index.less'
import { useSelector } from 'react-redux'

const { Content } = Layout

export default () => {
  const addModal = useVisible()
  const menuPermConfigModal = useVisible()
  const resourceId = cookies.load('resourceId')
  const { table, XmTable } = useTable('role/list')
  const [accountTypes, setAccountTypes] = useState([])
  const { selectedRows } = table.params

  // 查询账号类别
  const fetchAccountTypes = () => {
    http.get('user/accountTypes', { resourceId }).then(res => {
      const { success, data } = res
      if (success) {
        setAccountTypes(
          data.map((d: any) => ({
            label: d.name,
            value: d.id,
            roleType: d.inherentBiz,
          }))
        )
      }
    })
  }

  const handleAdd = () => {
    addModal.open({
      resourceId,
      accountTypes,
    })
  }

  const handleEdit = () => {
    message.destroy()

    if (selectedRows.length === 0) {
      message.warn('请选择修改的角色信息')
      return false
    }
    if (selectedRows.length > 1) {
      message.warn('请单选角色记录')
      return false
    }
    addModal.open({
      detail: selectedRows[0],
      resourceId,
      accountTypes,
    })
  }

  // 启用/停用
  const handleStatus = (nextStatus: string) => {
    const StatusMap = {
      On: '启用',
      Off: '停用',
    }

    message.destroy()

    const isAllOn = selectedRows.every((record: any) => record.status === 1)
    const isAllOff = selectedRows.every((record: any) => record.status === 0)

    if (nextStatus === 'On') {
      if (selectedRows.length === 0 || !isAllOff) {
        message.warn('请选择停用状态的角色')
        return false
      }
    }

    if (nextStatus === 'Off') {
      if (selectedRows.length === 0 || !isAllOn) {
        message.warn('请选择启用状态的角色')
        return false
      }
    }

    Modal.confirm({
      centered: true,
      title: '提示',
      content: `确定${StatusMap[nextStatus]}角色吗？`,
      onOk: () =>
        http
          .post(`role/role${nextStatus}`, {
            idList: selectedRows.map((record: any) => record.id),
          })
          .then((res: IResponse) => {
            if (res.success) {
              message.success(`${StatusMap[nextStatus]}成功`)
              table.onFetch()
            }
          }),
    })
  }

  const handleRoleMenu = () => {
    message.destroy()

    if (selectedRows.length === 0) {
      message.warn('请单选角色信息')
      return false
    }
    if (selectedRows.length > 1) {
      message.warn('请选择单个角色')
      return false
    }
    menuPermConfigModal.open(selectedRows[0])
  }

  useEffect(() => {
    fetchAccountTypes()
  }, [])

  const actionMap = {
    21: handleAdd, // 新增
    22: handleEdit, // 修改
    23: () => handleStatus('On'), // 启用
    24: () => handleStatus('Off'), // 停用
    25: handleRoleMenu, // 菜单权限
  }

  const schema = getSchema(accountTypes)
  const columns = getColumns()

  return (
    <Layout>
      <Content wrapperClassName="user">
        <Search schema={schema} onSearch={table.onSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} />
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
        {menuPermConfigModal.visible && (
          <MenuPermConfigModal
            params={menuPermConfigModal.params}
            onCancel={menuPermConfigModal.close}
            onOk={() => {
              menuPermConfigModal.close()
              table.onFetch()
            }}
          />
        )}
      </Content>
    </Layout>
  )
}
