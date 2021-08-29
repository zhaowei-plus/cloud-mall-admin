import React from 'react'

import Material from '../component/material'

export default props => {
  const {
    location: {
      query: { id },
    },
  } = props

  return <Material isAdd id={id} title="新增素材" />
}
