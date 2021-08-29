import { STATUS } from '../constant'
import { USER_TYPES } from '@/assets/constant'
import { formatMatchValue } from '@/assets/utils'

export const getSchema = accountTypes => {
  return {
    name: {
      type: 'xm-string',
      title: '商品名称',
    },
    itemCode: {
      type: 'string',
      title: '商品编码',
    },
    catId: {
      type: 'string',
      title: '商品类别',
      enum: accountTypes,
    },
    status: {
      type: 'string',
      title: '商品状态',
      enum: STATUS,
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '商品编码',
      dataIndex: 'itemCode',
    },
    {
      title: '商品类别',
      dataIndex: 'catName',
    },
    {
      title: '商品状态',
      dataIndex: 'status',
      render: text => formatMatchValue(text, STATUS),
    },
    {
      title: '用户类别',
      dataIndex: 'userType',
      render: text => formatMatchValue(text, USER_TYPES),
    },
    {
      title: '收款方公司',
      dataIndex: 'supplierName',
    },
    {
      title: '状态时间',
      dataIndex: 'gmtModified',
    },
  ]
}
