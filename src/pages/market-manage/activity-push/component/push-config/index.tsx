import React from 'react'
import { SchemaMarkupField as Field } from '@formily/antd'
import { FormBlock, FormTextBox, FormSlot } from '@formily/antd-components'

import { PUSH_USERS } from '../../constant'

import './index.less'

export default props => {
  return (
    <FormBlock name="pushConfig" title="推送配置" className="push-config">
      <FormSlot name="empty">
        <div className="material-empty">选择活动后，可手动选择推送方式</div>
      </FormSlot>
      <Field
        required
        visible={false}
        type="radio"
        name="publishMode"
        title="推送人群"
        enum={PUSH_USERS}
      />
      <FormTextBox
        required
        name="pushWay"
        visible={false}
        title="推送方式"
        text="%s %s %s %s %s %s"
        className="push-way-content"
      >
        <Field
          name="appPop"
          x-component="RemindWay"
          x-props={{
            tips: 'app弹窗',
            previewUrl:
              'https://global.uban360.com/sfs/file?digest=fid78465e7486b067125a6c106bbf1a9b17&fileType=2',
            content: '1111',
          }}
        />
        <Field
          name="appAd"
          x-component="RemindWay"
          x-props={{
            tips: 'app广告位',
            previewUrl:
              'https://global.uban360.com/sfs/file?digest=fid388248f2e7dc7bcc29ba1fd6dcf64080&fileType=2',
            content: '2222',
          }}
        />
        <Field
          name="msgCover"
          x-component="RemindWay"
          x-props={{
            tips: '系统消息',
            previewUrl:
              'https://global.uban360.com/sfs/file?digest=fid41970d5d0b4770695727867cefa457c7&fileType=2',
          }}
        />
        <Field
          name="freeSms"
          x-component="RemindWay"
          x-props={{
            tips: '免费短信',
            content: <span className="placeholder">请先选择活动～</span>,
            previewUrl:
              'https://global.uban360.com/sfs/file?digest=fid3f090cd84ab5ff6f6c5fedb959be1c3f&fileType=2',
          }}
        />
      </FormTextBox>
    </FormBlock>
  )
}
