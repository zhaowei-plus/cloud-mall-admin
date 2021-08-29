import React, { useMemo, useState, useEffect } from 'react'
import { Modal, message } from 'antd'
import { SchemaForm, createFormActions } from '@formily/antd'
import http from '@/api'
import { IResponse } from '@/assets/constant'
import { formatFormSchema } from '@//assets/utils'
import useEffects from './effects'
import { getAddSchema } from '../config'

interface IProps {
  params: {
    [key: string]: any
  }
  onCancel: () => void
  onOk: () => void
}

export default (props: IProps) => {
  const { params = {}, onCancel, onOk } = props
  const { detail } = params
  const [regions, setRegions] = useState<Array<any>>([])

  const fetchRegion = () => {
    http.get('role/region').then((res: IResponse) => {
      const { success, data = [] } = res
      if (success) {
        setRegions(
          JSON.parse(
            JSON.stringify(data)
              .replace(/code/g, 'value')
              .replace(/name/g, 'label')
          )
        )
      }
    })
  }

  const onSubmit = (params: any = {}) => {
    const { regionCode, ...rest } = params
    if (regionCode) {
      rest.regionCode = regionCode[regionCode.length - 1]
    }
    if (detail) {
      // 修改
      http
        .post('confirmationManagement/businessConfig/update', rest)
        .then((res: IResponse) => {
          if (res.success) {
            message.success('修改成功')
            onOk()
          }
        })
    } else {
      // 新增
      http
        .post('confirmationManagement/businessConfig/add', rest)
        .then((res: IResponse) => {
          if (res.success) {
            message.success('新增成功')
            onOk()
          }
        })
    }
  }

  useEffect(() => {
    fetchRegion()
  }, [])

  const initialValues = useMemo(() => {
    if (detail) {
      const { regionCode, ...rest } = detail
      return {
        ...rest,
        regionCode: [regionCode],
      }
    }
  }, [detail])
  const actions = useMemo(() => createFormActions(), [])
  const schema = getAddSchema(Boolean(detail), regions)
  return (
    <Modal
      visible
      centered
      onCancel={onCancel}
      maskClosable={false}
      title={`${detail ? '修改' : '新增'}`}
      onOk={() => actions.submit()}
    >
      <SchemaForm
        labelCol={7}
        wrapperCol={12}
        actions={actions}
        onSubmit={onSubmit}
        effects={useEffects}
        initialValues={initialValues}
        schema={{
          type: 'object',
          properties: formatFormSchema(schema),
        }}
      />
    </Modal>
  )
}
