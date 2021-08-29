import React, { useMemo } from 'react'
import { Modal, message } from 'antd'
import { SchemaForm, createFormActions } from '@formily/antd'
import http from '@/api'
import { formatFormSchema, formatRegionPath } from '@/assets/utils'

import { getAddSchema } from '../../config'

export default (props: any) => {
  const { params = {}, onCancel, onOk } = props
  const { type, item = {} } = params
  const { id } = item
  const actions = createFormActions()

  const handleSubmit = params => {
    const { regionCode = [], ...rest } = params
    if (regionCode.length > 0) {
      rest.regionCode = regionCode[regionCode.length - 1]
    }
    http.post('channel/update', rest).then(res => {
      if (res.success) {
        message.success(id ? '修改成功' : '新增成功')
        onOk()
      } else {
        message.error(id ? '修改失败' : '新增失败')
      }
    })
  }

  const initialValues = useMemo(() => {
    if (type === 'edit') {
      const { regionCode, ...rest } = item
      return {
        ...rest,
        regionCode: formatRegionPath(regionCode),
      }
    }
  }, [params])

  const schema = getAddSchema()
  const title = type === 'add' ? '新增分公司' : '编辑分公司'

  return (
    <Modal
      centered
      visible
      width={480}
      title={title}
      onCancel={onCancel}
      className="add-model"
      maskClosable={false}
      onOk={() => actions.submit()}
    >
      <SchemaForm
        labelCol={8}
        wrapperCol={14}
        actions={actions}
        validateFirst={true}
        onSubmit={handleSubmit}
        previewPlaceholder={' '}
        initialValues={initialValues}
        schema={{
          type: 'object',
          properties: formatFormSchema(schema),
        }}
      />
    </Modal>
  )
}
