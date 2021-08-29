import React, { useState, useEffect, ReactNode, useCallback } from 'react'
import { Table } from 'antd'
import cookies from 'react-cookies'
import useList from './use-list'

interface IProps {
  type?: string
  rowKey?: string
  columns: Array<any>
  rowSelection?: boolean
  actions?: (params: any) => ReactNode
  [key: string]: any
}

export default (
  url: string,
  initialParams = {},
  staticParams = {},
  requestNow = true
) => {
  const resourceId = cookies.load('resourceId')
  const list = useList(url, initialParams, {
    ...staticParams,
    resourceId,
  })
  const [selectedRows, setSelectedRows] = useState([])

  const XmTable = useCallback(
    (props: any) => {
      const {
        serial = true,
        rowSelection = true,
        columns,
        renderCell,
        getCheckboxProps,
        ...rest
      } = props
      let backupColumns = columns
      if (columns.length > 0 && serial) {
        backupColumns = [
          {
            title: '序号',
            key: 'serial',
            width: 80,
            render: (text, record, index) => index + 1,
          },
        ].concat(columns)
      }

      // 支持选择的表格，默认是checkbox
      if (rowSelection) {
        const { type = 'checkbox' } = props
        return (
          <Table
            rowSelection={{
              type,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRows(selectedRows)
              },
              selectedRowKeys: selectedRows.map(
                item => item.id || item.materialId
              ),
              renderCell,
              getCheckboxProps,
            }}
            rowKey="id"
            columns={backupColumns}
            onChange={list.onChange}
            dataSource={list.dataSource}
            pagination={list.pagination}
            {...rest}
          />
        )
      }

      return (
        <Table
          rowKey="id"
          columns={backupColumns}
          onChange={list.onChange}
          dataSource={list.dataSource}
          pagination={list.pagination}
          {...rest}
        />
      )
    },
    [list.dataSource, list.pagination, selectedRows]
  )

  const onFetch = () => {
    setSelectedRows([])
    list.onFetch()
  }

  const onSearch = (params?: any) => {
    setSelectedRows([])
    list.onSearch(params)
  }

  useEffect(() => {
    const selectRowKeys = selectedRows.map((item: any) => item.id)
    setSelectedRows(
      list.dataSource.filter((item: any) => selectRowKeys.includes(item.id))
    )
  }, [list.dataSource])

  useEffect(() => {
    requestNow && onFetch()
  }, [])

  return {
    table: {
      ...list,
      params: {
        ...list.params,
        selectedRows,
      },
      onFetch,
      onSearch,
    },
    XmTable,
  }
}
