import React from 'react'

export const getSchema = () => {
  return {
    id: {
      type: 'xm-string',
      title: '订单编号',
    },
    materialCode: {
      type: 'xm-string',
      title: '活动编码',
    },
    handleNameLike: {
      type: 'string',
      title: '办理人',
    },
    handleMobile: {
      type: 'string',
      title: '手机号',
    },
    '[orderTimeStart,orderTimeEnd]': {
      type: 'daterange',
      title: '办理时间',
    },
    orgNameLike: {
      type: 'string',
      title: '企业名称',
    },
    materialNameLike: {
      type: 'string',
      title: '活动名称',
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '发放时间',
      dataIndex: 'sendTime',
    },
    {
      title: '发放人',
      dataIndex: 'sendName',
    },
    {
      title: '发放彩豆数',
      dataIndex: 'sendBeanNum',
    },
    {
      title: '发放订单数',
      dataIndex: 'sendOrderNum',
    },
  ]
}

export const getDetailColumns = () => {
  return [
    {
      title: '订单编号',
      dataIndex: 'orderId',
    },
    {
      title: '友好客户',
      dataIndex: 'friendName',
    },
    {
      title: '友好客户手机号',
      dataIndex: 'friendMobile',
    },
    {
      title: '彩豆数',
      dataIndex: 'sendBeanNum',
    },
    {
      title: '发放人',
      dataIndex: 'sendName',
    },
  ]
}

export const getAddSchema = () => {
  return {
    channelName: {
      title: '分公司名称',
      type: 'string',
    },
    channelNumber: {
      title: '分公司号',
      type: 'string',
    },
    operatorNumber: {
      title: '操作员编号',
      type: 'string',
    },
    regionCode: {
      title: '地市',
      type: 'string',
    },
    channelLeaderName: {
      title: '分公司负责人',
      type: 'string',
    },
    channelLeaderMobile: {
      title: '负责人手机号',
      type: 'string',
      'x-rules': 'phone',
    },
  }
}
