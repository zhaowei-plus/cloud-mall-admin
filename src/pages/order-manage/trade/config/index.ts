import { HX_STATUS } from '@/assets/constant'
import { formatMatchValue, formatMoney } from '@/assets/utils'
import {
  ORDER_STATUS,
  PAY_STATUS,
} from '@/pages/order-manage/reservation/constant'

export const getSchema = (supply: any) => {
  return {
    orderId: {
      type: 'xm-string',
      title: '订单编号',
    },
    createrName: {
      type: 'xm-string',
      title: '办理人姓名',
    },
    createrMobile: {
      type: 'string',
      title: '手机号',
    },
    createrCompany: {
      type: 'xm-string',
      title: '办理人公司',
    },
    skuCode: {
      type: 'xm-string',
      title: '产品编码',
    },
    itemCode: {
      type: 'xm-string',
      title: '商品编码',
    },
    supplyId: {
      type: 'string',
      title: '收款方公司',
      enum: supply.dataSource,
      default: supply.default,
    },
    '[createTimeStart,createTimeEnd]': {
      type: 'daterange',
      title: '下单时间',
    },
    auditStatus: {
      type: 'string',
      title: '核销状态',
      enum: HX_STATUS,
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '订单编号',
      dataIndex: 'orderId',
    },
    {
      title: '办理人姓名',
      dataIndex: 'createrName',
    },
    {
      title: '手机号',
      dataIndex: 'createrMobile',
    },
    {
      title: '办理人公司',
      dataIndex: 'createrCompany',
    },
    {
      title: '产品编码',
      dataIndex: 'skuCode',
    },
    {
      title: '产品名称',
      dataIndex: 'skuName',
    },
    {
      title: '商品编码',
      dataIndex: 'itemCode',
    },
    {
      title: '商品名称',
      dataIndex: 'itemName',
    },
    {
      title: '收款方公司',
      dataIndex: 'supplyName',
    },
    {
      title: '产品价格（元）',
      dataIndex: 'originalPrice',
      render: text => formatMoney(text),
    },
    {
      title: '实付款（元）',
      dataIndex: 'paidPrice',
      render: text => formatMoney(text),
    },
    {
      title: '下单时间',
      dataIndex: 'gmtCreate',
    },
    {
      title: '付款状态',
      dataIndex: 'payStatus',
      render: () => '已付款',
    },
    {
      title: '付款时间',
      dataIndex: 'paidTime',
    },
    {
      title: '订单状态',
      dataIndex: 'reserveStatus',
      render: () => '已购买',
    },
    {
      title: '核销状态',
      dataIndex: 'auditStatus',
      render: text => formatMatchValue(text, HX_STATUS),
    },
  ]
}
