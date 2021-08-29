import React from 'react'
import { useParams } from 'umi'

import EditCommodity from '../components/edit-commodity'

export default props => {
  const { params } = useParams()
  return (
    <EditCommodity
      isEdit={true}
      title="编辑商品"
      params={JSON.parse(window.atob(params))}
    />
  )
}
