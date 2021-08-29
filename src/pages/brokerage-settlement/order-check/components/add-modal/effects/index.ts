import dayjs from 'dayjs'
import { createFormActions, FormEffectHooks } from '@formily/antd'
import { merge } from 'rxjs'
import http from '@/api'

const { onFieldInputChange$ } = FormEffectHooks

export default () => {
  const { setFieldState, getFieldValue } = createFormActions()

  onFieldInputChange$('channelId').subscribe(({ value }) => {
    http
      .post(
        'beSettlement/orderCheck/checkedMonth',
        { channelId: value },
        { loading: false }
      )
      .then(res => {
        const { success, data = [] } = res
        if (success) {
          const disabledDates = data.map(item => dayjs(item).format('YYYY-MM'))
          setFieldState('auditMonth', state => {
            state.value = ''
            state.props['x-props'].disabledDate = currentDate => {
              const formatCurrentDate = dayjs(currentDate).format('YYYY-MM')
              const now = dayjs().format('YYYY-MM')
              return (
                formatCurrentDate >= now ||
                disabledDates.includes(formatCurrentDate)
              )
            }
          })
        }
      })
  })

  merge(
    onFieldInputChange$('channelId'),
    onFieldInputChange$('auditMonth')
  ).subscribe(() => {
    const channelId = getFieldValue('channelId')
    const auditMonth = getFieldValue('auditMonth')
    setFieldState('order', state => {
      state.value = undefined
      state.visible = channelId && auditMonth
      state.props['x-props'].params = {
        channelId,
        auditMonth: dayjs(auditMonth).format('YYYYMM'),
      }
    })
  })
}
