export const STATUS = [
  { label: '初始化', value: 0 },
  { label: '推送中', value: 1 },
  { label: '推送成功(部分失败)', value: 2 },
  { label: '全部推送成功', value: 3 },
  { label: '推送失败', value: 4 },
]

// 下发范围模式
export const PUBLISH_RANGE = [
  { value: 1, label: '精准下发（单个输入）' },
  { value: 2, label: '精准下发（批量导入）' },
  { value: 6, label: '目标客户名单选择' },
  { value: 4, label: '目标名单选择' },
  { value: 5, label: '客户群标签用户' },
]

// 推送人群
export const PUSH_USERS = [
  { value: 2, label: '集团成员' },
  { value: 1, label: '友好客户' },
  { value: 3, label: '市场目标客户' },
]

// 免费短信
export const FREE_SMS = {
  GROUP: '【渝企信】专属优惠活动来袭，快点击活动链接办理吧',
  FRIEND:
    '【渝企信】友好客户您好，有新的优惠活动来了，快登录渝企信去分享领彩豆吧',
}

// 模式字符串映射
export const SUBSCRIPT_MAP = {
  0: '模式一',
  1: '模式二',
  2: '模式三',
  3: '模式四',
  4: '模式五',
}
