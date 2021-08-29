export interface IItem {
  img?: String
  itemName?: String
  itemId?: Number
  remark?: String
}

export interface IMode {
  moduleType: Number
  moduleName: String
  moduleExplain: String
  item: Array<IItem>
}

export interface ICommodity {
  label: string
  value: number
  [key: string]: any
}

export const ACTION = {
  ADD: 1,
  EDIT: 2,
}

export const MODULE_TYPE = {
  BANNER: 1, // banner 样式
  COMMODITY: 2, // 单行单商品
  COMMODITY_2: 3, // 单行双商品
  COMMODITY_4: 4, // 单行四商品
}
