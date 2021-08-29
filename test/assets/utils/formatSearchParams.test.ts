import { formatSearchParams } from '../../../src/assets/utils'

const searchParams = {
  name: '张三',
  age: 10,
  sex: 1,
}

const targetParams = [
  {
    key: 'name',
    value: '张三',
  },
  {
    key: 'age',
    value: 10,
  },
  {
    key: 'sex',
    value: 1,
  },
]

describe('请求参数格式转换', () => {
  test('请求参数格式转换', () => {
    expect(formatSearchParams(searchParams)).toEqual(targetParams)
    expect(formatSearchParams()).toEqual([])
    expect(formatSearchParams({})).toEqual([])
    expect(formatSearchParams(null)).toEqual([])
    expect(formatSearchParams(undefined)).toEqual([])
  })
})
