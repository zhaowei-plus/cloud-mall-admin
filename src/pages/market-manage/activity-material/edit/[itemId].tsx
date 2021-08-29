import React from 'react'

import Material from '../component/material'

export default props => {
  const {
    match: {
      params: { itemId },
    },
  } = props

  return <Material isEdit id={itemId} title="编辑素材" />
}
