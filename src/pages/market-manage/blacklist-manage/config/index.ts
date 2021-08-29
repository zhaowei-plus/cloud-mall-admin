import { IMPORT_STATUS } from '../constant'

export const getSchema = () => ({
  id: {
    type: 'string',
    title: '序号',
  },
  name: {
    type: 'string',
    title: '名称',
  },
  author: {
    type: 'string',
    title: '创建人手机号',
    'x-rules': 'phone',
  },
  importStatus: {
    type: 'string',
    title: '导入状态',
    default: IMPORT_STATUS[0].value,
    enum: IMPORT_STATUS,
    'x-component-props': {
      style: { width: 120 },
    },
  },
})
