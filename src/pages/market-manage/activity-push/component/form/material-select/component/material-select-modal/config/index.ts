export const getSchema = () => {
  return {
    code: {
      type: 'string',
      title: '活动编码',
      'x-props': {
        placeholder: '请输入',
      },
    },
    titleLike: {
      type: 'string',
      title: '活动标题',
      'x-props': {
        placeholder: '请输入',
      },
    },
  }
}
