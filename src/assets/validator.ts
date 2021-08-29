// 校验手机号码格式
export const validMobile = (value: string) => {
  if (value) {
    if (!/^1[3456789]\d{9}$/.test(value)) {
      return '请输入11位手机号码'
    }
  }
  return ''
}

export const factoryValidLength = length => (value: string) => {
  if (value) {
    if (value.toString().length > length) {
      return `请输入${length}位以內字符`
    }
  } else {
    return '该字段是必填字段'
  }
}

// 金额校验
export const moneyValidLength = length => (value: string) => {
  if (Number(value) > 0) {
    const valueSplit = value.toString().split('.')
    if (valueSplit[0].length > length) {
      return `金额最多${length}位数字`
    }

    if (valueSplit.length === 2) {
      if (valueSplit[1].length > 2) {
        return '金额最多2位小数'
      }
    }
  } else {
    return '请输入正确的金额'
  }
}
