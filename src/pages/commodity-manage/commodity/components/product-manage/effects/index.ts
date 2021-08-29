import { createFormActions, FormEffectHooks } from '@formily/antd'

const { onFieldValueChange$ } = FormEffectHooks

export default () => {
  onFieldValueChange$('skuList').subscribe(({ value = [] }) => {})
}
