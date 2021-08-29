import { RESERVATION_CONFIG } from '@/assets/constant'

// 商品信息校验
export const validCommodityInfo = (params: any = {}) => {
  const {
    itemImg,
    name,
    catId = -1,
    supplierId,
    buyType,
    caiyunType,
    userType,
    itemInst,
  } = params

  // 校验商品ICON
  if (!itemImg) {
    return '请上传商品Icon'
  }

  // 校验商品名称
  if (!name) {
    return '请输入商品名称'
  } else if (name.length > 15) {
    return '商品名称最长15个字符'
  }

  // 校验商品类别
  // if (isNaN(catId)) {
  //   return '请选择商品类别'
  // }

  // 校验收款方公司
  if (isNaN(supplierId)) {
    return '请选择收款方公司'
  }

  // 校验购买方式
  if (isNaN(buyType)) {
    return '请选择购买方式'
  }

  // 校验渝企信省份
  if (isNaN(caiyunType)) {
    return '请选择渝企信省份'
  }

  // 校验用户类别
  if (isNaN(userType)) {
    return '请选择用户类别'
  }

  // 校验商品说明
  if (!itemInst) {
    return '请输入商品说明'
  } else if (itemInst.length > 30) {
    return '商品说明最长30个字符'
  }

  return ''
}

// 校验商品简介
export const validCommoditySummary = (params: any = {}) => {
  const { introduction } = params
  if (!introduction) {
    return '请输入商品简介'
  }
  return ''
}

// 校验产品管理
export const validProductManage = (params: any = {}) => {
  const { skuList = [] } = params
  if (skuList.length === 0) {
    return '产品管理至少有一条产品信息'
  }

  return ''
}

// 校验预约信息
export const validReservationInfo = (params: any = {}) => {
  const { status, configFields = [] } = params
  if (status === 1 && configFields.length === 0) {
    return '支持商品预约时，至少勾选一个预约字段'
  }

  return ''
}

export const ReservationConfig = {
  // 解析请求返回的数据
  analyze: (config: number) => {
    const status = config & 1
    const configFields = RESERVATION_CONFIG.reduce(
      (result: Array<number> = [], d: any) => {
        if (d.value & config) {
          result.push(d.value)
        }
        return result
      },
      []
    )

    return {
      status,
      configFields,
    }
  },
  // 格式化数据
  format: (params: any = {}) => {
    const { status, configFields = [] } = params
    return configFields.reduce((result: number, d: any) => result | d, status)
  },
}
