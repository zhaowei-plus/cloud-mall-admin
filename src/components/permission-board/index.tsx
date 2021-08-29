import React, { Fragment, useState, useEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Space, Button, Empty, message } from 'antd'
import { cloneDeep, isEqual } from 'lodash'
import http from '@/api'
import { Layout } from '@/components'
import PermissionItem from './permission-item'
import './index.less'

const { Content } = Layout

export default () => {
  const [operation, setOperation] = useState<String>()
  const [dataSource, setDataSource] = useState([])
  const [cacheDataSource, setCacheDataSource] = useState([])
  const [cacheEditDataSource, setCacheEditDataSource] = useState([])
  const [accountTypes, setAccountTypes] = useState([])

  const setSortBoard = tabIdList => {
    return http.post('dataPerm/sort', { tabIdList }).then(res => {
      if (res.success) {
        message.destroy()
        message.success('排序成功')
      }
    })
  }

  const setEditBoard = tabAuthList => {
    return http.post('dataPerm/edit', { tabAuthList }).then(res => {
      if (res.success) {
        message.destroy()
        message.success('编辑成功')
      }
    })
  }

  const fetchList = () => {
    setDataSource([])
    setCacheDataSource([])
    setCacheEditDataSource([])
    return http.get('dataPerm/list').then(res => {
      const { success, data } = res
      if (success) {
        setDataSource(data)
        setCacheDataSource(data)
      }
    })
  }

  // 查询账号类别
  const fetchAccountTypes = () => {
    return http.get('user/accountTypes').then(res => {
      const { success, data } = res
      if (success) {
        setAccountTypes(
          data.map(d => ({
            label: d.name,
            value: d.id,
          }))
        )
      }
    })
  }

  const handleSave = () => {
    if (operation === 'edit' && cacheEditDataSource.length > 0) {
      setEditBoard(cacheEditDataSource)
    }
    if (operation === 'sort' && !isEqual(cacheDataSource, dataSource)) {
      setSortBoard(cacheDataSource.map(item => item.tabId))
    }
    setOperation('')
  }

  const handleCancel = () => {
    setOperation('')
    setCacheDataSource(dataSource)
    setCacheEditDataSource([])
  }

  const handleEdit = (index, item) => {
    if (isEqual(item, cacheDataSource[index])) {
      return false
    }
    const backupCacheDataSource = cloneDeep(cacheDataSource)
    backupCacheDataSource[index] = item
    setCacheDataSource(backupCacheDataSource)
    // 缓存修改的项
    setCacheEditDataSource([...cacheEditDataSource, item])
  }

  const handleSort = ({ addedIndex, removedIndex }) => {
    const backupCacheDataSource = cloneDeep(cacheDataSource)
    if (addedIndex !== removedIndex) {
      backupCacheDataSource[addedIndex] = cloneDeep(
        cacheDataSource[removedIndex]
      )
      backupCacheDataSource[removedIndex] = cloneDeep(
        cacheDataSource[addedIndex]
      )
      setCacheDataSource(backupCacheDataSource)
    }
  }

  useEffect(() => {
    fetchList()
    fetchAccountTypes()
  }, [])

  return (
    <Layout>
      <Content wrapperClassName="permission-board">
        {dataSource.length === 0 && (
          <div className="permission-board__empty">
            <Empty description="暂无数据" />
          </div>
        )}
        {dataSource.length > 0 && (
          <Fragment>
            <div className="permission-board__header">
              <span>权限看板</span>
              <span>可见角色</span>
              {operation ? (
                <Space>
                  <Button size="small" onClick={handleCancel}>
                    取消
                  </Button>
                  <Button size="small" onClick={handleSave}>
                    保存
                  </Button>
                </Space>
              ) : (
                <Space>
                  <Button size="small" onClick={() => setOperation('sort')}>
                    排序
                  </Button>
                  <Button size="small" onClick={() => setOperation('edit')}>
                    编辑
                  </Button>
                </Space>
              )}
            </div>
            <div className="permission-board__content">
              <Container
                onDrop={handleSort}
                orientation="vertical"
                dragHandleSelector=".permission-item__handler"
                dropPlaceholder={{
                  showOnTop: true,
                  animationDuration: 150,
                  className: 'permission-item__drop-preview',
                }}
              >
                {cacheDataSource.map((item, index) => (
                  <Draggable key={item.tabId}>
                    <PermissionItem
                      item={item}
                      onRefresh={fetchList}
                      accountTypes={accountTypes}
                      isEdit={operation === 'edit'}
                      isSort={operation === 'sort'}
                      onEdit={params => handleEdit(index, params)}
                    />
                  </Draggable>
                ))}
              </Container>
            </div>
          </Fragment>
        )}
      </Content>
    </Layout>
  )
}
