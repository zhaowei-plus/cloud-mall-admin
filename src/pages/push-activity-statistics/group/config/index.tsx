import React from 'react'
import { STATUS, MATERIAL_TYPES } from '../constant'

export const getSchema = () => {
  return {
    materialCode: {
      type: 'xm-string',
      title: '活动编码',
    },
    materialName: {
      type: 'xm-string',
      title: '活动名称',
    },
    regionCode: {
      type: 'region-cascader',
      title: '分公司',
      'x-props': {
        level: 3,
        allowClear: true,
        changeOnSelect: true,
      },
    },
    materialStatus: {
      type: 'string',
      title: '活动状态',
      enum: STATUS,
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '活动编码',
      dataIndex: 'materialCode',
    },
    {
      title: '活动名称',
      dataIndex: 'materialName',
    },
    {
      title: '活动类型',
      dataIndex: 'materialType',
      render: text => {
        const status = MATERIAL_TYPES.find(item => Number(text) === item.value)
        if (status) {
          return status.label
        }
      },
    },
    {
      title: '分公司',
      dataIndex: 'regionName',
    },
    {
      title: '活动状态',
      dataIndex: 'materialStatus',
      render: text => {
        const status = STATUS.find(item => Number(text) === item.value)
        if (status) {
          return status.label
        }
      },
    },
    {
      title: '活动时间',
      render: record => {
        const { startTime, endTime } = record
        return `${startTime}至${endTime}`
      },
    },
    {
      title: '推送企业数',
      dataIndex: 'pushOrgCount',
    },
    {
      title: '推送人数',
      dataIndex: 'pushUserCount',
    },
    {
      title: '推送友好客户数',
      dataIndex: 'pushFriendlyCount',
    },
    {
      title: '友好客户推荐人数',
      dataIndex: 'forwardCount',
    },
    {
      title: '推荐已读人数',
      dataIndex: 'forwardReadCount',
    },
    {
      title: '已读总人数',
      dataIndex: 'readCount',
    },
    {
      title: '已办理人数',
      dataIndex: 'orderCount',
    },
    {
      title: '已预约人数',
      dataIndex: 'reserveCount',
    },
  ]
}

export const getDetailSchema = () => {
  return {
    orgId: {
      type: 'xm-string',
      title: '企业编码',
    },
    orgName: {
      type: 'xm-string',
      title: '企业名称',
    },
    friendlyName: {
      type: 'xm-string',
      title: '友好客户',
    },
    mobile: {
      type: 'xm-string',
      title: '手机号',
    },
    '[provinceId,regionId,countyId]': {
      type: 'region-cascader',
      title: '所属地区',
    },
  }
}

export const getDetailColumns = () => {
  return [
    {
      title: '企业编码',
      dataIndex: 'orgId',
    },
    {
      title: '企业名称',
      dataIndex: 'orgName',
    },
    {
      title: '友好客户',
      dataIndex: 'friendlyName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '所属地区',
      dataIndex: 'regionCountyName',
    },
    {
      title: '推送人数',
      dataIndex: 'pushUserCount',
    },
    {
      title: '友好客户推荐人数',
      dataIndex: 'forwardCount',
    },
    {
      title: '推荐已读人数',
      dataIndex: 'forwardReadCount',
    },
    {
      title: '已读总人数',
      dataIndex: 'readCount',
    },
    {
      title: '已办理人数',
      dataIndex: 'orderCount',
    },
    {
      title: '已预约人数',
      dataIndex: 'reserveCount',
    },
  ]
}
