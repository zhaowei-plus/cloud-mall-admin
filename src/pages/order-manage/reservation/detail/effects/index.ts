import { createFormActions, FormEffectHooks } from '@formily/antd'

const { onFieldValueChange$ } = FormEffectHooks

export default () => {
  const { setFieldState } = createFormActions()

  onFieldValueChange$('priceType').subscribe(({ value }) => {
    setFieldState('originalPrice', state => {
      state.visible = value === 1
    })
    setFieldState('customPriceDesc', state => {
      state.visible = value === 2
    })
  })
}
