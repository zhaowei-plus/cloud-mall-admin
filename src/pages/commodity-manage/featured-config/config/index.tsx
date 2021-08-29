import React from 'react'
import { MODULE_TYPE } from '../constant'

export const getBannerSchema = categories => {
  return {
    img: {
      required: true,
      type: 'image-upload',
      title: 'banner图片',
      description: '支持5M内尺寸为1029*270的图片',
      'x-props': {
        action: '/ygw/api/upload/csm/ifs/uploadFile',
        max: 5 * 1024 * 1024,
        sizeVerify: true,
        message: '1029X270',
        width: 1029,
        height: 270,
      },
    },
    itemId: {
      type: 'string',
      title: '选择商品',
      enum: categories,
      description: '选择商品后点击banner跳转详情页',
      'x-props': {
        allowClear: true,
        showSearch: true,
        optionFilterProp: 'title',
      },
    },
  }
}

export const getModeSchema = (categories, moduleType) => {
  return {
    moduleName: {
      required: true,
      type: 'string',
      title: '模块名称',
      'x-props': {
        maxLength: 8,
      },
    },
    moduleExplain: {
      type: 'string',
      title: '模块说明',
      'x-props': {
        maxLength: 15,
      },
    },
    item: {
      required: true,
      type: 'string',
      title: '选择商品',
      enum: categories,
      description: '选择商品后点击banner跳转详情页',
      'x-props': {
        allowClear: true,
        showSearch: true,
        optionFilterProp: 'title',
        mode: moduleType === MODULE_TYPE.COMMODITY ? '' : 'multiple',
      },
    },
  }
}
