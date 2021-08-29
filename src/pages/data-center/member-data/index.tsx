import React, { useState, useEffect, useMemo } from 'react'
import { DatePicker, Cascader, Radio, message } from 'antd'
import cookies from 'react-cookies'
import moment from 'moment'
import { CaretDownOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import http from '@/api'
import { Layout, Statistics, ViewChart } from '@/components'
import {
  formatRegionPath,
  formatRegionName,
  formatRegions,
} from '@/assets/utils'
import { IResponse } from '@/assets/constant'
import './index.less'

const { Content } = Layout
const { RangePicker } = DatePicker

type Item = {
  code: String | Number
  name: String
}

export default () => {
  const [regionCode, setRegionCode] = useState(cookies.load('regionCode'))
  const [range, setRange] = useState([
    moment()
      .subtract(8, 'day')
      .format('YYYY-MM-DD'),
    moment()
      .subtract(1, 'day')
      .format('YYYY-MM-DD'),
  ])
  const [measureKey, setMeasureKey] = useState<any>()
  const [measureKeys, setMeasureKeys] = useState<Array<Item>>([])
  const [regions, setRegions] = useState<Array<any>>([])

  const fetchRegion = () => {
    http.get('role/region').then((res: IResponse) => {
      const { success, data = [] } = res
      if (success) {
        setRegions(
          JSON.parse(
            JSON.stringify(data)
              .replace(/code/g, 'value')
              .replace(/name/g, 'label')
          )
        )
      }
    })
  }
  const fetchCategories = () => {
    http.get('dataCenter/member/categories', { regionCode }).then(res => {
      const [first] = res.data
      setMeasureKeys(res.data)
      setMeasureKey(first.code)
    })
  }

  const handleMeasureKeysChange = e => {
    setMeasureKey(e.target.value)
  }

  const handleCityChange = codes => {
    if (codes) {
      setRegionCode(codes[codes.length - 1])
    }
  }

  const handleRangeChange = (dates, dateStrings) => {
    if (dates.length === 2) {
      const [start, end] = dates
      if (end.diff(start, 'year') > 0) {
        message.warn('时间范围不能超过1年，请重新选择')
        return false
      }
    }
    setRange(dateStrings)
  }

  useEffect(() => {
    fetchRegion()
    fetchCategories()
  }, [])

  const measure = useMemo(() => {
    return measureKeys.find(item => item.code === measureKey)
  }, [measureKeys, measureKey])

  return (
    <Layout>
      <Content wrapperClassName="member-data">
        <div className="info">
          <label className="info__title">成员数据</label>
          <div className="info__city">
            {!isNaN(regionCode) && (
              <Cascader
                changeOnSelect
                placeholder="请选择"
                style={{ width: 200 }}
                onChange={handleCityChange}
                value={formatRegionPath(regionCode)}
                options={formatRegions(3, regions)}
              >
                <a>
                  <span style={{ marginRight: 4 }}>
                    {formatRegionName(regionCode)}
                  </span>
                  <CaretDownOutlined />
                </a>
              </Cascader>
            )}
          </div>
        </div>
        <Statistics
          regionCode={regionCode}
          url="dataCenter/member/statistics"
        />
        <div className="view">
          <div className="view__header">
            <RangePicker
              getPopupContainer={(node: any) => node.parentNode}
              allowClear={false}
              disabledDate={currentDate =>
                currentDate > moment().subtract(1, 'day')
              }
              defaultValue={[
                moment().subtract(8, 'day'),
                moment().subtract(1, 'day'),
              ]}
              onChange={handleRangeChange}
            />
          </div>
          <div className="view__content">
            <div className="categories">
              <Radio.Group
                value={measureKey}
                onChange={handleMeasureKeysChange}
              >
                {measureKeys.map((item, index) => (
                  <Radio.Button key={index} value={item.code}>
                    {item.name}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
            <ViewChart
              range={range}
              key={measureKey}
              measure={measure}
              measureKey={measureKey}
              regionCode={regionCode}
              exportDataType={20021}
              url="dataCenter/member/info"
              listUrl="dataCenter/member/list"
              exportUrl="/cmmc-report/report-ops/cmmc/member/stat/trend_detail_export"
            />
          </div>
        </div>
      </Content>
    </Layout>
  )
}
