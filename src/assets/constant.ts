/************************全局状态定义*****************************/
// 省份类型
export const PROVINCE = {
  ZJ: 1, // 浙江
  CQ: 31, // 重庆
}

export const STATUS = [
  { label: '停用', value: 0 },
  { label: '启用', value: 1 },
]

// 核销状态
export const HX_STATUS = [
  { label: '待核销', value: 1 },
  { label: '已核销', value: 2 },
]

// 用户类别
export const USER_TYPES = [
  { label: '企业管理员', value: 1 },
  { label: '企业全员', value: 2 },
]

// 预约配置表单项是否显示的标志位
export const RESERVATION_VISIBLE = {
  companyName: 0b00000010, // 公司名称
  contactName: 0b00000100, // 联系人名称
  IDNumber: 0b00001000, // 身份证号
  IDPicture: 0b00010000, // 身份证正反面
  contactMobile: 0b00100000, // 联系人电话
  contactAddress: 0b01000000, // 公司名称
  reservationTime: 0b10000000, // 预约时间
}

// 预约配置
export const RESERVATION_CONFIG = [
  {
    label: '公司名称',
    value: RESERVATION_VISIBLE.companyName,
  },
  {
    label: '联系人姓名',
    value: RESERVATION_VISIBLE.contactName,
  },
  {
    label: '身份证号',
    value: RESERVATION_VISIBLE.IDNumber,
  },
  {
    label: '身份证正反面',
    value: RESERVATION_VISIBLE.IDPicture,
  },
  {
    label: '联系电话',
    value: RESERVATION_VISIBLE.contactMobile,
  },
  {
    label: '联系地址',
    value: RESERVATION_VISIBLE.contactAddress,
  },
  {
    label: '预约时间',
    value: RESERVATION_VISIBLE.reservationTime,
  },
]

// 用户角色
export const USER = {
  SUPER_ADMIN: 0, // 超管
  XM_USER: 3, // 讯盟用户
  PROVINCE_ADMIN: 4, // 省级管理员
  CITY_ADMIN: 5, // 市级管理员
  COUNTRY_ADMIN: 6, // 区县管理员
}

// 地区Level层级
export const REGION_LEVEL = {
  PROVINCE: 2, // 省级
  CITY: 3, // 市级
  COUNTRY: 4, // 区县级
}

/************************全局类型定义*****************************/
export interface IStore {
  loading: number
}
// 通用response 返回类型
export interface IResponse {
  code: number
  success: boolean
  data?: any
  msg?: string
}

// 页面Search返回的搜索栏配置项
export interface IParams {
  flag: number
  name: string
  type: number
  key: string
  mapValue?: object
}

export interface ISearchResponse {
  success: boolean
  data: Array<IParams>
}

// 表单注册类型
export interface IField {
  value: string
  mutators: {
    change: (params: any) => void
  }
  editable?: boolean
}

export interface IForm {
  value: string
  disabled?: boolean
  placeholder: string
  onChange: (params: any) => void
  [key: string]: any
}

// 表单提交类型
export interface ISubmit {
  [key: string]: any
}

// 枚举配置
export interface IItem {
  label?: string
  value?: number | string
  [key: string]: string | number
}

// 列表搜索时的参数项
export interface ITableParams {
  key: string
  value: number | string
}
