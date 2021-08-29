import React from 'react'

export const getSchema = () => {
  return {
    orderId: {
      type: 'xm-number',
      title: '订单编号',
    },
    materialCode: {
      type: 'xm-string',
      title: '活动编码',
    },
    handleNameLike: {
      type: 'xm-string',
      title: '办理人',
    },
    handleMobile: {
      type: 'xm-string',
      title: '手机号',
    },
    '[handleStartTime,handleEndTime]': {
      type: 'daterange',
      title: '办理时间',
    },
    friendNameLike: {
      type: 'xm-string',
      title: '友好客户',
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '订单编号',
      dataIndex: 'orderId',
      width: 100,
    },
    {
      title: '活动编码',
      dataIndex: 'materialCode',
      width: 100,
    },
    {
      title: '办理人',
      dataIndex: 'handleName',
      width: 90,
    },
    {
      title: '手机号',
      dataIndex: 'handleMobile',
      width: 120,
    },
    {
      title: '办理时间',
      dataIndex: 'handleTime',
      width: 180,
    },
    {
      title: '友好客户',
      dataIndex: 'friendName',
      width: 120,
    },
    {
      title: '友好客户手机号',
      dataIndex: 'friendMobile',
      width: 180,
    },
    {
      title: '企业名称',
      dataIndex: 'orgName',
      width: 140,
    },
    {
      title: '活动名称',
      dataIndex: 'title',
      width: 120,
    },
    {
      title: '活动名称(接口返回)',
      dataIndex: 'orderName',
      width: 200,
    },
    {
      title: '资费ID',
      dataIndex: 'handleSetId',
      width: 120,
    },
    {
      title: '办理状态',
      dataIndex: 'ydStatus',
      width: 120,
      render: () => '已结算',
    },
    {
      title: '应发彩豆',
      dataIndex: 'shouldBeanNum',
      width: 120,
    },
    {
      title: '已发彩豆',
      dataIndex: 'sendBeanNum',
      width: 120,
    },
    {
      title: '发放时间',
      dataIndex: 'sendTime',
      width: 120,
    },
  ]
}
