import { createFormActions, FormEffectHooks } from '@formily/antd'

const { onFieldValueChange$ } = FormEffectHooks

export default () => {
  const { setFieldState } = createFormActions()
  onFieldValueChange$('status').subscribe(({ value }) => {
    if (!isNaN(value)) {
      setFieldState('configFields', state => {
        state.visible = value === 1
      })
    }
  })
}
