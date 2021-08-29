import React, { useMemo } from 'react'
import { Modal, message } from 'antd'
import {
  SchemaForm,
  createFormActions,
  SchemaMarkupField as Field,
} from '@formily/antd'
import { FormTextBox } from '@formily/antd-components'

import http from '@/api'
import useEffects from './effects'
import { getEditSchema, getExpressionScope } from '../../config'

export default (props: any) => {
  const { detail = {}, onCancel, onOk } = props
  const actions = createFormActions()

  const isValidArray = (value: Array<any>) => {
    return Array.isArray(value) && value.includes(-1)
  }

  const handleSubmit = params => {
    const { id: skuId, itemId, stockConfig } = params
    const stock = isValidArray(stockConfig.noLimit) ? -1 : stockConfig.num

    let content = `修改后可销售库存数为${stock}，确定保存?`
    if (stock === -1) {
      content = '修改后可销售库存不限，确定保存?'
    }

    Modal.confirm({
      content,
      centered: true,
      title: '提示',
      onOk() {
        http.post('stock/edit', { itemId, skuId, stock }).then(res => {
          if (res.success) {
            message.success('修改成功')
            onOk()
          } else {
            message.error('修改失败')
          }
        })
      },
    })
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
      const { stock, ...rest } = detail
      const stockConfig = {
        num: stock == -1 ? undefined : stock,
        noLimit: [stock],
      }
      return {
        ...rest,
        stockConfig,
      }
    }
  }, [detail])

  const schema = getEditSchema()

  return (
    <Modal
      centered
      visible
      width={480}
      title="修改库存"
      onCancel={onCancel}
      className="add-model"
      onOk={() => actions.submit()}
    >
      <SchemaForm
        labelCol={8}
        wrapperCol={14}
        editable={false}
        actions={actions}
        effects={useEffects}
        validateFirst={true}
        onSubmit={handleSubmit}
        previewPlaceholder={' '}
        initialValues={initialValues}
        expressionScope={getExpressionScope()}
      >
        {Object.keys(schema).map(name => (
          <Field name={name} {...schema[name]} key={name} />
        ))}
        <FormTextBox
          required
          title="可销库存数"
          text="%s%s %s"
          className="xm-form-text-box"
        >
          <Field
            editable={true}
            type="number"
            name="stockConfig.numDisabled"
            visible={false}
            x-props={{
              placeholder: '库存不限',
              style: {
                width: 140,
              },
            }}
            x-component-props={{
              disabled: true,
            }}
          />
          <Field
            editable={true}
            type="number"
            name="stockConfig.num"
            visible={true}
            x-props={{
              placeholder: '请输入正整数',
              style: {
                width: 140,
              },
            }}
            x-rules={[{ validator: stockValidator }]}
          />
          <Field
            editable={true}
            type="checkbox"
            name="stockConfig.noLimit"
            enum={[
              {
                label: "{{ text('库存不限', help('一般适用于虚拟商品')) }}",
                value: -1,
              },
            ]}
          />
        </FormTextBox>
      </SchemaForm>
    </Modal>
  )
}
