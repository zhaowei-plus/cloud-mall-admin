import { formatMoney } from 'src/assets/utils'

describe('格式化金额', () => {
  test('格式化金额 分 -> 元', () => {
    expect(formatMoney(1000000)).toBe('10,000.00')
    expect(
      formatMoney(1000000, 'toYuan', {
        thousandsSeparator: false,
      })
    ).toBe(10000.0)
    expect(
      formatMoney(1000000, 'toYuan', {
        thousandsSeparator: true,
      })
    ).toBe('10,000.00')
    expect(
      formatMoney(1000000, 'toYuan', {
        thousandsSeparator: true,
        fractionDigits: 3,
      })
    ).toBe('10,000.000')
  })

  test('格式化金额 元 -> 分', () => {
    expect(formatMoney(10000, 'toCent')).toBe(1000000)
    expect(
      formatMoney(10000, 'toCent', {
        thousandsSeparator: true,
      })
    ).toBe(1000000)
    expect(
      formatMoney(10000, 'toCent', {
        thousandsSeparator: true,
        fractionDigits: 3,
      })
    ).toBe(1000000)
  })

  test('格式化金额 异常校验', () => {
    expect(formatMoney()).toBe('-')
    expect(formatMoney(0, 'toYuan')).toBe('-')
    expect(
      formatMoney('', 'toYuan', {
        thousandsSeparator: true,
      })
    ).toBe('-')
    expect(
      formatMoney('', 'toYuan', {
        thousandsSeparator: true,
        illegalCharacter: '￥',
      })
    ).toBe('￥')

    expect(formatMoney('', 'toCent')).toBe('-')
    expect(
      formatMoney('', 'toCent', {
        thousandsSeparator: true,
      })
    ).toBe('-')
    expect(
      formatMoney('', 'toCent', {
        thousandsSeparator: true,
        illegalCharacter: '￥',
      })
    ).toBe('￥')
  })
})
