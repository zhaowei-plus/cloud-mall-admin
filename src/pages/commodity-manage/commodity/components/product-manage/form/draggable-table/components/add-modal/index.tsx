import React, { useMemo } from 'react'
import { Modal } from 'antd'
import {
  SchemaForm,
  createFormActions,
  SchemaMarkupField as Field,
} from '@formily/antd'
import { FormTextBox, Input, Select } from '@formily/antd-components'
import { getExpressionScope } from '../../config'
import components from './form'
import useEffects from './effects'
import { formatMoney } from '@/assets/utils'

import './index.less'

interface IProps {
  params?: {
    detail?: {
      [key: string]: any
    }
    index?: number
  }
  onCancel: () => void
  onOk: (params: object) => void
}

export default (props: IProps) => {
  const { params = {}, onCancel, onOk } = props
  const { detail, index } = params
  const actions = useMemo(() => createFormActions(), [])

  const isValidArray = (value: Array<any>) => {
    return Array.isArray(value) && value.includes(-1)
  }

  const handleSubmit = (params: any = {}) => {
    const {
      orgNumConfig,
      useNumConfig,
      capacityConfig,
      numConfig,
      timelinessConfig,
      productConfig,
      favorableConfig,
      stockConfig,
      salePrice,
      originalPrice,
      ...rest
    } = params

    // 企业人数范围
    const orgNum: any = {
      peopleNumLimit: isValidArray(orgNumConfig.noLimit) ? -1 : 0, // -1 规格不限
    }
    if (orgNum.peopleNumLimit === 0) {
      orgNum.peopleNumMin = orgNumConfig.range.min
      orgNum.peopleNumMax = orgNumConfig.range.max
    }

    // 使用人数范围 useNumConfig
    const useNum: any = {
      usePeopleNum: isValidArray(useNumConfig.noLimit) ? -1 : useNumConfig.num, // -1 规格不限
    }

    //  容量限制
    const capacity: any = {
      capacityLimit: isValidArray(capacityConfig.noLimit) ? -1 : 0, // -1 规格不限
    }
    if (capacity.capacityLimit === 0) {
      capacity.capacity = capacityConfig.num
      capacity.capacityUnit = capacityConfig.unit
    }

    //  数量限制
    const num = isValidArray(numConfig.noLimit) ? -1 : numConfig.num

    // 时效性限制
    const timeliness: any = {
      timelinessLimit: isValidArray(timelinessConfig.noLimit) ? -1 : 0, // -1 规格不限
    }
    if (timeliness.timelinessLimit === 0) {
      timeliness.timeliness = timelinessConfig.num
      timeliness.timelinessUnit = timelinessConfig.unit
    }

    // 产品价格
    const product = {
      priceType: productConfig.status,
      customPriceDesc: productConfig.input,
      salePrice:
        productConfig.status === 1
          ? formatMoney(productConfig.price, 'toCent')
          : undefined,
    }

    // 优惠价
    const favorable: any = {
      activityPrice:
        favorableConfig.status === 1
          ? formatMoney(favorableConfig.amount, 'toCent')
          : -1, // -1 不支持
    }

    // 库存
    const stock = isValidArray(stockConfig.noLimit) ? -1 : stockConfig.num

    rest.salePrice = formatMoney(salePrice, 'toCent')
    rest.originalPrice = formatMoney(originalPrice, 'toCent')

    const formatParams = {
      ...rest,
      ...orgNum,
      ...useNum,
      ...capacity,
      ...timeliness,
      ...product,
      ...favorable,
      num,
      stock,
    }
    onOk(formatParams)
  }

  // 金额校验
  const moneyValidator = length => value => {
    if (value > 0) {
      const valueSplit = value.toString().split('.')
      if (valueSplit[0].length > length) {
        return `金额最多${length}位整数`
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

  // 库存校验
  const stockValidator = value => {
    if (value > 0) {
      if (!/(^[1-9]\d*$)/.test(value)) {
        return '可销库存数必须是大于0的整数'
      } else if (value > 20000000) {
        return '最大值为20000000'
      }
    } else {
      return '请输入正确的库存数量'
    }
  }

  const initialValues = useMemo(() => {
    if (detail) {
      const {
        peopleNumMin,
        peopleNumMax,
        peopleNumLimit,
        usePeopleNum,
        capacityLimit,
        capacity,
        capacityUnit,
        num,
        timelinessLimit,
        timeliness,
        timelinessUnit,
        activityPrice,
        stock,
        priceType,
        customPriceDesc,
        salePrice,
        originalPrice,
        ...rest
      } = detail

      // 企业人数范围
      const orgNumConfig: any = {
        noLimit: [peopleNumLimit],
        range: {},
      }
      if (Number(peopleNumLimit) !== -1) {
        orgNumConfig.range = {
          min: peopleNumMin,
          max: peopleNumMax,
        }
      }

      // 使用人数范围
      const useNumConfig = {
        noLimit: usePeopleNum === -1 ? [-1] : [],
        num: undefined,
      }
      if (usePeopleNum !== -1) {
        useNumConfig.num = usePeopleNum
      }

      // 容量配置
      const capacityConfig: any = {
        noLimit: [capacityLimit],
        unit: ['M'], // 默认值
      }
      if (Number(capacityLimit) !== -1) {
        capacityConfig.num = capacity
        capacityConfig.unit = capacityUnit
      }
      // 数量限制
      const numConfig = {
        num,
        noLimit: [num],
      }

      // 时效性限制
      const timelinessConfig: any = {
        noLimit: [timelinessLimit],
        unit: ['日'], // 默认值
      }
      if (Number(timelinessLimit) !== -1) {
        timelinessConfig.num = timeliness
        timelinessConfig.unit = timelinessUnit
      }

      // 产品价格
      const productConfig = {
        status: priceType,
        input: customPriceDesc,
        price:
          priceType === 1
            ? formatMoney(salePrice, 'toYuan', {
                thousandsSeparator: false,
              })
            : '',
      }

      // 优惠价
      const favorableConfig = {
        status: activityPrice === -1 ? 0 : 1,
        amount:
          activityPrice !== -1
            ? formatMoney(activityPrice, 'toYuan', {
                thousandsSeparator: false,
              })
            : '',
      }

      // 可销售库存
      const stockConfig = {
        num: stock,
        noLimit: [stock],
      }

      return {
        ...rest,
        orgNumConfig,
        useNumConfig,
        capacityConfig,
        numConfig,
        timelinessConfig,
        productConfig,
        favorableConfig,
        stockConfig,
        salePrice: salePrice
          ? formatMoney(salePrice, 'toYuan', {
              thousandsSeparator: false,
            })
          : '',
        originalPrice: originalPrice
          ? formatMoney(originalPrice, 'toYuan', {
              thousandsSeparator: false,
            })
          : '',
        index,
      }
    }
    return {
      favorableConfig: {
        status: 0,
      },
      capacityConfig: {
        unit: 'M',
      },
      timelinessConfig: {
        unit: '日',
      },
      productConfig: {
        status: 1,
      },
    }
  }, [params])

  const orgNumValidator = value => {
    if (!value) {
      return '请输入人数范围'
    } else {
      const { min, max } = value
      if (!min) {
        return '请输入有效最小值'
      } else if (!/(^[1-9]\d*$)/.test(min) || min.toString().length > 8) {
        return '最小值需为8位以内正整数'
      }

      if (!max) {
        return '请输入有效最大值'
      } else if (!/(^[1-9]\d*$)/.test(max) || max.toString().length > 8) {
        return '最大值需为8位以内正整数'
      }

      if (max < min) {
        return '最大值需不小于最小值'
      }
    }
  }

  // 正整数长度判断
  const posIntegerValidator = length => value => {
    if (!/(^[1-9]\d*$)/.test(value) || value.toString().length > length) {
      return `请输入${length}位内正整数`
    }
  }

  const isAdd = !detail

  return (
    <Modal
      visible
      centered
      width={630}
      onCancel={onCancel}
      maskClosable={false}
      wrapClassName="add-modal"
      onOk={() => actions.submit()}
      title={`${isAdd ? '新增' : '修改'}产品`}
    >
      <SchemaForm
        labelCol={7}
        wrapperCol={16}
        actions={actions}
        effects={useEffects}
        validateFirst={true}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        components={{ ...components, Input, Select }}
        expressionScope={getExpressionScope()}
        previewPlaceholder="暂无数据"
      >
        <Field
          editable={false}
          type="string"
          name="skuCode"
          title="产品编码"
          visible={!isAdd}
        />
        <Field
          required
          type="xm-textarea"
          name="name"
          title="产品名称"
          x-props={{
            placeholder: '请输入产品名称',
            maxLength: 15,
            style: {
              width: 220,
            },
            autoSize: {
              minRows: 1,
              maxRows: 1,
            },
          }}
        />
        <FormTextBox
          required
          title="企业人数范围"
          text="%s%s%s"
          className="xm-form-text-box"
        >
          <Field
            type="string"
            name="orgNumConfig.numDisabled"
            visible={false}
            x-props={{
              placeholder: '规格不限',
              style: {
                width: 250,
              },
              addonAfter: <span className="addon-after">人</span>,
            }}
            x-component-props={{
              disabled: true,
            }}
          />
          <Field
            required
            type="string"
            name="orgNumConfig.range"
            x-component="InputRange"
            visible={true}
            x-props={{
              placeholder: '请输入',
              style: {
                width: 250,
              },
              addonAfter: <span className="addon-after">人</span>,
            }}
            x-component-props={{
              max: 9999999999, // 最大10位正整数
            }}
            x-rules={[{ validator: orgNumValidator }]}
          />
          <Field
            type="checkbox"
            name="orgNumConfig.noLimit"
            enum={[
              {
                label: "{{ text('规格不限', help('指包含全部规格')) }}",
                value: -1,
              },
            ]}
          />
        </FormTextBox>
        <FormTextBox
          required
          title="使用人数范围"
          text="%s%s%s"
          className="xm-form-text-box"
        >
          <Field
            type="string"
            name="useNumConfig.numDisabled"
            visible={false}
            x-props={{
              placeholder: '规格不限',
              style: {
                width: 170,
              },
              addonAfter: <span className="addon-after">人</span>,
            }}
            x-component-props={{
              disabled: true,
            }}
          />
          <Field
            required
            type="xm-string"
            name="useNumConfig.num"
            visible={true}
            x-props={{
              placeholder: '请输入10位以内正整数',
              style: {
                width: 170,
              },
              addonAfter: <span className="addon-after">人</span>,
            }}
            x-rules={[{ validator: posIntegerValidator(10) }]}
          />
          <Field
            type="checkbox"
            name="useNumConfig.noLimit"
            enum={[
              {
                label: '规格不限',
                value: -1,
              },
            ]}
          />
        </FormTextBox>
        <FormTextBox
          required
          title="容量限制"
          text="%s%s%s"
          className="xm-form-text-box"
        >
          <Field
            type="string"
            name="capacityConfig.numDisabled"
            visible={false}
            x-props={{
              placeholder: '规格不限',
              style: {
                width: 170,
              },
            }}
            x-component-props={{
              disabled: true,
            }}
          />
          <Field
            required
            type="xm-string"
            name="capacityConfig.num"
            visible={true}
            x-props={{
              placeholder: '请输入8位以内正整数',
              style: {
                width: 170,
              },
            }}
            x-rules={[{ validator: posIntegerValidator(8) }]}
          />
          <Field
            required
            name="capacityConfig.unit"
            x-component="Select"
            enum={['M', 'G', 'T']}
            x-props={{
              placeholder: '单位',
              style: {
                width: 60,
              },
              disabled: true,
            }}
            x-component-props={{
              disabled: false,
            }}
            x-rules={[{ required: true, message: '请选择单位' }]}
          />
          <Field
            type="checkbox"
            name="capacityConfig.noLimit"
            enum={[
              {
                label: '规格不限',
                value: -1,
              },
            ]}
          />
        </FormTextBox>

        <FormTextBox
          required
          title="数量限制"
          text="%s%s%s"
          className="xm-form-text-box"
        >
          <Field
            type="xm-string"
            name="numConfig.numDisabled"
            visible={false}
            x-props={{
              enableEdit: false,
              placeholder: '规格不限',
              style: {
                width: 170,
              },
              addonAfter: <div className="addon-after">条/台</div>,
            }}
          />
          <Field
            required
            type="xm-string"
            name="numConfig.num"
            visible={true}
            x-props={{
              placeholder: '请输入8位以内正整数',
              style: {
                width: 170,
              },
              addonAfter: <div className="addon-after">条/台</div>,
            }}
            x-rules={[{ validator: posIntegerValidator(8) }]}
          />
          <Field
            type="checkbox"
            name="numConfig.noLimit"
            enum={[
              {
                label: '规格不限',
                value: -1,
              },
            ]}
          />
        </FormTextBox>

        <FormTextBox
          required
          title="时效性限制"
          text="%s%s%s"
          className="xm-form-text-box"
        >
          <Field
            type="number"
            name="timelinessConfig.numDisabled"
            visible={false}
            x-props={{
              placeholder: '规格不限',
              style: {
                width: 170,
              },
            }}
            x-component-props={{
              disabled: true,
            }}
          />
          <Field
            required
            type="number"
            name="timelinessConfig.num"
            visible={true}
            x-props={{
              placeholder: '请输入8位以内正整数',
              style: {
                width: 170,
              },
            }}
            x-rules={[{ validator: posIntegerValidator(8) }]}
          />
          <Field
            required
            type="string"
            name="timelinessConfig.unit"
            enum={['日', '月', '年']}
            x-props={{
              placeholder: '单位',
              style: {
                width: 60,
              },
              disabled: true,
            }}
            x-component-props={{
              disabled: false,
            }}
            x-rules={[{ required: true, message: '请选择单位' }]}
          />
          <Field
            type="checkbox"
            name="timelinessConfig.noLimit"
            enum={[
              {
                label: '规格不限',
                value: -1,
              },
            ]}
          />
        </FormTextBox>

        <Field
          required
          type="number"
          name="originalPrice"
          title="收款方标价"
          x-props={{
            style: {
              width: 270,
            },
            placeholder: '请输入收款方标价，最多保留两位小数',
            addonAfter: <div className="addon-after">元</div>,
          }}
          x-rules={[{ validator: moneyValidator(8) }]}
        />
        <FormTextBox
          required
          title="产品标价"
          text="%s %s %s"
          className="xm-form-text-box"
        >
          <Field
            type="string"
            name="productConfig.status"
            enum={[
              { label: '订购价格', value: 1 },
              { label: '预约价格', value: 2 },
            ]}
          />
          <Field
            required
            type="number"
            name="productConfig.price"
            x-props={{
              style: {
                width: 210,
              },
              placeholder: '请输入，最多保留两位小数',
              addonAfter: <div className="addon-after">元</div>,
            }}
            x-rules={[{ validator: moneyValidator(8) }]}
          />
          <Field
            type="xm-string"
            name="productConfig.input"
            x-props={{
              style: {
                width: 210,
              },
              maxLength: 15,
              placeholder: '请输入15个字符，可为空',
            }}
          />
        </FormTextBox>
        <FormTextBox
          required
          title="优惠价"
          text="%s%s%s"
          className="xm-form-text-box"
        >
          <Field
            type="string"
            name="favorableConfig.status"
            enum={[
              { label: '支持', value: 1 },
              { label: '不支持', value: 0 },
            ]}
          />
          <Field
            required
            type="number"
            name="favorableConfig.amount"
            x-props={{
              style: {
                width: 210,
              },
              placeholder: '请输入，最多保留两位小数',
              addonAfter: <div className="addon-after">元</div>,
            }}
            x-rules={[{ validator: moneyValidator(8) }]}
          />
        </FormTextBox>

        {isAdd ? (
          <FormTextBox
            required
            title="可销库存数"
            text="%s%s%s"
            className="xm-form-text-box"
          >
            <Field
              type="number"
              name="stockConfig.numDisabled"
              visible={false}
              x-props={{
                placeholder: '库存不限',
                style: {
                  width: 200,
                },
              }}
              x-component-props={{
                disabled: true,
              }}
            />
            <Field
              type="number"
              name="stockConfig.num"
              visible={true}
              x-props={{
                placeholder: '请输入正整数',
                style: {
                  width: 200,
                },
              }}
              x-rules={[{ validator: stockValidator }]}
            />
            <Field
              type="checkbox"
              name="stockConfig.noLimit"
              enum={[
                {
                  label: "{{ text('库存不限', help('一般适用于虚拟商品')) }}",
                  value: -1,
                },
              ]}
              default={[]}
            />
          </FormTextBox>
        ) : (
          <Field
            editable={false}
            title="库存数目"
            type="xm-string"
            name="stockConfig.num"
            x-props={{
              filter: value => {
                if (+value === -1) {
                  return '库存不限'
                }
                return value
              },
            }}
          />
        )}
        <Field
          type="string"
          name="skuInst"
          title="备注"
          x-component="TextArea"
          x-props={{
            placeholder: '请输入30字以内备注',
            maxLength: 30,
            style: {
              width: 280,
            },
            autoSize: {
              minRows: 2,
            },
          }}
        />
      </SchemaForm>
    </Modal>
  )
}
