import { PAY_STATUS, ORDER_STATUS } from '../constant'
import { HX_STATUS, RESERVATION_VISIBLE } from '@/assets/constant'
import { formatMatchValue, formatFormSchema, formatMoney } from '@/assets/utils'
import { factoryValidLength, moneyValidLength } from '@/assets/validator'

export const getSchema = (supply: any) => {
  return {
    orderId: {
      type: 'xm-string',
      title: '订单编号',
    },
    createrName: {
      type: 'xm-string',
      title: '办理人姓名',
    },
    createrMobile: {
      type: 'string',
      title: '手机号',
    },
    createrCompany: {
      type: 'xm-string',
      title: '办理人公司',
    },
    skuCode: {
      type: 'xm-string',
      title: '产品编码',
    },
    itemCode: {
      type: 'xm-string',
      title: '商品编码',
    },
    supplyId: {
      type: 'string',
      title: '收款方公司',
      enum: supply.dataSource,
      default: supply.default,
    },
    '[createTimeStart,createTimeEnd]': {
      type: 'daterange',
      title: '下单时间',
    },
    payStatus: {
      type: 'string',
      title: '付款状态',
      enum: PAY_STATUS,
    },
    reserveStatus: {
      type: 'string',
      title: '订单状态',
      enum: ORDER_STATUS,
      'x-props': {
        // autoClear: true,
      },
    },
    auditStatus: {
      type: 'string',
      title: '核销状态',
      enum: HX_STATUS,
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '订单编号',
      dataIndex: 'orderId',
    },
    {
      title: '办理人姓名',
      dataIndex: 'createrName',
    },
    {
      title: '手机号',
      dataIndex: 'createrMobile',
    },
    {
      title: '办理人公司',
      dataIndex: 'createrCompany',
    },
    {
      title: '产品编码',
      dataIndex: 'skuCode',
    },
    {
      title: '产品名称',
      dataIndex: 'skuName',
    },
    {
      title: '商品编码',
      dataIndex: 'itemCode',
    },
    {
      title: '商品名称',
      dataIndex: 'itemName',
    },
    {
      title: '收款方公司',
      dataIndex: 'supplyName',
    },
    {
      title: '产品价格（元）',
      key: 'originalPrice',
      render: record => {
        const { priceType, originalPrice, customPriceDesc } = record
        if (priceType === 1) {
          return formatMoney(originalPrice)
        }
        if (priceType === 2) {
          return customPriceDesc
        }
      },
    },
    {
      title: '实付款（元）',
      dataIndex: 'paidPrice',
      render: text => formatMoney(text),
    },
    {
      title: '下单时间',
      dataIndex: 'gmtCreate',
    },
    {
      title: '付款状态',
      dataIndex: 'payStatus',
      render: text => formatMatchValue(text, PAY_STATUS),
    },
    {
      title: '付款时间',
      dataIndex: 'paidTime',
    },
    {
      title: '订单状态',
      dataIndex: 'reserveStatus',
      render: text => formatMatchValue(text, ORDER_STATUS),
    },
    {
      title: '处理结果',
      dataIndex: 'handleResult',
    },
    {
      title: '核销状态',
      dataIndex: 'auditStatus',
      render: text => formatMatchValue(text, HX_STATUS),
    },
  ]
}

export const getProcessConfig = (config, payStatus, editable) => {
  // 金额校验
  const validPaidPrice = value => {
    if (isNaN(value)) {
      return '请输入正确的金额'
    } else if (Number(value) > 0) {
      const valueSplit = value.toString().split('.')
      if (valueSplit[0].length > 10) {
        return '金额最多10位数字'
      }

      if (valueSplit.length === 2) {
        if (valueSplit[1].length > 2) {
          return '金额最多2位小数'
        }
      }
    }
  }

  return {
    // 订单信息
    orderDetail: formatFormSchema({
      orderId: {
        type: 'xm-string',
        title: '订单编号',
      },
      skuName: {
        type: 'xm-string',
        title: '产品名称',
      },
      gmtCreate: {
        type: 'date',
        title: '下单时间',
      },
      priceType: {
        type: 'string',
        title: '产品价格',
        display: false,
        enum: [
          { label: '常规价格', value: 1 },
          { label: '自定义描述', value: 2 },
        ],
      },
      originalPrice: {
        type: 'xm-string',
        title: '产品价格',
        visible: false,
        'x-props': {
          addonAfter: '（元）',
        },
      },
      customPriceDesc: {
        type: 'xm-string',
        title: '产品价格',
        visible: false,
      },
      paidPrice: {
        type: 'xm-string',
        title: '实付款',
        editable: payStatus === 1 && editable, // 待付款是需要输入实付款
        'x-props': {
          addonAfter: '（元）',
        },
        'x-rules': [{ validator: validPaidPrice }],
      },
      payStatus: {
        type: 'string',
        title: '付款状态',
        enum: PAY_STATUS,
      },
      createrName: {
        type: 'xm-string',
        title: '购买人员',
      },
      createrMobile: {
        type: 'xm-string',
        title: '手机号码',
      },
      createrCompany: {
        type: 'xm-string',
        title: '公司名称',
      },
    }),
    // 预约信息
    reserveInfo: formatFormSchema({
      companyName: {
        type: 'xm-string',
        title: '公司名称',
        visible: Boolean(config & RESERVATION_VISIBLE.companyName),
        'x-rules': [{ validator: factoryValidLength(20) }],
      },
      contactName: {
        type: 'xm-string',
        title: '联系人姓名',
        visible: Boolean(config & RESERVATION_VISIBLE.contactName),
        'x-rules': [{ validator: factoryValidLength(10) }],
      },
      contactPhone: {
        type: 'xm-string',
        title: '联系电话',
        visible: Boolean(config & RESERVATION_VISIBLE.contactMobile),
        'x-rules': [{ validator: factoryValidLength(20) }],
      },
      contactAddress: {
        type: 'xm-string',
        title: '联系地址',
        visible: Boolean(config & RESERVATION_VISIBLE.contactAddress),
        'x-rules': [{ validator: factoryValidLength(30) }],
      },
      planTime: {
        type: 'date',
        title: '预约时间',
        visible: Boolean(config & RESERVATION_VISIBLE.reservationTime),
        'x-props': {
          format: 'YYYY-MM-DD HH:mm',
          showTime: true,
        },
      },
      idCard: {
        type: 'string',
        title: '身份证号',
        visible: Boolean(config & RESERVATION_VISIBLE.IDNumber),
        'x-rules': [{ validator: factoryValidLength(18) }],
      },
    }),
    // 处理结果
    resultInfo: {
      handleResult: {
        type: 'xm-string',
        'x-component': 'TextArea',
        'x-props': {
          placeholder: '请输入处理结果',
        },
        'x-rules': [{ validator: factoryValidLength(30) }],
      },
    },
  }
}
