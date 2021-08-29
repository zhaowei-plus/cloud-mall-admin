import React from 'react'

import EditCommodity from '../components/edit-commodity'

export default props => {
  const {
    match: { params },
  } = props
  return <EditCommodity isDetail={true} title="商品详情" params={params} />
}
