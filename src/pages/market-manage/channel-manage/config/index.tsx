import React from 'react'

export const getSchema = () => {
  return {
    channelNameLike: {
      type: 'xm-string',
      title: '分公司名称',
    },
    channelLeaderNameLike: {
      type: 'xm-string',
      title: '分公司负责人',
    },
    channelLeaderMobile: {
      type: 'string',
      title: '手机号',
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '分公司ID',
      dataIndex: 'id',
    },
    {
      title: '分公司名称',
      dataIndex: 'channelName',
    },
    {
      title: '分公司负责人',
      dataIndex: 'channelLeaderName',
    },
    {
      title: '手机号',
      dataIndex: 'channelLeaderMobile',
    },
    {
      title: '地市',
      dataIndex: 'regionName',
    },
    {
      title: '分公司号',
      dataIndex: 'channelNumber',
    },
    {
      title: '操作员编码',
      dataIndex: 'operatorNumber',
    },
  ]
}

export const getAddSchema = () => {
  return {
    channelName: {
      title: '分公司名称',
      type: 'string',
      'x-props': {
        maxLength: 30,
      },
    },
    channelNumber: {
      title: '分公司号',
      type: 'string',
      'x-props': {
        maxLength: 15,
      },
    },
    operatorNumber: {
      title: '操作员编号',
      type: 'string',
      'x-props': {
        maxLength: 15,
      },
    },
    regionCode: {
      title: '地市',
      type: 'region-cascader',
      'x-props': {
        allowClear: true,
        // changeOnSelect: true,
        level: 3,
      },
    },
    channelLeaderName: {
      title: '分公司负责人',
      type: 'string',
      'x-props': {
        maxLength: 10,
      },
    },
    channelLeaderMobile: {
      title: '负责人手机号',
      type: 'string',
      'x-rules': 'phone',
    },
  }
}
