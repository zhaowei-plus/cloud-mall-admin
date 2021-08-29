import React from 'react'
import { Image } from '@/components'
import { MODULE_TYPE, ACTION } from '../../constant'
import './index.less'

interface IProps {
  addMode: Function
}

export default (props: IProps) => {
  const { addMode } = props

  const defaultModes = [
    {
      title: 'banner样式',
      src: require('@/assets/image/featured/banner.png'),
      params: { type: ACTION.ADD, moduleType: MODULE_TYPE.BANNER },
    },
    {
      title: '单行单商品样式',
      src: require('@/assets/image/featured/commodity.png'),
      params: { type: ACTION.ADD, moduleType: MODULE_TYPE.COMMODITY },
    },
    {
      title: '单行双商品样式',
      src: require('@/assets/image/featured/commodity-2.png'),
      params: { type: ACTION.ADD, moduleType: MODULE_TYPE.COMMODITY_2 },
    },
    {
      title: '单行四商品样式',
      src: require('@/assets/image/featured/commodity-4.png'),
      params: { type: ACTION.ADD, moduleType: MODULE_TYPE.COMMODITY_4 },
    },
  ]

  return (
    <div className="mode-config">
      {defaultModes.map((mode, index) => (
        <div className="mode" key={index}>
          <div className="mode__header">{mode.title}</div>
          <div className="mode__content">
            <Image src={mode.src} />
          </div>
          <div className="mode__footer">
            <a onClick={() => addMode(mode.params)}>添加</a>
          </div>
        </div>
      ))}
    </div>
  )
}
