import { STATUS } from '@/pages/user-manage/user/constant'
import { validMobile } from '@/assets/validator'
import { formatMatchValue } from '@/assets/utils'

export const getSchema = () => {
  return {
    name: {
      type: 'string',
      title: '收款方公司',
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
      title: '收款方公司',
      dataIndex: 'name',
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
    },
    {
      title: '联系电话',
      dataIndex: 'contactMobile',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: text => formatMatchValue(text, STATUS),
    },
  ]
}

export const getAddSchema = () => {
  return {
    name: {
      required: true,
      type: 'xm-string',
      title: '收款方名称',
      'x-props': {
        maxLength: 20,
      },
    },
    contactPerson: {
      type: 'xm-string',
      title: '联系人',
      'x-props': {
        maxLength: 10,
      },
    },
    contactMobile: {
      type: 'xm-string',
      title: '联系电话',
      'x-rules': [{ validator: validMobile }],
    },
    remark: {
      type: 'xm-textarea',
      title: '备注',
      'x-props': {
        placeholder: '请输入30字以内备注',
        maxLength: 30,
        autosize: {
          minRows: 2,
        },
      },
    },
    status: {
      required: true,
      type: 'string',
      title: '收款方状态',
      enum: [
        { label: '停用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
  }
}
