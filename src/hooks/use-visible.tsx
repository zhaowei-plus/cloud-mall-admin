import { useCallback, useState } from 'react'
/**
 * 自定义 HOOK：用于弹出框的打开与关闭空值
 *
 * @param {boolean} initVisible 初始化modal的显示状态
 */
export default (initVisible = false) => {
  const [params, setParams] = useState()
  const [visible, setVisible] = useState(initVisible)

  const open = useCallback((_params?: any) => {
    setParams(_params)
    setVisible(true)
  }, [])

  const close = useCallback(() => {
    setParams(undefined)
    setVisible(false)
  }, [])

  return {
    params,
    visible,
    open,
    close,
  }
}
