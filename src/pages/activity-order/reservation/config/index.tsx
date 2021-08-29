import React from 'react'

export const getSchema = () => {
  return {
    id: {
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
    orgCityLike: {
      type: 'xm-string',
      title: '企业市区',
    },
    cManagerMobile: {
      type: 'xm-string',
      title: '客户经理手机号',
    },
  }
}

export const getColumns = showProtocol => {
  return [
    {
      title: '订单编号',
      dataIndex: 'id',
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
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'handleMobile',
      width: 100,
    },
    {
      title: '办理时间',
      dataIndex: 'orderTime',
      width: 160,
    },
    {
      title: '客户经理',
      dataIndex: 'cmanagerName',
      width: 100,
    },
    {
      title: '客户经理手机号',
      dataIndex: 'cmanagerMobile',
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
      width: 160,
    },
    {
      title: '企业编码',
      dataIndex: 'orgId',
      width: 120,
    },
    {
      title: '企业名称',
      dataIndex: 'orgName',
      width: 120,
    },
    {
      title: '企业市区',
      dataIndex: 'orgCity',
      width: 140,
    },
    {
      title: '活动名称',
      dataIndex: 'materialName',
      width: 140,
    },
    {
      title: '套餐名称',
      dataIndex: 'setMealName',
      width: 120,
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
    },
  ]
}
