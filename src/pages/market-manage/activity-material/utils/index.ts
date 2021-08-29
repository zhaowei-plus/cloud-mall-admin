import { formatMoney } from '@/assets/utils'

export const formatRuleAwards = (ruleAwards = [], tag = 'toYuan') => {
  return ruleAwards.map(item => ({
    paymentId: item.paymentId,
    paymentAward: formatMoney(item.paymentAward, tag),
  }))
}
