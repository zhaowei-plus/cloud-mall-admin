import React, { useEffect } from 'react'
import { Table, Space, Button } from 'antd'
import querystring from 'querystring'
import { Search, VerifyCodeModal } from '@/components'
import { useList, useVisible } from '@/hooks'
import './index.less'

const schema = {
  prizeCode: {
    type: 'xm-string',
    title: '流量包编码',
  },
  prizeName: {
    type: 'xm-string',
    title: '流量包名称',
  },
  activityId: {
    type: 'xm-string',
    title: '活动编码',
  },
  activityName: {
    type: 'xm-string',
    title: '活动名称',
  },
  sendTime: {
    type: 'daterange',
    title: '发放时间范围',
  },
}

const columns = [
  {
    title: '流量包编码',
    dataIndex: 'prizeCode',
  },
  {
    title: '流量包名称',
    dataIndex: 'prizeName',
  },
  {
    title: '活动编码',
    dataIndex: 'activityId',
  },
  {
    title: '活动名称',
    dataIndex: 'activityName',
  },
  {
    title: '发放时间',
    dataIndex: 'sendTime',
  },
]

export default () => {
  const list = useList('dataCenter/activity/list')
  const verifyCodeModal = useVisible()

  const handleSearch = params => {
    const { sendTime = [], ...rest } = params
    if (sendTime.length > 0) {
      rest.startSendTime = `${sendTime[0]} 00:00:00`
      rest.endSendTime = `${sendTime[1]} 23:59:59`
    }
    list.onSearch(rest)
  }

  const handleExport = () => {
    verifyCodeModal.open(list.params)
  }

  const handleOk = params => {
    return Promise.resolve(
      (window.location.href = `/cmmc-report/report-ops/cmmc/member/stat/activity_detail_export?${querystring.stringify(
        params
      )}`)
    )
  }

  useEffect(() => {
    list.onSearch()
  }, [])

  return (
    <div className="activity-list">
      <div className="activity-list__title">活动明细</div>
      <div className="activity-list__content">
        <Search schema={schema} onSearch={handleSearch} />
        <Space className="actions">
          <Button danger type="primary" onClick={handleExport}>
            导出
          </Button>
        </Space>
        <Table
          rowKey="id"
          columns={columns}
          onChange={list.onChange}
          dataSource={list.dataSource}
          pagination={list.pagination}
        />
        {verifyCodeModal.visible && (
          <VerifyCodeModal
            onOk={handleOk}
            exportDataType="20020"
            params={verifyCodeModal.params}
            onCancel={verifyCodeModal.close}
          />
        )}
      </div>
    </div>
  )
}
