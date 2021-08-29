import { useState, useEffect, useCallback } from 'react'

/**
 * useFetch 封装的请求hook，用于添加loading，优化交互
 * @param {function} fetchFunction 请求数据的方法，内部处理请求返回的数据和异常提示信息
 * @param {object} staticParams 静态参数
 * @param {boolean} isExecute 是否立即请求
 *
 * @return
 * loading 请求loading
 * onFetch 再次请求，参数默认为入口的参数
 */
export default (
  fetchFunction: (params?: any) => any,
  staticParams = {},
  isExecute = false
) => {
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState()

  const onFetch = useCallback(async (params = {}) => {
    setLoading(true)

    try {
      await fetchFunction({
        ...params,
        ...staticParams,
      })
    } catch (error) {
      console.error('onFetch error:', error)
    } finally {
      setParams({
        ...params,
        ...staticParams,
      })
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    isExecute && fetchFunction()
  }, [])

  return {
    loading,
    params,
    onFetch,
  }
}
