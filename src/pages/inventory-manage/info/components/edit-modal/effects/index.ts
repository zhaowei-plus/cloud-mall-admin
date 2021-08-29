import { createFormActions, FormEffectHooks } from '@formily/antd'

const { onFieldValueChange$ } = FormEffectHooks

export default () => {
  const { setFieldState } = createFormActions()

  // 可销售库存
  onFieldValueChange$('stockConfig.noLimit').subscribe(({ value = [] }) => {
    const noLimit = value.includes(-1)
    setFieldState('stockConfig.numDisabled', state => {
      state.visible = noLimit
    })
    setFieldState('stockConfig.num', state => {
      state.visible = !noLimit
    })
  })
}
