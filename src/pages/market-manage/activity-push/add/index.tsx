import React from 'react'

import Push from '../component/push'

import useEffects from './effects'

export default () => {
  return <Push isAdd title="新增推送" useEffects={useEffects} />
}
