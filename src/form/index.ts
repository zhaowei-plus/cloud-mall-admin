import { registerFormFields, connect } from '@formily/antd'

import XmString from './xm-string'
import XmNumber from './xm-number'
import XmTextArea from './xm-textarea'
import XmPassword from './xm-password'
import VerifyCode from './verify-code'
import OrderUpload from './order-upload'
import ImageUpload from './image-upload'
import RegionCascader from './region-cascader'

// 全局批量扩展，请查看帮助文档：https://formilyjs.org/#/0yTeT0/jYSxSwhmHa
registerFormFields({
  'xm-string': connect()(XmString),
  'xm-number': connect()(XmNumber),
  'verify-code': connect()(VerifyCode),
  'xm-textarea': connect()(XmTextArea),
  'xm-password': connect()(XmPassword),
  'order-upload': connect()(OrderUpload),
  'image-upload': connect()(ImageUpload),
  'region-cascader': connect()(RegionCascader),
})
