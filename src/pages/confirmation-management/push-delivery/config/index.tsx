import React, { Fragment } from 'react'
import { formatMatchValue } from '@/assets/utils'
import { STATUS } from '../constant'

export const getSchema = () => {
  return {
    '[expiryDateStart,expiryDateEnd]': {
      type: 'daterange',
      title: '截止时间',
    },
    status: {
      type: 'string',
      title: '状态',
      enum: STATUS,
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '截止时间',
      dataIndex: 'expiryDate',
    },
    {
      title: '业务类型',
      dataIndex: 'bizTypeNames',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        if ([2].includes(text)) {
          const { failFileId } = record
          return (
            <Fragment>
              {formatMatchValue(text, STATUS)}（
              <a href={`/cmmc-market/confirm/fail/export?fileId=${failFileId}`}>
                失败名单
              </a>
              ）
            </Fragment>
          )
        }
        return formatMatchValue(text, STATUS)
      },
    },
    {
      title: '推送次数',
      dataIndex: 'pushNum',
    },
    {
      title: '推送人数',
      dataIndex: 'peopleNum',
    },
    {
      title: '同意人数',
      dataIndex: 'agreeNum',
    },
    {
      title: '拒绝人数',
      dataIndex: 'refuseNum',
    },
    {
      title: '待确认人数',
      dataIndex: 'waitConfirmNum',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
  ]
}
