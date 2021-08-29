import React, { useMemo, useState, useEffect } from 'react'
import { Modal, message } from 'antd'
import http from '@/api'
import { SchemaForm, createFormActions } from '@formily/antd'
import { formatFormSchema } from '@//assets/utils'
import { IResponse } from '@/assets/constant'
import { getAddSchema } from '../config'

interface IProps {
  id: number
  onCancel: () => void
  onOk: () => void
}

export default (props: IProps) => {
  const { id, onCancel, onOk } = props
  const [detail, setDetail] = useState()

  const action = useMemo(() => createFormActions(), [])

  const fetchDetail = (id: number) => {
    http.post('supplier/detail', { id }).then(res => {
      if (res.success) {
        setDetail(res.data)
      }
    })
  }

  const onSubmit = params => {
    if (id) {
      // 修改
      http.post('supplier/update', { ...params, id }).then((res: IResponse) => {
        if (res.success) {
          message.success('修改成功')
          onOk()
        }
      })
    } else {
      // 新增
      http.post('supplier/add', params).then((res: IResponse) => {
        if (res.success) {
          message.success('新增成功')
          onOk()
        }
      })
    }
  }

  useEffect(() => {
    id && fetchDetail(id)
  }, [id])

  const initialValues = useMemo(() => {
    if (id) {
      if (detail) {
        const { name, contactPerson, contactMobile, remark, status } = detail
        return {
          name,
          contactPerson,
          contactMobile,
          remark,
          status: Number(status),
        }
      }
    } else {
      return {
        status: 1,
      }
    }
  }, [id, detail])

  const schema = getAddSchema()

  return (
    <Modal
      visible
      centered
      onCancel={onCancel}
      maskClosable={false}
      onOk={() => action.submit()}
      title={`${id ? '修改' : '新增'}收款方`}
    >
      <SchemaForm
        labelCol={7}
        wrapperCol={12}
        actions={action}
        onSubmit={onSubmit}
        previewPlaceholder="-"
        initialValues={initialValues}
        schema={{
          type: 'object',
          properties: formatFormSchema(schema),
        }}
      />
    </Modal>
  )
}
