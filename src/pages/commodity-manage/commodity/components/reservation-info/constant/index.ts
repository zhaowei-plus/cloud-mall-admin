// 购买方式
export const BUY_TYPES = [{ label: '线上购买', value: 1 }]

// 渝企信省份
export const CY_PROVINCES = {
  1: { label: '渝企信', value: 1 },
  18: { label: '八桂彩云', value: 18 },
}

// 用户类别
export const USER_TYPES = [
  { label: '企业管理员', value: 1 },
  { label: '企业全员', value: 2 },
]

export const RESERVATION_CONFIG = [
  {
    label: '公司名称',
    value: 0b00000010,
  },
  {
    label: '联系人姓名',
    value: 0b00000100,
  },
  {
    label: '身份证号',
    value: 0b00001000,
  },
  {
    label: '身份证正反面',
    value: 0b00010000,
  },
  {
    label: '联系电话',
    value: 0b00100000,
  },
  {
    label: '联系地址',
    value: 0b01000000,
  },
  {
    label: '预约时间',
    value: 0b10000000,
  },
]
