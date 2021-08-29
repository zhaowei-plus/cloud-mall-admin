import { IMPORT_STATUS } from '../constant'

export const getSchema = () => ({
  orgId: {
    type: 'string',
    title: '企业编码',
  },
  orgName: {
    type: 'string',
    title: '企业名称',
  },
  friendName: {
    type: 'string',
    title: '友好客户',
  },
  friendMobile: {
    type: 'string',
    title: '手机号码',
    'x-rules': 'phone',
  },
})

export const getColumns = () => []
