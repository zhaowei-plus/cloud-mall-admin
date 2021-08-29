import React from 'react'

import Push from '../component/push'
import useEffects from './effects'

export default props => {
  const {
    match: {
      params: { itemId },
    },
  } = props

  return <Push isDetail id={itemId} title="推送详情" useEffects={useEffects} />
}
