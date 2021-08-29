import React from 'react'
import PushConfig from '../components/push-config'

export default props => {
  const {
    match: {
      params: { itemId },
    },
  } = props

  return <PushConfig isDetail id={itemId} title="查看推送" />
}
