import React from 'react'
import { Tooltip } from 'antd'
import { SchemaMarkupField as Field } from '@formily/antd'
import { FormBlock, FormTextBox } from '@formily/antd-components'
import { QuestionCircleOutlined } from '@ant-design/icons'
import moment from 'moment'

import { TARGET_SELECT, STATUS } from '../constant'

export default () => {
  const validPeriodValidator = (value = []) => {
    const [start, end] = value
    if (!start && !end) {
      return '该字段是必填字段'
    }
    if (!start) {
      return '请选择开始时间'
    }
    if (!end) {
      return '请选择结束时间'
    }
  }

  return (
    <FormBlock title="基础信息" name="basicConfig">
      <Field
        required
        title="活动类型"
        name="dataType"
        type="string"
        enum={[
          { label: '集团模式', value: 1 },
          { label: '市场模式', value: 2 },
        ]}
        x-props={{
          placeholder: '请选择',
          style: { width: 360 },
          getPopupContainer: node => node.parentNode,
          maxLength: 20,
        }}
      />
      <Field
        required
        title="活动名称"
        name="title"
        type="xm-string"
        x-props={{
          placeholder: '请输入',
          style: { width: 400 },
          maxLength: 20,
        }}
      />
      <Field
        required
        title="短信内容"
        name="smsContent"
        type="xm-string"
        x-props={{
          placeholder: '请输入',
          maxLength: 20,
          labelWidth: 300,
          style: { width: 400 },
          addonAfter: (
            <div className="addon-after">
              注：短信内容 文字会应用到短信通知信息内
              <Tooltip title="短信模板：【渝企信】 【短信内容】，立即办理请点击【活动链接】">
                <QuestionCircleOutlined
                  style={{ cursor: 'pointer', margin: '0 4px' }}
                />
              </Tooltip>
            </div>
          ),
        }}
      />
      <FormTextBox title="活动ID" text="%s %s">
        <Field
          required
          name="activityExist"
          type="string"
          enum={[
            { label: '存在', value: true },
            { label: '不存在', value: false },
          ]}
        />
        <Field
          required
          name="activityId"
          type="xm-string"
          x-props={{
            placeholder: '请输入',
            style: { width: 400 },
          }}
        />
      </FormTextBox>
      <Field
        required
        title="活动链接"
        name="activityUrl"
        type="xm-string"
        x-props={{
          placeholder: '请输入',
          style: { width: 600 },
        }}
      />
      <Field
        required
        title="活动有效期"
        name="validPeriod"
        x-component="RangePicker"
        x-component-props={{
          disabledDate: currentDate => {
            return currentDate <= moment().subtract(1, 'days')
          },
          // format: 'YYYY-MM-DD',
          // showTime: true
        }}
        x-props={{
          style: { width: 320 },
        }}
        x-rules={[{ validator: validPeriodValidator }]}
      />
      <Field
        required
        display={false}
        title="目标客户"
        name="targetSelect"
        type="radio"
        enum={TARGET_SELECT}
      />
      <Field
        required
        display={false}
        title="选择文件"
        name="targetCustomer"
        type="string"
        enum={[]}
        x-props={{
          placeholder: '请输入',
          mode: 'multiple',
          showSearch: true,
          style: { width: 400 },
          optionFilterProp: 'title',
          getPopupContainer: node => node.parentNode,
        }}
      />
      <Field
        required
        display={false}
        title="选择目标地市"
        name="area"
        x-component="SelectArea"
        x-props={{
          level: 3, // 地市一级
          placeholder: '请输入',
          style: { width: 400 },
          getPopupContainer: node => node.parentNode,
        }}
      />
      <Field
        required
        display={false}
        title="客户群标签"
        name="userTags"
        x-component="UserTags"
      />
      <Field
        required
        title="小程序办理"
        name="appletsType"
        x-component="SwitchField"
        x-props={{
          message: '注：开启后可在小程序办理',
        }}
      />
      <Field
        title="状态"
        name="status"
        type="string"
        enum={STATUS}
        display={false}
      />
    </FormBlock>
  )
}
