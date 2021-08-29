import React from 'react'

import Material from '../component/material'

export default props => {
  const {
    match: {
      params: { itemId },
    },
  } = props

  return <Material isDetail id={itemId} title="素材详情" />
}
