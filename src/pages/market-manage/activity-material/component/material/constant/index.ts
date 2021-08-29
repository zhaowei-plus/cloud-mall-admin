// 奖励配置
export const REWARD_CONFIG = [
  'fsReward', // 友好客户奖励配置
  'smReward', // 讯盟奖励配置
]

// 市场模式下需要隐藏的字段值
export const MARK_TYPE = {
  type: 2, // 市场模式
  hidden: [
    'targetSelect', // 目标客户选择
    'targetCustomer',
    'userTags',
    'friendType', // 友好客户转发
    'thumbnail', // 缩略图
    'QRcode', // 二维码活动图
  ],
}
