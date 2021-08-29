import { createFormActions, FormEffectHooks } from '@formily/antd'
import cookies from 'react-cookies'
import { USER, REGION_LEVEL } from '@/assets/constant'
const { onFormInit$ } = FormEffectHooks

export default () => {
  const user = cookies.load('user') || {}
  const { inherentBiz } = user
  const { setFieldState } = createFormActions()
  const isSpecialRole = [USER.SUPER_ADMIN, USER.XM_USER].includes(+inherentBiz) // 特殊用户：超管、讯盟用户
  const isProvinceAdmin = USER.PROVINCE_ADMIN === +inherentBiz // 省级管理员
  const isCityAdmin = USER.CITY_ADMIN === +inherentBiz // 市级管理员
  const isCountyAdmin = USER.COUNTRY_ADMIN === +inherentBiz // 区县管理员

  onFormInit$().subscribe(() => {
    setFieldState('regionCode', state => {
      // 特殊用户、省级管理员 ，可以选择任何区域
      if (isSpecialRole && isProvinceAdmin) {
        state.props['x-props'].level = REGION_LEVEL.COUNTRY
      }
      isCityAdmin && (state.props['x-props'].level = REGION_LEVEL.CITY)
      isCountyAdmin && (state.props['x-props'].level = REGION_LEVEL.COUNTRY)
    })
  })
}
