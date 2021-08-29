import { formatFormSchema } from '../../../src/assets/utils'

const orgSchema = {
  name: {
    title: '姓名',
    type: 'string',
  },
  age: {
    title: '年龄',
    type: 'string',
  },
  sex: {
    title: '性别',
    type: 'string',
    enum: [
      { label: '男', value: 1 },
      { label: '女', value: 2 },
    ],
    default: 1,
  },
}

const targetSchema = {
  name: {
    title: '姓名',
    type: 'string',
    'x-props': {
      placeholder: '请输入',
    },
  },
  age: {
    title: '年龄',
    type: 'string',
    'x-props': {
      placeholder: '请输入',
    },
  },
  sex: {
    title: '性别',
    type: 'string',
    enum: [
      { label: '男', value: 1 },
      { label: '女', value: 2 },
    ],
    default: 1,
    'x-props': {
      placeholder: '请选择',
    },
  },
}

describe('表单Schema批量添加placeholder', () => {
  test('placeholder格式化', () => {
    expect(formatFormSchema(orgSchema)).toEqual(targetSchema)
    expect(formatFormSchema(targetSchema)).toEqual(targetSchema)
  })
})
