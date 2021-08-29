import React, { useEffect, useState } from 'react'
import { Button, Space } from 'antd'
import querystring from 'querystring'
import { Layout, Search, VerifyCodeModal } from '@/components'
import { useTable, useVisible } from '@/hooks'
import { getSchema, getColumns } from '../config'
const { Content } = Layout

export default props => {
  const { regionCodeList, regionCode } = props
  const verifyCodeModal = useVisible()
  const { table, XmTable } = useTable(
    'dataCenter/detail/cumulative/list',
    {},
    { regionCodeList }
  )
  const [params, setParams] = useState<any>(table.params)

  const handleSearch = (params = {}) => {
    setParams(params)
  }

  const handleExport = () => {
    const exportParams = params
    if (regionCode) {
      exportParams.regionCode = regionCode
    }
    if (regionCodeList) {
      exportParams.regionCodeList = regionCodeList
    }
    verifyCodeModal.open(exportParams)
  }

  const handleOk = params => {
    window.location.href = `/cmmc-report/report-ops/cmmc/org/stat/org_list_export?${querystring.stringify(
      params
    )}`
  }

  useEffect(() => {
    table.onSearch({
      ...params,
      regionCode,
      regionCodeList,
    })
  }, [regionCode, params])

  const schema = getSchema()
  const columns = getColumns()
  return (
    <Content style={{ padding: 0 }}>
      <Search schema={schema} onSearch={handleSearch} />
      <Space style={{ margin: 10 }}>
        <Button type="primary" onClick={handleExport}>
          导出
        </Button>
      </Space>
      <XmTable
        rowKey="orgId"
        serial={false}
        columns={columns}
        rowSelection={false}
        scroll={{ x: 'max-content' }}
      />
      {verifyCodeModal.visible && (
        <VerifyCodeModal
          onOk={handleOk}
          exportDataType="20023"
          url="dataCenter/verifyCode"
          params={verifyCodeModal.params}
          onCancel={verifyCodeModal.close}
        />
      )}
    </Content>
  )
}
