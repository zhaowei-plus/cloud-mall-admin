import React from 'react'
import cs from 'classnames'
import './index.less'

export default props => {
  const { isSelected, material = {}, onSelect } = props
  const {
    title,
    code,
    dataType,
    activityBeginTime,
    activityEndTime,
    forwardConfig = [],
  } = material

  const { imageUrl } = forwardConfig.find(item => item.imageType === 6) || {}

  const handleClick = () => {
    onSelect && onSelect(material)
  }

  const ACTIVITY_TYPES = {
    1: '集团活动',
    2: '市场活动',
  }

  return (
    <div
      className={cs('material', {
        selected: isSelected,
      })}
      onClick={handleClick}
    >
      <div className="material__img">
        <img src={imageUrl} alt={title} />
      </div>

      <div className="material__info">
        <span className="title">{title}</span>
        <div className="info-row">
          <span>活动编码：{code}</span>
          <span>活动类型：{ACTIVITY_TYPES[dataType]}</span>
        </div>
        <span>
          活动时间：{activityBeginTime} - {activityEndTime}
        </span>
      </div>

      {isSelected && (
        <div className="material__selected">
          <i className="tick" />
        </div>
      )}
    </div>
  )
}
