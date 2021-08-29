import React, { useMemo, useState } from 'react'
import { Modal, message, Tree } from 'antd'
import http from '@/api'
import { SchemaForm, createFormActions } from '@formily/antd'
import { formatFormSchema } from '@//assets/utils'
import { getAddSchema } from '../config'
import { IResponse } from '@/assets/constant'

interface IProps {
  params: {
    [key: string]: any
  }
  onCancel: () => void
  onOk: () => void
}

export default (props: IProps) => {
  const { params = {}, onCancel, onOk } = props
  const { detail, accountTypes, resourceId } = params

  const onSubmit = params => {
    if (detail) {
      // 修改
      http
        .post('role/update', { ...params, resourceId })
        .then((res: IResponse) => {
          if (res.success) {
            message.success('修改成功')
            onOk()
          }
        })
    } else {
      // 新增
      http
        .post('role/add', { ...params, resourceId })
        .then((res: IResponse) => {
          if (res.success) {
            message.success('新增成功')
            onOk()
          }
        })
    }
  }

  const actions = useMemo(() => createFormActions(), [])
  const schema = getAddSchema(accountTypes, Boolean(detail))

  return (
    <Modal
      visible
      centered
      onCancel={onCancel}
      maskClosable={false}
      title={`${detail ? '修改' : '新增'}角色`}
      onOk={() => actions.submit()}
    >
      <SchemaForm
        labelCol={7}
        wrapperCol={12}
        actions={actions}
        onSubmit={onSubmit}
        previewPlaceholder="暂无配置"
        initialValues={detail}
        schema={{
          type: 'object',
          properties: formatFormSchema(schema),
        }}
      />
    </Modal>
  )
}
