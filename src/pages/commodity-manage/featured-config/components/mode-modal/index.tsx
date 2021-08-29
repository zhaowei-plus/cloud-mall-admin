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
import { getModeSchema } from '../../config'
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
  const { type, moduleType, record = {}, index } = params
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

  const onSubmit = async (params: any = {}) => {
    const { item = [], ...rest } = params
    if (item.length > 0) {
      rest.item = item.map(id => {
        const category = categories.find(item => item.value === id)
        if (category) {
          return {
            itemId: category.value,
            itemName: category.label,
            remark: category.itemInst,
          }
        }
      })
    }
    rest.type = type
    rest.index = index
    rest.moduleType = moduleType
    onOk(rest)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const initialValues = useMemo(() => {
    if (type === ACTION.EDIT) {
      const { item = [], ...rest } = record
      rest.item = item.map(d => d.itemId)
      return rest
    }
  }, [])
  const schema = getModeSchema(categories, 1)
  const titleMap = {
    [ACTION.ADD]: '新增模块',
    [ACTION.EDIT]: '修改模块',
  }
  return (
    <Modal
      visible
      centered
      footer={null}
      onCancel={onCancel}
      maskClosable={false}
      className="mode-modal"
      title={titleMap[type]}
    >
      <SchemaForm
        labelCol={7}
        validateFirst
        wrapperCol={12}
        actions={actions}
        onSubmit={onSubmit}
        schema={{
          type: 'object',
          properties: formatFormSchema(schema),
        }}
        initialValues={initialValues}
      >
        <FormButtonGroup align="right">
          <Button onClick={onCancel}>取消</Button>
          <Submit>保存</Submit>
        </FormButtonGroup>
      </SchemaForm>
    </Modal>
  )
}
