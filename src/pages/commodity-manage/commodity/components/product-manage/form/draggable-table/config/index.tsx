import React, { Fragment } from 'react'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { formatMoney } from '@/assets/utils'

export const getColumns = (handleEdit, handleDelete, isEdit = true) => {
  const operations = isEdit
    ? [
        {
          title: '操作',
          dataIndex: 'skuId',
          key: 'operation',
          width: 120,
          render: (text, record, index) => {
            return (
              <Fragment>
                <a
                  onClick={() => handleEdit(record, index)}
                  style={{ marginRight: 10 }}
                >
                  修改
                </a>
                <a onClick={() => handleDelete(index)}>删除</a>
              </Fragment>
            )
          },
        },
      ]
    : []

  return [
    {
      title: '产品编码',
      dataIndex: 'skuCode',
    },
    {
      title: '产品名称',
      dataIndex: 'name',
    },
    {
      title: '收款方价格（元）',
      dataIndex: 'originalPrice',
      render: text => formatMoney(text),
    },
    {
      title: '产品标价（元）',
      dataIndex: 'salePrice',
      render: (text, record) => {
        const { priceType, salePrice, customPriceDesc } = record
        if (priceType === 1) {
          return formatMoney(salePrice)
        }
        if (priceType === 2) {
          return customPriceDesc
        }
      },
    },
    {
      title: '优惠价（元）',
      dataIndex: 'activityPrice',
      render: text => (text === -1 ? '不支持' : formatMoney(text)),
    },
    {
      title: '可销库存数',
      dataIndex: 'stock',
      render: text => (text === -1 ? '库存不限' : text),
    },
    {
      title: '备注',
      dataIndex: 'skuInst',
    },
    ...operations,
  ]
}

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
