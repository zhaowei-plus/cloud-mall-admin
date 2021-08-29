export const getSchema = () => {
  return {
    name: {
      type: 'xm-string',
      title: '商品类别',
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '商品类别',
      dataIndex: 'name',
    },
  ]
}

export const getAddSchema = () => {
  return {
    name: {
      required: true,
      type: 'xm-string',
      title: '商品类别',
      'x-props': {
        maxLength: 4,
      },
    },
  }
}
