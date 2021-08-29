import React, { useMemo, useState, useEffect } from 'react'
import { Modal, message } from 'antd'
import http from '@/api'
import { SchemaForm, createFormActions } from '@formily/antd'
import { formatFormSchema } from '@//assets/utils'
import { getAddSchema } from '../config'
import { IResponse } from '@/assets/constant'

interface IProps {
  detail: {
    [key: string]: any
  }
  onCancel: () => void
  onOk: () => void
}

export default (props: IProps) => {
  const { detail, onCancel, onOk } = props

  const action = useMemo(() => createFormActions(), [])

  const onSubmit = params => {
    if (detail) {
      const { id: catId } = detail
      // 修改
      http
        .post('category/update', { ...params, catId })
        .then((res: IResponse) => {
          if (res.success) {
            message.success('修改成功')
            onOk()
          }
        })
    } else {
      // 新增
      http.post('category/add', params).then((res: IResponse) => {
        if (res.success) {
          message.success('新增成功')
          onOk()
        }
      })
    }
  }

  const schema = getAddSchema()

  return (
    <Modal
      visible
      centered
      onCancel={onCancel}
      maskClosable={false}
      onOk={() => action.submit()}
      title={`${detail ? '修改' : '新增'}类目`}
    >
      <SchemaForm
        labelCol={7}
        wrapperCol={12}
        actions={action}
        onSubmit={onSubmit}
        previewPlaceholder="-"
        initialValues={detail}
        schema={{
          type: 'object',
          properties: formatFormSchema(schema),
        }}
      />
    </Modal>
  )
}
