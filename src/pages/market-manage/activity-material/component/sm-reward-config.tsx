import React from 'react'
import { SchemaMarkupField as Field } from '@formily/antd'
import { FormBlock, FormSlot } from '@formily/antd-components'
import { REWARD_TYPES } from '../constant'

export default () => {
  // 金额校验
  const moneyValidator = length => value => {
    if (value >= 0) {
      const valueSplit = value.toString().split('.')
      if (valueSplit.length === 2) {
        if (valueSplit[1].length > 2) {
          return '金额最多2位小数'
        } else if (valueSplit[0].length + valueSplit[1].length > length) {
          return `金额最多${length}位数字`
        }
      } else if (valueSplit[0].length > length - 2) {
        return `金额最多${length - 2}位整数`
      }
    } else {
      return '请输入正确的金额'
    }
  }

  // 正整数长度判断
  const integerValidator = length => value => {
    if (!/(^[1-9]\d*$)/.test(value) || value.toString().length > length) {
      return `请输入${length}位内正整数`
    }
  }

  return (
    <FormBlock title="讯盟奖励配置" name="smRewardConfig">
      <FormSlot>
        <div className="form-tips">注：彩豆汇率：1元=100彩豆</div>
      </FormSlot>
      <Field
        required
        title="奖励方式"
        name="smReward.awardMode"
        type="string"
        enum={REWARD_TYPES}
        x-props={{
          style: { width: 200 },
          getPopupContainer: node => node.parentNode,
        }}
      />
      <Field
        required
        title="按订单"
        name="smReward.orderAward"
        type="number"
        x-props={{
          placeholder: '请输入',
          style: { width: 100 },
          min: 0,
          addonAfter: <span className="addon-after">元/笔奖励</span>,
        }}
      />
      <Field
        required
        title="按规则"
        name="smReward.ruleAwards"
        type="array"
        x-component="table"
        minItems={1}
        x-props={{
          renderMoveDown: () => null,
          renderMoveUp: () => null,
          operationsWidth: 76,
          style: { width: '300' },
        }}
      >
        <Field type="object">
          <Field
            required
            name="paymentId"
            type="number"
            title="预缴ID"
            x-props={{
              placeholder: '请输入',
              style: { width: 160 },
              maxLength: 12,
              min: 0,
            }}
            x-rules={[{ validator: integerValidator(12) }]}
          />
          <Field
            required
            name="paymentAward"
            type="number"
            title="返佣（元/笔）"
            x-props={{
              placeholder: '请输入',
              style: { width: 160 },
              min: 0,
            }}
            x-rules={[{ validator: moneyValidator(5) }]}
          />
        </Field>
      </Field>
    </FormBlock>
  )
}
