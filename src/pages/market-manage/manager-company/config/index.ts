export const getSchema = () => ({
  orgId: {
    type: 'string',
    title: '企业编码',
    'x-component-props': {
      placeholder: '精确查询',
    },
  },
  orgName: {
    type: 'string',
    title: '企业名称',
    'x-component-props': {
      placeholder: '模糊查询',
    },
  },
  customerName: {
    type: 'string',
    title: '客户经理',
    'x-component-props': {
      placeholder: '模糊查询',
    },
  },
  customerPhone: {
    type: 'string',
    title: '手机号码',
    'x-component-props': {
      placeholder: '精确查询',
    },
    'x-rules': 'phone',
  },
})

export const getColumns = () => [
  {
    title: '企业编码',
    dataIndex: 'orgId',
    width: 100,
  },
  {
    title: '企业名称',
    dataIndex: 'orgName',
    width: 120,
  },
  {
    title: '地市/区县',
    dataIndex: 'city',
    key: 'city',
  },
  {
    title: '客户经理',
    dataIndex: 'customerName',
  },
  {
    title: '客户经理手机号',
    dataIndex: 'customerPhone',
  },
]
