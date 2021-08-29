import React from 'react'
import { SchemaMarkupField as Field } from '@formily/antd'
import { FormBlock } from '@formily/antd-components'

import './index.less'

export default () => {
  const requiredValidator = value => {
    if (Array.isArray(value) && value.length === 0) {
      return '该字段是必填字段'
    } else if (!value) {
      return '该字段是必填字段'
    }
  }
  return (
    <FormBlock title="活动配置" className="material-config">
      <Field
        name="activity"
        title="选择活动"
        x-component="MaterialSelect"
        x-rules={[{ required: true, message: '请选择活动' }]}
      />
      <FormBlock name="firmConfig">
        <Field
          required
          visible={false}
          type="radio"
          name="publishRange"
          title="下发范围"
          enum={[]}
        />
        <Field
          visible={false}
          title=" "
          name="singleGrant"
          x-component="FirmSearch"
          x-props={{
            placeholder: '请输入',
            colon: false,
            comment: '精准下发（单个输入）',
          }}
          x-rules={[{ validator: requiredValidator }]}
        />
        <Field
          visible={false}
          title=" "
          name="batchGrant"
          x-component="BatchImport"
          x-props={{
            placeholder: '请导入',
            colon: false,
            comment: '精准下发（批量导入）',
          }}
          x-rules={[{ validator: requiredValidator }]}
        />
        <Field
          visible={false}
          title=" "
          name="targetClientListImport"
          x-component="ListSearch"
          x-props={{
            placeholder: '请输入',
            colon: false,
            comment: '目标名单导入',
            url: 'push/orgTargetMembers',
            params: {
              materialId: 3, // 市场活动
            },
          }}
          x-rules={[{ validator: requiredValidator }]}
        />
        <Field
          visible={false}
          title=" "
          name="targetListImport"
          x-component="ListSearch"
          x-props={{
            placeholder: '请输入',
            colon: false,
            comment: '目标客户名单选择',
            url: 'push/targetMembers',
            params: {
              listType: 3, // 市场活动
            },
          }}
          x-rules={[{ validator: requiredValidator }]}
        />
      </FormBlock>
    </FormBlock>
  )
}
