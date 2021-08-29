import React, { useState, useEffect, useMemo } from 'react'
import { Radio, Table } from 'antd'
import ECharts from 'echarts-for-react'
import querystring from 'querystring'
import http from '@/api'
import { useList, useVisible } from '@/hooks'
import { formatEChartOption } from '@/assets/utils'
import VerifyCodeModal from '../verify-code-modal'
import './index.less'

const RANGE_TYPES = [
  { label: '日', value: 0 },
  { label: '周', value: 1 },
  { label: '月', value: 2 },
]

const TAG_TYPES = [
  { label: '新增', value: 0 },
  { label: '总', value: 1 },
]

export default props => {
  const {
    measureKey,
    regionCode,
    range,
    url,
    listUrl,
    exportUrl,
    exportDataType,
    measure = {},
  } = props
  const list = useList(listUrl)
  const verifyCodeModal = useVisible()
  const [type, setType] = useState(0)
  const [rangeType, setRangeType] = useState(0)
  const [option, setOption] = useState<any>(formatEChartOption())

  const fetchInfo = () => {
    const params: any = {
      rangeType,
      measureKey,
      type,
    }
    if (regionCode) {
      params.regionCode = regionCode
    }
    if (range) {
      const [beginTime, endTime] = range
      params.beginTime = beginTime
      params.endTime = endTime
    }

    http.get(url, params).then((res: any) => {
      const { range, value } = res.data
      setOption(formatEChartOption(range, value))
    })
  }

  const handleRangeTypeChange = e => {
    setRangeType(e.target.value)
  }

  const handleModeChange = e => {
    setType(e.target.value)
  }

  const handleExport = () => {
    const exportParams: any = {
      rangeType,
      type,
      measureKey,
    }
    if (regionCode) {
      exportParams.regionCode = regionCode
    }
    if (range) {
      const [beginTime, endTime] = range
      exportParams.beginTime = beginTime
      exportParams.endTime = endTime
    }
    verifyCodeModal.open(exportParams)
  }

  const handleOk = params => {
    verifyCodeModal.close()
    return Promise.resolve(
      (window.location.href = `${exportUrl}?${querystring.stringify(params)}`)
    )
  }

  useEffect(() => {
    fetchInfo()

    const params: any = {
      rangeType,
      measureKey,
      type,
    }
    if (regionCode) {
      params.regionCode = regionCode
    }
    if (range) {
      const [beginTime, endTime] = range
      params.beginTime = beginTime
      params.endTime = endTime
    }
    list.onSearch(params)
  }, [measureKey, range, regionCode, rangeType, type])

  const columns = useMemo(() => {
    const tagOption = TAG_TYPES.find(item => item.value === type)
    return [
      {
        title: '日期',
        dataIndex: 'rangeName',
      },
      {
        title: `${tagOption.label}${measure.name}`,
        dataIndex: 'value',
      },
    ]
  }, [type, measure])
  return (
    <div className="view-chart">
      <div className="view-chart__header">
        <Radio.Group key="mode" value={type} onChange={handleModeChange}>
          {TAG_TYPES.map(item => (
            <Radio.Button key={item.value} value={item.value}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
        <Radio.Group
          key="rangeType"
          value={rangeType}
          onChange={handleRangeTypeChange}
        >
          {RANGE_TYPES.map(item => (
            <Radio.Button key={item.value} value={item.value}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <div className="view-chart__content">
        <div className="view-echarts">
          {option && <ECharts option={option} />}
        </div>
        <div className="view-table">
          <div className="view-table__export">
            <a onClick={handleExport}>导出</a>
          </div>
          <div className="view-table__list">
            <Table
              columns={columns}
              onChange={list.onChange}
              dataSource={list.dataSource}
              pagination={list.pagination}
            />
          </div>
        </div>
      </div>
      {verifyCodeModal.visible && (
        <VerifyCodeModal
          url={exportUrl}
          onOk={handleOk}
          exportDataType={exportDataType}
          params={verifyCodeModal.params}
          onCancel={verifyCodeModal.close}
        />
      )}
    </div>
  )
}
