export const getAddSchema = () => {
  return {
    bizType: {
      required: true,
      type: 'xm-string',
      title: '业务类型',
      'x-props': {
        maxLength: 20,
      },
    },
    content: {
      required: true,
      type: 'xm-textarea',
      title: '业务内容',
      'x-props': {
        maxLength: 100,
      },
    },
  }
}
