export const STATUS = [
  { label: '待上架', value: 1 },
  { label: '未开始', value: 2 },
  { label: '进行中', value: 3 },
  { label: '已推送', value: 4 },
  { label: '已过期', value: 5 },
  { label: '已下架', value: 6 },
]

// 目标客户类型
export const TARGET_SELECT = [
  { value: 1, label: '选择文件' },
  { value: 5, label: '选择目标地市' },
  { value: 2, label: '选择客户群标签' },
]

// 奖励规则
export const REWARD_TYPES = [
  { value: 1, label: '按订单' },
  { value: 2, label: '按规则' },
]

// 可推送的用户
export const PUSH_USERS = [
  { label: '迅盟用户', value: 1 },
  { label: '客户经理', value: 2 },
]

// 活动类型
export const DATA_TYPE = [
  { label: '集团活动', value: 1 },
  { label: '市场活动', value: 2 },
]

// 办理模式
export const HANDLE_MODE = [{ label: '客户经理', value: 1 }]

// 友好客户
export const FRIEND_TYPE = [
  { label: '不支持', value: 0 },
  { label: '支持', value: 1 },
]

// 未开始、已推送、进行中，则只能编辑活动名称、短信内容、活动结束时间、公众号标题、公众号摘要
export const EDITABLE_FIELD = [
  'title', // 活动名称
  'smsContent', // 短信内容
  'validPeriod', // 活动有效期，但只有活动结束时间可编辑
  'publicTitle', // 公众号标题
  'publicAbstract', // 公众号摘要
]
