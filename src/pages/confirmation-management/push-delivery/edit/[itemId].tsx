import React from 'react'
import PushConfig from '../components/push-config'

export default props => {
  const {
    match: {
      params: { itemId },
    },
  } = props

  return <PushConfig isEdit id={itemId} title="编辑推送" />
}
