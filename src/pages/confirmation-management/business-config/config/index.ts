export const getColumns = () => {
  return [
    {
      title: '业务类型',
      dataIndex: 'bizType',
    },
    {
      title: '地区',
      dataIndex: 'regionName',
    },
    {
      title: '内容说明',
      dataIndex: 'content',
    },
  ]
}

export const getAddSchema = (isEdit, regions = []) => {
  return {
    bizType: {
      required: true,
      type: 'xm-string',
      title: '业务类型',
      'x-props': {
        maxLength: 20,
      },
    },
    regionCode: {
      editable: !isEdit,
      required: true,
      type: 'region-cascader',
      title: '地区',
      'x-props': {
        changeOnSelect: true,
        options: regions,
      },
    },
    content: {
      required: true,
      type: 'xm-textarea',
      title: '内容说明',
      'x-props': {
        placeholder: '请输入100字以内',
        maxLength: 100,
        autoSize: {
          minRows: 3,
        },
      },
    },
  }
}
