import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import querystring from 'querystring'

import './index.less'

/**
 * 手机预览弹窗框
 *  @param {object} props
 *  @prop {string}  title 预览标题，有则展示，没有不展示
 *  @prop {ReactNode} children 显示内容：iframe gif sms
 *  @prop {function} onCancel 关闭时调用的方法，卸载相关节点
 * */
const PhoneModal = props => {
  const { title, children, onCancel, style } = props
  const [node, setNode] = useState(document.createElement('div'))

  useEffect(() => {
    const domNode = document.createElement('div')
    document.body.appendChild(domNode)
    setNode(domNode)

    // 配置支持esc退出
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.removeChild(domNode)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      onCancel()
    }
  }

  if (node) {
    return ReactDOM.createPortal(
      <div className="phone-preview">
        <div className="phone" style={style}>
          <i className="icon icon-close" onClick={onCancel} />
          {title && <div className="phone__title">{title}</div>}
          <div className="phone__content">{children}</div>
        </div>
      </div>,
      node
    )
  }
}

/**
 * 手机预览调用方式：目前只支持iframe，gif，sms(短信内容)
 * */
const Preview = {
  /**
   * 兼容历史数据，添加 onClose 参数
   * */
  preview: (info, title, onClose = null, type = 'gif') => {
    const node = document.createElement('div')

    const onDestroy = () => {
      ReactDOM.unmountComponentAtNode(node)
      onClose && onClose()
    }

    const style = {
      height: 'calc(100% - 32px)',
      maxHeight: 644,
    }

    if (type === 'gif') {
      style.maxHeight = 596
    }

    return ReactDOM.render(
      <PhoneModal title={title} style={style} onCancel={onDestroy}>
        {type === 'gif' && <img src={info} alt={title} />}
        {type === 'url' && <iframe src={info} />}
      </PhoneModal>,
      node
    )
  },
  iframe: (url, title = '', params = {}, onClose = null) => {
    Preview.preview(
      `${url}?${querystring.stringify({ ...params, platform: 1 })}`,
      title,
      onClose,
      'url'
    )
  },
  gif: (url, title = '', onClose = null) => {
    Preview.preview(url, title, onClose, 'gif')
  },
}

export default Preview
