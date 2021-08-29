import React from 'react'
import PushConfig from '../components/push-config'

export default props => {
  const {
    match: {
      params: { id },
    },
  } = props
  return <PushConfig isAdd id={id} title="新增推送" />
}
