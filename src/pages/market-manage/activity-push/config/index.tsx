import React, { Fragment } from 'react'
import querystring from 'querystring'
import { formatMatchValue } from '@/assets/utils'
import { STATUS } from '../constant'

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
        changeOnSelect: true,
      },
    },
    pushStatus: {
      type: 'string',
      title: '推送状态',
      enum: STATUS,
    },
    createrName: {
      type: 'xm-string',
      title: '推送人姓名',
    },
    '[pushStartTime,pushEndTime]': {
      type: 'daterange',
      title: '推送时间',
    },
  }
}

export const getColumns = () => {
  const handleExport = ({ id }) => {
    window.location.href = `/cmmc-market/pubRecord/exportFailRecords?${querystring.stringify(
      { id }
    )}`
  }

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
      title: '分公司',
      dataIndex: 'regionName',
    },
    {
      title: '短信内容',
      dataIndex: 'smsContent',
    },
    {
      title: '推送企业数',
      dataIndex: 'pushOrgCount',
      render: text => text || '-',
    },
    {
      title: '推送友好客户数',
      dataIndex: 'pushFriendlyCount',
      render: text => text || '-',
    },
    {
      title: '推送用户数',
      dataIndex: 'pushUserCount',
      render: text => text || '-',
    },
    {
      title: '推送状态',
      dataIndex: 'pushStatus',
      render: (text, record) => {
        if (text === -1) {
          // 部分失败支持下载，已取消
          return (
            <Fragment>
              推送成功(<a onClick={() => handleExport(record)}>部分失败</a>)
            </Fragment>
          )
        }

        return formatMatchValue(text, STATUS)
      },
    },
    {
      title: '推送人姓名',
      dataIndex: 'createrName',
    },
    {
      title: '推送时间',
      dataIndex: 'pushTime',
    },
  ]
}
