import cookies from 'react-cookies'
import { STATUS } from '../constant'
import { formatMatchValue } from '@/assets/utils'

export const getSchema = (accountTypes, supply: any = {}) => {
  return {
    mobile: {
      type: 'xm-string',
      title: '用户账号',
    },
    name: {
      type: 'xm-string',
      title: '用户姓名',
    },
    accountTypeId: {
      type: 'string',
      title: '账号类别',
      enum: accountTypes,
    },
    supplyId: {
      type: 'string',
      title: '收款方公司',
      enum: supply.dataSource,
      default: supply.default,
      'x-props': {
        allowClear: !Boolean(supply.default),
      },
    },
    status: {
      type: 'string',
      title: '用户状态',
      enum: STATUS,
    },
    creatorName: {
      type: 'xm-string',
      title: '创建人',
    },
    '[createStartTime,createEndTime]': {
      type: 'daterange',
      title: '创建时间',
    },
  }
}

export const getColumns = supplies => {
  return [
    {
      title: '用户账户',
      dataIndex: 'mobile',
    },
    {
      title: '用户姓名',
      dataIndex: 'name',
    },
    {
      title: '用户角色',
      dataIndex: 'roleNames',
    },
    {
      title: '账号类别',
      dataIndex: 'accountTypeName',
    },
    {
      title: '管理区域',
      dataIndex: 'regionNames',
    },
    {
      title: '收款方公司',
      dataIndex: 'supplyId',
      render: text => formatMatchValue(text, supplies),
    },
    {
      title: '用户状态',
      dataIndex: 'status',
      render: text => formatMatchValue(text, STATUS),
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
    },
  ]
}

export const getAddSchema = (
  role: any = {},
  supply: any = {},
  isEdit = false // 编辑状态
) => {
  // 非超管用户，供应商不可选择
  let isSuperAdmin = false
  const user = cookies.load('user')
  if (user) {
    isSuperAdmin = user.isSuperAdmin
  }

  const validMobile = value => {
    if (value) {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        return '请输入11位手机号码'
      }
    }
    return ''
  }

  return {
    mobile: {
      editable: !isEdit, // 用户账号不支持编辑
      required: true,
      type: 'xm-string',
      title: '用户账号',
      'x-rules': [{ validator: validMobile }],
    },
    name: {
      required: true,
      type: 'xm-string',
      title: '用户姓名',
    },
    roleIdList: {
      required: true,
      type: 'string',
      title: '用户角色',
      enum: role.dataSource,
      default: role.default,
      'x-props': {
        mode: 'multiple',
        placeholder: '请输入',
        showSearch: true,
        optionFilterProp: 'title',
      },
    },
    supplyId: {
      required: true,
      editable: isSuperAdmin,
      type: 'string',
      title: '付款方公司',
      enum: supply.dataSource,
      default: supply.default,
      'x-props': {
        placeholder: '请输入',
        showSearch: true,
        optionFilterProp: 'title',
      },
    },
    status: {
      required: true,
      type: 'string',
      title: '用户状态',
      enum: [
        { label: '停用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
  }
}
