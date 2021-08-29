import React, { useState, useEffect, useMemo } from 'react'
import { Modal, message } from 'antd'
import cookies from 'react-cookies'
import { Layout, Action, Search } from '@/components'
import { useVisible, useTable } from '@/hooks'
import { IResponse } from '@/assets/constant'
import http from '@/api'

import { getSchema, getColumns } from './config'

import './index.less'

import AddModal from './components/add-modal'

const { Content } = Layout

export default () => {
  const addModal = useVisible()

  const { table, XmTable } = useTable('user/list')
  const [supply, setSupply] = useState<any>({
    dataSource: [],
  })
  const [accountTypes, setAccountTypes] = useState([])
  const resourceId = cookies.load('resourceId')

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

  // 查询收款方公司
  const fetchSupplies = () => {
    http.get('user/supplies', { resourceId }).then((res: any) => {
      const { success, data } = res
      if (success) {
        const { required, selectList = [] } = data
        let defaultValue = undefined
        if (required) {
          const defaultSelected = selectList.find(s => s.selected)
          if (defaultSelected) {
            defaultValue = defaultSelected.id
          }
        }
        setSupply({
          required,
          dataSource: selectList.map(item => ({
            label: item.name,
            value: Number(item.id),
          })),
          default: defaultValue,
        })
      }
    })
  }

  const handleAdd = () => {
    // 查询供应商
    fetchSupplies()

    addModal.open({
      accountTypes,
      supply,
    })
  }

  const handleEdit = () => {
    message.destroy()
    if (selectedRows.length === 0) {
      message.warn('请选择修改的用户信息')
      return false
    }
    if (selectedRows.length > 1) {
      message.warn('请单选用户记录')
      return false
    }

    // 查询供应商
    fetchSupplies()

    addModal.open({
      id: selectedRows[0].id,
      accountTypes,
      supply,
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
        message.warn('请选择停用状态的账号')
        return false
      }
    }

    if (nextStatus === 'Off') {
      if (selectedRows.length === 0 || !isAllOn) {
        message.warn('请选择启用状态的账号')
        return false
      }
    }

    Modal.confirm({
      centered: true,
      title: '提示',
      content: `确定${StatusMap[nextStatus]}用户账号吗？`,
      onOk: () =>
        http
          .post(`user/user${nextStatus}`, {
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

  const handleResetPassword = () => {
    if (selectedRows.length === 0) {
      message.destroy()
      message.warn('请选择密码重置的用户账号')
      return false
    }

    Modal.confirm({
      centered: true,
      title: '提示',
      content: '确定密码重置用户账号吗？',
      onOk: () =>
        http
          .post('user/resetPwd', {
            idList: selectedRows.map((record: any) => record.id),
          })
          .then((res: IResponse) => {
            if (res.success) {
              message.success('密码重置成功')
            }
          }),
    })
  }

  const handleSearch = (params: any = {}) => {
    const { createStartTime, createEndTime, ...rest } = params
    if (createStartTime && createEndTime) {
      rest.createStartTime = `${createStartTime} 00:00:00`
      rest.createEndTime = `${createEndTime} 23:59:59`
    }
    table.onSearch(rest)
  }

  const renderCell = (checked, record, index, originNode) => {
    // 超级管理员角色 + 超管类别账号
    const { roleNames = '', inherentBiz } = record
    const unSelected =
      roleNames.indexOf('超管') > -1 && [0].includes(inherentBiz)
    if (!unSelected) {
      return originNode
    }
    return null
  }

  const getCheckboxProps = record => {
    const { roleNames = '', inherentBiz } = record
    const unSelected =
      roleNames.indexOf('超管') > -1 && [0].includes(inherentBiz)

    return {
      disabled: unSelected,
    }
  }

  useEffect(() => {
    fetchSupplies()
    fetchAccountTypes()
  }, [])

  const actionMap = {
    15: handleAdd, // 新增
    16: handleEdit, // 修改
    17: () => handleStatus('On'), // 启用
    18: () => handleStatus('Off'), // 停用
    19: handleResetPassword, // 密码重置
  }

  const initialValues = useMemo(() => {
    if (supply.default) {
      return {
        supplyId: supply.default,
      }
    }
  }, [supply])

  const schema = getSchema(accountTypes, supply)
  const columns = getColumns(supply.dataSource)

  return (
    <Layout>
      <Content wrapperClassName="user">
        <Search
          schema={schema}
          onSearch={handleSearch}
          initialValues={initialValues}
        />
        <Action actionMap={actionMap} />
        <XmTable
          columns={columns}
          renderCell={renderCell}
          getCheckboxProps={getCheckboxProps}
          scroll={{ x: 'max-content' }}
        />
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
      </Content>
    </Layout>
  )
}
