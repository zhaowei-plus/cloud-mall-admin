import React, { useMemo, useState, useEffect } from 'react'
import { Modal, Button } from 'antd'
import http from '@/api'
import {
  SchemaForm,
  FormButtonGroup,
  Submit,
  createFormActions,
} from '@formily/antd'
import { formatFormSchema } from '@/assets/utils'
import { getBannerSchema } from '../../config'
import { ACTION, ICommodity } from '../../constant'

interface IProps {
  params: {
    [key: string]: any
  }
  onCancel: () => void
  onOk: (params?) => void
}

export default (props: IProps) => {
  const { params = {}, onOk, onCancel } = props
  const { type, moduleType, record = {}, index, itemIndex } = params

  const [categories, setCategories] = useState<Array<ICommodity>>([])
  const actions = useMemo(() => createFormActions(), [])

  const fetchCategories = () => {
    http.get('commodity/list', { pageEnable: false, status: 1 }).then(res => {
      const { success, data } = res
      if (success) {
        setCategories(
          JSON.parse(
            JSON.stringify(data.rows)
              .replace(/name/g, 'label')
              .replace(/id/g, 'value')
          )
        )
      }
    })
  }

  const onSubmit = async (values: any = {}) => {
    const { itemId, ...rest } = values
    const category = categories.find(item => item.value === itemId)
    if (category) {
      rest.itemId = category.value
      rest.itemName = category.label
      rest.remark = category.itemInst
    }
    rest.type = type
    rest.index = index
    rest.itemIndex = itemIndex
    rest.moduleType = moduleType
    onOk(rest)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const initialValues = useMemo(() => {
    if (type === ACTION.EDIT) {
      return record
    }
  }, [])

  const schema = getBannerSchema(categories)
  const titleMap = {
    [ACTION.ADD]: '新增banner',
    [ACTION.EDIT]: '修改banner',
  }
  return (
    <Modal
      visible
      centered
      footer={null}
      onCancel={onCancel}
      maskClosable={false}
      title={titleMap[type]}
      className="banner-modal"
    >
      <SchemaForm
        labelCol={7}
        validateFirst
        wrapperCol={12}
        actions={actions}
        onSubmit={onSubmit}
        initialValues={initialValues}
        schema={{
          type: 'object',
          properties: formatFormSchema(schema),
        }}
      >
        <FormButtonGroup align="right">
          <Button onClick={onCancel}>取消</Button>
          <Submit>保存</Submit>
        </FormButtonGroup>
      </SchemaForm>
    </Modal>
  )
}
