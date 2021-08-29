import React, { useState, useEffect } from 'react'
import { Tooltip } from 'antd'
import http from '@/api'
import './index.less'

type Item = {
  title: String
  data: Number
  subTitle: String
  subData: Number
}

export default props => {
  const { regionCode, url } = props
  const [items, setItems] = useState<Array<Item>>([])
  const fetchStatistic = (regionCode = '') => {
    http.get(url, { regionCode }).then(res => {
      setItems(res.data)
    })
  }

  useEffect(() => {
    fetchStatistic(regionCode)
  }, [regionCode])

  return (
    <div className="statistic">
      {items.map((item, index) => (
        <div className="item" key={index}>
          <div className="item__title">
            <Tooltip title={item.title}>{item.title}</Tooltip>
          </div>
          <div className="item__value">{item.data}</div>
          <div className="item__extra">
            {!!item.subTitle && `${item.subTitle}：`} {item.subData}
          </div>
        </div>
      ))}
    </div>
  )
}
