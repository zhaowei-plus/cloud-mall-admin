import React from 'react'
import { useParams } from 'umi'

import EditCommodity from '../components/edit-commodity'

export default () => {
  const { params } = useParams()
  return (
    <EditCommodity
      isAdd={true}
      title="新增商品"
      params={JSON.parse(window.atob(params))}
    />
  )
}
