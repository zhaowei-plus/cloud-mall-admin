import React, { useState, useEffect } from 'react'
import { Empty, Tooltip } from 'antd'
import http from '@/api'
import './index.less'

export default () => {
  const [dataSource, setDataSource] = useState([])

  const fetchData = () => {
    http.get('dataCenter/activity/cards').then(res => {
      const { success, data } = res
      if (success) {
        setDataSource(data)
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="activity-card">
      <div className="activity-card__title">活动数据</div>
      {dataSource.length > 0 ? (
        <div className="activity-card__content">
          {dataSource.map(card => (
            <div className="card" key={card.id}>
              <Tooltip title={card.prizeName}>
                <div className="card__title">{card.prizeName}</div>
              </Tooltip>
              <div className="card__info">
                <div className="item">余量 {card.remainStock}</div>
                <div className="item">消耗 {card.consuStock}</div>
                <div className="item">总量 {card.totalStock}</div>
              </div>
              <div className="card__footer">昨日消耗 {card.yesterConsu}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="activity-card__empty">
          <Empty description="暂无数据" />
        </div>
      )}
    </div>
  )
}
