import React from 'react'

import './index.less'

export default () => {
  return (
    <div className="empty">
      <img
        src={require('@/assets/image/empty.png')}
        alt="暂无收款账户"
        className="empty__img"
      />
      <b style={{ fontSize: 18 }}>暂无收款账户</b>
      <div className="empty__info">
        请联系客服人员做配置，以便商品正常上架售卖。
        收款账户新增、更新或存在问题请直接反馈客服人员， 联系电话：0571-58110101
      </div>
    </div>
  )
}
