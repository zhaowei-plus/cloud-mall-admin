import { ROLE_TYPES, STATUS } from '@/pages/user-manage/user/constant'
import { formatMatchValue } from '@/assets/utils'

export const getSchema = accountTypes => {
  return {
    name: {
      type: 'xm-string',
      title: '角色名称',
    },
    accountTypeId: {
      type: 'string',
      title: '账号类别',
      enum: accountTypes,
    },
    status: {
      type: 'string',
      title: '用户状态',
      enum: STATUS,
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '账号类别',
      dataIndex: 'accountTypeName',
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      render: text => formatMatchValue(text, STATUS),
    },
  ]
}

export const getAddSchema = (accountTypes, isEdit) => {
  return {
    name: {
      required: true,
      type: 'xm-string',
      title: '角色名称',
    },
    accountTypeId: {
      editable: !isEdit,
      required: true,
      type: 'string',
      title: '账号类型',
      enum: accountTypes,
    },
    status: {
      required: true,
      type: 'string',
      title: '角色状态',
      enum: [
        { label: '停用', value: 0 },
        { label: '启用', value: 1 },
      ],
      default: 1,
    },
  }
}
