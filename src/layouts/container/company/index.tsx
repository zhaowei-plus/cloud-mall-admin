import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import http from '@/api'
import './index.less'

export default () => {
  const dispatch = useDispatch()
  // 查询地市
  const fetchRegion = () => {
    http.get('platform/region').then(res => {
      const { success, data = [] } = res
      if (success) {
        const regions = JSON.parse(
          JSON.stringify(data)
            .replace(/code/g, 'value')
            .replace(/name/g, 'label')
        )
        dispatch({
          type: 'SET_REGIONS',
          payload: regions,
        })
      }
    })
  }

  // 查询省份
  const fetchProvince = () => {
    http.get('platform/province').then(res => {
      const {
        data: { id },
      } = res
      dispatch({
        type: 'SET_PROVINCE',
        payload: id,
      })
    })
  }

  useEffect(() => {
    fetchRegion()
    fetchProvince()
  }, [])

  return (
    <div className="company">
      <i
        className="company__logo"
        style={{ backgroundImage: `url(${require(LOGO)})` }}
      />
      <span className="company__title">{TITLE}</span>
    </div>
  )
}
