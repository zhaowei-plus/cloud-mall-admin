import { createFormActions, FormEffectHooks } from '@formily/antd'
import http from '@/api'

const {
  onFormInit$,
  onFieldValueChange$,
  onFieldInputChange$,
} = FormEffectHooks

export default ({ resourceId, supply = {} }) => () => {
  const { setFieldState } = createFormActions()

  onFormInit$().subscribe(() => {
    setFieldState('supplyId', state => {
      state.editable = !supply.required
    })
  })

  onFieldInputChange$('accountTypeId').subscribe(({ value, props }) => {
    setFieldState('regionCodeList', state => {
      state.value = undefined
    })
  })
  onFieldValueChange$('accountTypeId').subscribe(({ value, props }) => {
    const accountType = props.enum.find(d => d.value === value)
    if (accountType) {
      const { roleType } = accountType
      const isCommodityPayee = roleType === 2 // 商品收款方
      const isAccountManager = roleType === 1 // 客户经理
      const isProvinceAdmin = roleType === 4 // 省级管理员
      const isCityAdmin = roleType === 5 // 市级管理员
      const isCountyAdmin = roleType === 6 // 区县管理员

      setFieldState('supplyId', state => {
        state.visible = isCommodityPayee
      })

      setFieldState('regionCodeList', state => {
        state.visible =
          isAccountManager || isProvinceAdmin || isCityAdmin || isCountyAdmin
        isAccountManager && (state.props['x-props'].level = 3) //  客户经理只需要选择到县一级
        state.props['x-props'].changeOnSelect = isAccountManager // 客户经理可以选择上级
        isProvinceAdmin && (state.props['x-props'].level = 2)
        isCityAdmin && (state.props['x-props'].level = 3)
        isCountyAdmin && (state.props['x-props'].level = 4)
      })
    }
  })

  onFieldInputChange$('accountTypeId').subscribe(({ value }) => {
    http
      .post('user/roleList', { resourceId, accountTypeId: value })
      .then(res => {
        const { success, data } = res
        if (success) {
          const { required, selectList = [] } = data
          let defaultValue = undefined
          if (required) {
            const defaultSelected = selectList.find(s => s.selected)
            if (defaultSelected) {
              defaultValue = defaultSelected.id
            }
          }

          const roleIdList = {
            required,
            dataSource: selectList.map(item => ({
              label: item.name,
              value: Number(item.id),
            })),
            default: defaultValue,
          }

          setFieldState('roleIdList', state => {
            state.value = undefined
            state.props.enum = roleIdList.dataSource
          })
        }
      })
  })
}
