import NP from 'number-precision'
import cloneDeep from 'lodash/cloneDeep'
import { Base64 } from 'js-base64'
import store from '@/store'

// 拆分解析pathname为path
export const formatPath = (pathname = '') => {
  return pathname
    .split('/')
    .filter(Boolean)
    .map(
      (d: any, index: number, arr: any) =>
        `/${arr.slice(0, index + 1).join('/')}`
    )
}

// 获取菜单对应的key
export const getMenuKey = (routes = [], paths = []) => {
  let menuKey = []

  const calcMenuKey = (routes = [], paths = []) => {
    routes.some(({ key, path, children }) => {
      if (paths.includes(path)) {
        menuKey.push(key)
        if (Array.isArray(children) && children.length > 0) {
          calcMenuKey(children, paths)
        }
        return true
      }
      return false
    })
  }

  calcMenuKey(routes, paths)
  return menuKey
}

/**
 * 数字格式化为千分位
 * @param {number} targetNumber - 待格式化的数值
 * @param {number} fractionDigits - 保留小数位数
 * @returns {string} - 格式化之后的字符串
 * @example
 * formatThousandsSeparator(1000) === 1,000
 * @example
 * formatThousandsSeparator(1000, 2) === 1,000.00
 */
export const formatThousandsSeparator = (
  targetNumber: number,
  fractionDigits = 2
) => {
  if (!targetNumber && targetNumber !== 0) {
    return ''
  }

  if (targetNumber === 0) {
    return 0
  }

  let minus = false
  /**
   * 兼容负数
   */
  if (targetNumber < 0) {
    minus = true
    targetNumber = Math.abs(targetNumber)
  }
  fractionDigits =
    fractionDigits >= 0 && fractionDigits <= 20 ? fractionDigits : 2
  /**
   * replace(/[^\d\.-]/g, '')
   * 匹配 除数字、逗号（,）、短横线（ - 负数符号）之外的字符串,替换成''
   * eq: 'a123'.replace(/[^\d\.-]/g, '') === 123
   * eq: 'a123bc'.replace(/[^\d\.-]/g, '0') === 012300
   * eq: 'a123-'.replace(/[^\d\.-]/g, '0') === 0123-
   */
  targetNumber = `${parseFloat(
    `${targetNumber}`.replace(/[^\d\.-]/g, '')
  ).toFixed(fractionDigits)}`
  const reversedSplitNumber = targetNumber
    .split('.')[0]
    .split('')
    .reverse()
  // 小数位
  const decimalPlace = targetNumber.split('.')[1]
  let reversedString = ''
  for (let i = 0; i < reversedSplitNumber.length; i += 1) {
    reversedString +=
      reversedSplitNumber[i] +
      ((i + 1) % 3 === 0 && i + 1 !== reversedSplitNumber.length ? ',' : '')
  }
  /**
   * 兼容负数和整数
   */
  return `${minus ? '-' : ''}${reversedString
    .split('')
    .reverse()
    .join('')}${decimalPlace ? `.${decimalPlace}` : ''}`
}

/**
 * 金额格式化转换
 *  元转分
 *  分转元（默认千分位格式化，并保留2位小数）
 * @param {number} money -  金额(元/分)
 * @param {string} mode - 模式：'toYuan'（分->元）'toCent'（元->分），默认是 'toYuan'
 * @params {object} config - 转换配置项
 *    @param {boolean} thousandsSeparator -  是否需要格式化成千分位,默认为true
 *    @param {number} fractionDigits  - 保留小数位数,默认为2
 *    @param {string} illegalCharacter  - 非法数据是展示的字符
 *
 * @returns {number | string} 转换之后的金额 / 格式化之后的千分位值
 *
 * @example  分转元
 * formatCentToYuan(100000) === '1,000.00'
 * @example
 * formatCentToYuan(100000, 'toYuan', { thousandsSeparator: false }) === '1000.00'
 * @example
 * formatCentToYuan(100000, 'toYuan', { thousandsSeparator: false, fractionDigits: 3 }) === '1000.000'
 *
 * @example 分转元
 * formatCentToYuan(1000, 'toCent') === 100000
 * @example 分转元
 * formatCentToYuan(1000.02, 'toCent') === 100002
 */
interface IMoneyConfig {
  thousandsSeparator?: boolean
  fractionDigits?: number
  illegalCharacter?: string
}

export const formatMoney = (
  money?: number | string,
  mode? = 'toYuan',
  config?: IMoneyConfig = {}
) => {
  const {
    thousandsSeparator = true,
    fractionDigits = 2,
    illegalCharacter = '-',
  } = config

  if (isNaN(money)) {
    return illegalCharacter
  }

  switch (mode) {
    case 'toYuan': {
      const yuan = NP.round(NP.divide(money, 100), fractionDigits)
      if (!thousandsSeparator) {
        return yuan
      }
      return formatThousandsSeparator(yuan, fractionDigits)
    }
    case 'toCent': {
      return NP.round(NP.times(Number(money), 100), 0)
    }
    default:
      return illegalCharacter
  }
}

/**
 * 格式化schema中的placeholder提示信息
 * @param {object} schema - formily用到的json schema，格式如下：
 * {
 *     name: {
 *         type: 'string',
 *         xxxx
 *     },
 *     age: {
 *         type: 'string',
 *         xxxx
 *     },
 * }
 *
 * @return 格式化之后的schema
 */
export const formatFormSchema = (schema: any) => {
  const newSchema = cloneDeep(schema)
  Object.keys(newSchema).forEach((key: string) => {
    const item = newSchema[key]

    if (
      ['string', 'xm-string', 'xm-number', 'xm-textarea'].includes(item.type)
    ) {
      if (!Reflect.has(item, 'x-props')) {
        item['x-props'] = {}
      }

      if (!Reflect.has(item['x-props'], 'placeholder')) {
        if (Array.isArray(item.enum)) {
          item['x-props'].placeholder = '请选择'
          item['x-props'].getPopupContainer = node => node.parentNode
          if (!Reflect.has(item['x-props'], 'allowClear')) {
            item['x-props'].allowClear = true
          }
        } else {
          item['x-props'].placeholder = '请输入'
        }
      }
    }
  })

  return newSchema
}

/**
 * 清理对象参数值，过滤不合法参数
 * @params {object} params - 待清理的对象
 * @params {array} filters - 清理的值信息，默认当值为[null, undefined, NaN, '']中的任意值时，该字段被清理掉
 * @returns {object} 清理之后的独显
 *
 * @example
 *
 * const params = {
 *  name: '',
 *  age: 10,
 *  desc: null
 * }
 * clearObject(params) ==> { age: 10 }
 */
export const clearObject = (
  params: object,
  filters = [null, undefined, NaN, '']
) => {
  if (params instanceof Object) {
    const newParams = {}
    Object.keys(params).forEach(key => {
      // 注：这里只对对象字段进行过滤，对数组不做任何处理，只能通过构造函数区分
      if (
        typeof params[key] === 'object' &&
        params[key].constructor === Object
      ) {
        newParams[key] = clearObject(params[key], filters)
      } else if (!filters.includes(params[key])) {
        newParams[key] = params[key]
      }
    })
    return newParams
  }
  return params
}

/**
 * 格式化搜索参数，用于搜索列表数据
 * @params {object} params - 待清理的对象
 * @params {array} filters - 清理的值信息，默认当值为[null, undefined, NaN, '']中的任意值时，该字段被清理掉
 * @returns {object} 清理之后的独显

 * clearObject(params) ==> { age: 10 }
 */
export const formatSearchParams = (params = {}) => {
  if (params) {
    return Object.keys(params).map((key: string) => ({
      key,
      value: params[key],
    }))
  }
  return []
}

/**
 * 校验图片大小
 *  @param {string} url 图片地址 https://global.uban360.com/sfs/file?digest=fid1067e1c4978385c01d206e14d0b2a3ec&fileType=2
 *  @param {number} width 固定宽度
 *  @param {number} height 固定高度
 *
 *  @return promise
 * */
export const validImgSize = (url, width, height) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.onload = () => {
      if (width === image.width && height === image.height) {
        resolve(true)
      } else {
        reject({ width: image.width, height: image.height })
      }
    }
  })

export const formatMatchValue = (
  key,
  source = [],
  keyName = 'value',
  valueName = 'label'
) => {
  const item = source.find(item => {
    return item[`${keyName}`] === key
  })

  if (item) {
    return item[`${valueName}`]
  } else {
    return '-'
  }
}

export const downloadFile = (data: any, fileName: string) => {
  const url = window.URL.createObjectURL(new Blob([data]))
  const aDom = document.createElement('a')
  aDom.style.display = 'none'
  aDom.href = url
  aDom.setAttribute('download', fileName)
  document.body.appendChild(aDom)
  aDom.click()
  document.body.removeChild(aDom)
}

/* 用base64实现html编解码，历史数据用正则表达式实现html编解码 */
export const htmlCodec = {
  isBase64: (str: string) => {
    if (str === '' || str.trim() === '') {
      return false
    }
    try {
      return btoa(atob(str)) === str
    } catch (err) {
      return false
    }
  },
  encode: (str: string = '') => {
    return Base64.encode(str)
  },
  decode: (str: string = '') => {
    try {
      if (htmlCodec.isBase64(str)) {
        return Base64.decode(
          str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&nbsp;/g, ' ')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
        )
      }
      return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
    } catch (error) {
      console.error('error:', error)
    }
  },
}

// 格式化地市：截取想要的层级
export const formatRegions = (level, options?) => {
  const regions = options || store.getState().regions
  const interceptRegionsTree = (regions: any = []) => {
    return regions.map((item, i) => {
      const { children = [], ...rest } = item
      const isEnd = level && rest.level === level
      return {
        ...item,
        children: !isEnd ? interceptRegionsTree(children) : undefined,
      }
    })
  }
  if (level) {
    return interceptRegionsTree(regions)
  }
  return regions
}

// 回溯计算路径：用于数据回显
export const formatRegionPath = (
  regionCode,
  field = 'value',
  level?,
  options?
) => {
  const regions = options || store.getState().regions
  const path = []
  ;(function calcPath(regionCode, regions) {
    return regions.some(item => {
      const { value, children = [], ...rest } = item
      if (level && rest.level > level) {
        return false
      }
      if (regionCode === value) {
        path.push(item[`${field}`])
        return true
      } else {
        const isFind = calcPath(regionCode, children)
        if (isFind) {
          path.push(item[`${field}`])
        }
        return isFind
      }
    })
  })(Number(regionCode), regions)
  return path.reverse()
}

export const formatRegionName = regionCode => {
  const regionPath = formatRegionPath(regionCode, 'label')
  return regionPath.pop()
}

// 展开地市数据: 用于数据搜索
export const flatRegion = level => {
  const regions = store.getState().regions
  const flatRegions = []
  const _flatRegions = (regions: any = []) => {
    return regions.map((item, i) => {
      const { children = [], ...rest } = item
      flatRegions.push(rest)
      const isEnd = level && rest.level === level
      return {
        ...item,
        children: !isEnd ? _flatRegions(children) : undefined,
      }
    })
  }
  _flatRegions(regions)
  return flatRegions
}

export const formatEChartOption = (xAxisValue = [], yAxisValue = []) => {
  return {
    xAxis: {
      type: 'category',
      data: xAxisValue,
    },
    tooltip: {
      trigger: 'axis',
    },
    yAxis: {
      type: 'value',
      max: Math.max(...yAxisValue),
      min: Math.min(...yAxisValue),
    },
    series: {
      type: 'line',
      data: yAxisValue,
    },
  }
}

export const flatMenuPage = (menus = []) => {
  const calcPagePath = (routes = [], key) => {
    return routes.reduce((result, route) => {
      const { path, children = [] } = route
      if (children.length > 0) {
        return { ...result, ...calcPagePath(children, key) }
      } else {
        result[path] = { menu: key, resourceId: route.key }
      }
      return result
    }, {})
  }

  return menus.reduce((result, menu) => {
    const { key, children = [] } = menu
    return {
      ...result,
      ...calcPagePath(children, key),
    }
  }, {})
}
