import React from 'react'
import cookies from 'react-cookies'
import { Image } from '@/components'
import { formatMatchValue } from '@/assets/utils'
import { STATUS, DATA_TYPE, HANDLE_MODE, FRIEND_TYPE } from '../constant'

export const getSchema = () => {
  return {
    code: {
      type: 'xm-string',
      title: '活动编码',
    },
    titleLike: {
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
    '[activityBeginTime,activityEndTime]': {
      type: 'daterange',
      title: '活动时间',
    },
    dataType: {
      type: 'string',
      title: '活动类型',
      enum: DATA_TYPE,
    },
    handleMode: {
      type: 'string',
      title: '办理模式',
      enum: HANDLE_MODE,
    },
    friendType: {
      type: 'string',
      title: '友好客户',
      enum: FRIEND_TYPE,
    },
    preCodeLike: {
      type: 'xm-string',
      title: '资费ID',
    },
    status: {
      type: 'string',
      title: '状态',
      enum: STATUS,
    },
    creator: {
      type: 'xm-string',
      title: '创建人',
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '活动编码',
      dataIndex: 'code',
    },
    {
      title: '活动名称',
      dataIndex: 'title',
      render: (text, record) => {
        const { forwardConfig = [] } = record
        const appPopup = forwardConfig.find(item => item.imageType === 3)
        if (appPopup) {
          return (
            <div className="info">
              <Image src={appPopup.imageUrl} className="app-popup" />
              <label>{text}</label>
            </div>
          )
        }
        return text
      },
    },
    {
      title: '分公司',
      dataIndex: 'regionName',
      width: 120,
    },
    {
      title: '短信内容',
      dataIndex: 'smsContent',
    },
    {
      title: '活动时间',
      dataIndex: 'activeTime',
      render: (text, record) => {
        const { activityBeginTime, activityEndTime } = record
        return `${activityBeginTime} - ${activityEndTime}`
      },
    },
    {
      title: '活动类型',
      dataIndex: 'dataType',
      render: text => formatMatchValue(text, DATA_TYPE),
    },
    {
      title: '资费ID',
      dataIndex: 'preCode',
      width: 300,
    },
    {
      title: '办理模式',
      dataIndex: 'handleMode',
      render: text => formatMatchValue(text, HANDLE_MODE),
    },
    {
      title: '友好客户',
      dataIndex: 'friendType',
      render: text => formatMatchValue(text, FRIEND_TYPE),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: text => formatMatchValue(text, STATUS),
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 140,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
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
