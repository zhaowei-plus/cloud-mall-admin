import { formatMatchValue } from '@/assets/utils'
import { STATUS } from '../constant'

export const getSchema = () => {
  return {
    '[confirmCreateStart,confirmCreateEnd]': {
      type: 'daterange',
      title: '确认时间',
    },
    status: {
      type: 'string',
      title: '确认结果',
      enum: STATUS,
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '业务类型',
      dataIndex: 'bizTypeNames',
    },
    {
      title: '确认结果',
      dataIndex: 'status',
      render: text => formatMatchValue(text, STATUS),
    },
    {
      title: '确认时间',
      dataIndex: 'confirmCreate',
      render: text => text || '-',
    },
  ]
}
