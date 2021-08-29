import React from 'react'
import { SchemaMarkupField as Field } from '@formily/antd'
import { FormBlock } from '@formily/antd-components'

export default () => {
  return (
    <FormBlock title="图片配置" name="pictureConfig" className="picture-config">
      <Field
        required
        name="listImg"
        x-component="PictureUpload"
        x-props={{
          tips: '列表图',
          size: {
            width: 1035,
            height: 300,
          },
          action: '/ygw/api/upload/csm/ifs/uploadFile',
          max: 5 * 1024 * 1024,
        }}
      />
      <Field
        required
        name="thumbnail"
        x-component="PictureUpload"
        x-props={{
          tips: '缩略图',
          size: {
            width: 200,
            height: 200,
          },
          action: '/ygw/api/upload/csm/ifs/uploadFile',
          max: 5 * 1024 * 1024,
        }}
      />
      <Field
        required
        name="appPop"
        x-component="PictureUpload"
        x-props={{
          tips: 'APP弹窗',
          size: {
            width: 1005,
            height: 1290,
          },
          action: '/ygw/api/upload/csm/ifs/uploadFile',
          max: 5 * 1024 * 1024,
        }}
      />
      <Field
        required
        name="appAd"
        x-component="PictureUpload"
        x-props={{
          tips: 'APP广告位',
          size: {
            width: 1035,
            height: 270,
          },
          action: '/ygw/api/upload/csm/ifs/uploadFile',
        }}
      />
      <Field
        required
        name="qRcode"
        x-component="PictureUpload"
        x-props={{
          tips: '二维码活动图',
          size: {
            width: 1005,
            height: 1380,
          },
          action: '/ygw/api/upload/csm/ifs/uploadFile',
          max: 5 * 1024 * 1024,
        }}
      />
      <Field
        required
        name="msgCover"
        x-component="PictureUpload"
        x-props={{
          tips: '消息封面',
          size: {
            width: 915,
            height: 450,
          },
          action: '/ygw/api/upload/csm/ifs/uploadFile',
          max: 5 * 1024 * 1024,
        }}
      />
    </FormBlock>
  )
}
