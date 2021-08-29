import React from 'react'
import { STATUS, HANDLE_STATUS } from '../constant'

export const getSchema = () => {
  return {
    '[auditStartMonth,auditEndMonth]': {
      type: 'daterange',
      title: '稽查年月',
      'x-props': {
        picker: 'month',
      },
    },
    channelNameLike: {
      type: 'xm-string',
      title: '分公司',
    },
    sendStatus: {
      type: 'string',
      title: '发放状态',
      enum: STATUS,
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '稽核年月',
      dataIndex: 'auditMonth',
    },
    {
      title: '分公司',
      dataIndex: 'channelName',
    },
    {
      title: '稽核人',
      dataIndex: 'auditer',
    },
    {
      title: '稽核笔数',
      dataIndex: 'auditNum',
    },
    {
      title: '需发彩豆数',
      dataIndex: 'needSendBean',
    },
    {
      title: '发放状态',
      dataIndex: 'sendStatus',
      render: text => {
        const status = STATUS.find(item => Number(text) === item.value)
        if (status) {
          return status.label
        }
      },
    },
    {
      title: '稽核时间',
      dataIndex: 'auditTime',
    },
    {
      title: '发放时间',
      dataIndex: 'sendTime',
    },
  ]
}

export const getDetailSchema = () => {
  return {
    orderId: {
      type: 'xm-string',
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
    ydStatus: {
      type: 'string',
      title: '办理状态',
      enum: HANDLE_STATUS,
    },
  }
}

export const getDetailColumns = () => {
  return [
    {
      title: '订单编号',
      dataIndex: 'orderId',
    },
    {
      title: '活动编码',
      dataIndex: 'materialCode',
    },
    {
      title: '办理人',
      dataIndex: 'handleName',
    },
    {
      title: '手机号',
      dataIndex: 'handleMobile',
    },
    {
      title: '办理时间',
      dataIndex: 'handleTime',
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
      title: '企业名称',
      dataIndex: 'orgName',
    },
    {
      title: '活动名称',
      dataIndex: 'title',
    },
    {
      title: '活动名称(接口返回)',
      dataIndex: 'orderName',
    },
    {
      title: '资费ID',
      dataIndex: 'handleSetId',
    },
    {
      title: '办理状态',
      dataIndex: 'ydStatus',
      render: text => {
        const status = HANDLE_STATUS.find(item => Number(text) === item.value)
        if (status) {
          return status.label
        }
      },
    },
    {
      title: '应发彩豆',
      dataIndex: 'shouldBeanNum',
    },
    {
      title: '已发彩豆',
      dataIndex: 'sendBeanNum',
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
