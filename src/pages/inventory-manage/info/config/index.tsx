import React from 'react'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

export const getExpressionScope = () => {
  return {
    text(...args) {
      return React.createElement(
        'span',
        {
          className: 'self-text',
        },
        ...args
      )
    },
    help(text: string, offset = 4) {
      return React.createElement(
        Tooltip,
        { title: text },
        <QuestionCircleOutlined
          style={{ cursor: 'pointer', marginLeft: offset }}
        />
      )
    },
  }
}

export const getSchema = categories => {
  return {
    itemName: {
      type: 'xm-string',
      title: '商品名称',
    },
    itemCode: {
      type: 'xm-string',
      title: '商品编码',
    },
    catId: {
      type: 'string',
      title: '商品类别',
      enum: categories,
    },
    skuName: {
      type: 'xm-string',
      title: '产品名称',
    },
    skuCode: {
      type: 'xm-string',
      title: '产品编码',
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '商品名称',
      dataIndex: 'itemName',
    },
    {
      title: '商品编码',
      dataIndex: 'itemCode',
    },
    {
      title: '商品类别',
      dataIndex: 'catName',
    },
    {
      title: '产品名称',
      dataIndex: 'skuName',
    },
    {
      title: '产品编码',
      dataIndex: 'skuCode',
    },
    {
      title: '冻结库存数',
      dataIndex: 'unbalanceStock',
    },
    {
      title: '已销售数',
      dataIndex: 'soldStock',
    },
    {
      title: '可销售数',
      dataIndex: 'availableStock',
      render: text => (+text === -1 ? '库存不限' : text),
    },
  ]
}

export const getEditSchema = () => {
  return {
    skuCode: {
      title: '产品编码',
      type: 'string',
    },
    skuName: {
      title: '产品名称',
      type: 'string',
    },
    itemCode: {
      title: '商品编码',
      type: 'string',
    },
    itemName: {
      title: '商品名称',
      type: 'string',
    },
    catName: {
      title: '商品类别',
      type: 'string',
    },
    // stock: {
    //   type: 'object',
    //   'x-component': 'grid',
    //   properties: {
    //     available_stock: {
    //       title: '可销库存数',
    //       type: 'number',
    //       required: true,
    //       'x-props': {
    //         maxLength: 50,
    //         // min: 1,
    //         disabled: false,
    //         placeholder: '请输入可销库存数',
    //         wrapperCol: 13,
    //         style: {
    //           width: '136px',
    //         },
    //       },
    //       'x-index': 5,
    //       'x-rules': [
    //         { required: true, message: '请输入库存数目' },
    //         {
    //           validator: (val: any) => {
    //             return new Promise((resolve: any) => {
    //               if (!/^\+?[1-9]\d*$/.test(val)) resolve('请输入大于0的正整数')
    //               if (+val > 200000000) resolve('可销库存最大值为200000000')
    //
    //               resolve('')
    //             })
    //           },
    //         },
    //       ],
    //     },
    //     stockUnlimit: {
    //       type: 'checkbox',
    //       enum: ['库存不限'],
    //       'x-index': 6,
    //     },
    //   },
    // },
  }
}
