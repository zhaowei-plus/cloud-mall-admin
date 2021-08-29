import { createFormActions, FormEffectHooks } from '@formily/antd'
import http from '@/api'

const { onFieldValueChange$ } = FormEffectHooks

export default () => {
  const { setFieldState, getFieldValue, getFormState } = createFormActions()
  onFieldValueChange$('*(supplierId,buyType)').subscribe(() => {
    const { values = {}, editable } = getFormState()
    const { status, id: itemId } = values

    // 已上架
    if (status === 1 && editable) {
      const supplierId = getFieldValue('supplierId')
      const buyType = getFieldValue('buyType')

      if (supplierId && buyType) {
        const isOnline = buyType === 3 // 是否是线上预约（3）
        let errors = []
        if (!isOnline) {
          http
            .get('commodity/checkBuyType', { supplierId, buyType, itemId })
            .then(
              () => {
                errors = []
              },
              () => {
                errors = ['无可用的收款账号']
              }
            )
            .finally(() => {
              setFieldState('supplierId', state => {
                state.errors = errors
              })
            })
        } else {
          setFieldState('supplierId', state => {
            state.errors = []
          })
        }
      }
    }
  })
}
