import React from 'react'
import { SchemaMarkupField as Field } from '@formily/antd'
import { FormBlock } from '@formily/antd-components'

import { PUSH_USERS } from '../constant'

export default props => {
  return (
    <FormBlock
      name="pushConfig"
      title={
        <div className="config-header">
          <span className="title">推送配置</span>
          <span className="notice">
            默认会根据目标用户名单和推送地市来直接推送至成员
          </span>
        </div>
      }
    >
      <Field
        required
        title="友好客户转发"
        name="friendType"
        x-component="SwitchField"
        x-props={{
          message: '注：开启后支持友好客户转发并得奖励',
        }}
      />
      <Field
        required
        editable={false}
        type="string"
        title="可推送的用户"
        name="pushUsers"
        enum={PUSH_USERS}
        default={PUSH_USERS[0].value}
        x-props={{
          mode: 'multiple',
          placeholder: '请选择',
          style: { width: 360 },
          getPopupContainer: node => node.parentNode,
        }}
      />
      <Field
        required
        title="公众号标题"
        type="xm-string"
        name="publicTitle"
        x-props={{
          style: { width: 600 },
          placeholder: '请输入',
          maxLength: 20,
        }}
      />
      <Field
        required
        title="公众号摘要"
        type="xm-string"
        name="publicAbstract"
        x-props={{
          style: { width: 600 },
          placeholder: '请输入',
          maxLength: 20,
        }}
      />
    </FormBlock>
  )
}
