import { STATUS } from '../constant'

export const getSchema = () => ({
  id: {
    type: 'string',
    title: '编号',
  },
  title: {
    type: 'string',
    title: '名称',
    'x-component-props': {
      placeholder: '模糊查询',
    },
  },
  creatorMobile: {
    type: 'string',
    title: '手机号码',
    'x-rules': 'phone',
  },
  status: {
    type: 'string',
    title: '状态',
    enum: STATUS,
  },
})

export const getColumns = () => []
