import React, { useState, useEffect } from 'react'
import { Modal, message, Tree, Spin, Empty } from 'antd'
import http from '@/api'
import { IResponse } from '@/assets/constant'
import { getCheckedKeys, getCheckedPaths } from '../utils'
import { useSelector } from 'react-redux'

interface IProps {
  onCancel: () => void
  onOk: () => void
  params: {
    [key: string]: any
  }
}

export default (props: IProps) => {
  const { params = {}, onCancel, onOk } = props
  const { id } = params
  const loading = useSelector(store => store.loading)
  const [menuConfig, setMenuConfig] = useState([])
  const [checkedKeys, setCheckedKeys] = useState([])

  const fetchMenu = (id: string | number) => {
    http.post('role/roleMenu', { id }).then(res => {
      if (res.success) {
        setMenuConfig(res.data)
        setCheckedKeys(getCheckedKeys(res.data))
      }
    })
  }

  useEffect(() => {
    id && fetchMenu(id)
  }, [id])

  const onCheck = checkedKeys => {
    setCheckedKeys(checkedKeys)
  }

  const handleOk = () => {
    const checkedPaths = getCheckedPaths(menuConfig, checkedKeys)
    const menuIdList = checkedKeys.concat(checkedPaths)
    http
      .post('role/saveRoleMenu', { id, menuIdList })
      .then((res: IResponse) => {
        if (res.success) {
          message.success('配置成功')
          onOk()
        }
      })
  }

  return (
    <Modal
      visible
      centered
      onCancel={onCancel}
      maskClosable={false}
      title="菜单权限配置"
      onOk={handleOk}
      wrapClassName="menu-perm-config-modal"
    >
      <Spin spinning={loading}>
        {menuConfig.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Tree
            checkable
            defaultExpandAll={true}
            checkedKeys={checkedKeys}
            onCheck={onCheck}
            treeData={menuConfig}
          />
        )}
      </Spin>
    </Modal>
  )
}
