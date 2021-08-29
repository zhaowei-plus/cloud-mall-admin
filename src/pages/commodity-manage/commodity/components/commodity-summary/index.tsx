import React, { useEffect, useState } from 'react'
import { Button, message, Typography } from 'antd'
import components from './form'
import {
  SchemaForm,
  SchemaMarkupField as Field,
  FormButtonGroup,
  Submit,
} from '@formily/antd'
import cs from 'classnames'
import http from '@/api'
import { IResponse } from '@/assets/constant'
import { htmlCodec } from '@/assets/utils'
import { useParams } from 'react-router'
import { validCommoditySummary } from '../edit-commodity/utils'

const { Title, Paragraph, Text } = Typography

export default (props: any) => {
  const { itemId } = useParams()
  const { actions, values, enableEdit } = props
  const [key, setKey] = useState(new Date().valueOf())
  const [editable, setEditable] = useState(false)
  const [initialValues, setInitialValues] = useState(values)

  const handleSubmit = params => {
    const error = validCommoditySummary(params)
    if (!error && !itemId) {
      const { introduction, ...rest } = params
      http
        .post('commodity/saveDraft', {
          itemDraftType: 2,
          itemDraftInfoJson: JSON.stringify({
            ...rest,
            introduction: htmlCodec.encode(introduction),
          }),
        })
        .then((res: IResponse) => {
          if (res.success) {
            message.success('保存成功')
          } else {
            message.error(res.msg || '保存失败')
            return false
          }
        })

      // 更新数据信息
      setInitialValues(params)
      setKey(new Date().valueOf())
      setEditable(false)
      return true
    } else {
      // 文本态
      if (!(enableEdit && editable)) {
        message.warn('请完善商品简介')
        return false
      }

      // 更新数据信息
      setInitialValues(params)
      setKey(new Date().valueOf())
      setEditable(false)
      return true
    }
  }

  const handleEdit = () => {
    setEditable(true)
  }

  const handleCancel = () => {
    actions.reset().then(() => {
      setEditable(false)
    })
  }

  useEffect(() => {
    setInitialValues(values)
  }, [values])

  return (
    <Typography className="form">
      <Title level={2}>
        商品简介
        {!editable && enableEdit && (
          <Button type="link" onClick={handleEdit}>
            编辑
          </Button>
        )}
      </Title>
      <Paragraph>
        <SchemaForm
          key={key}
          actions={actions}
          editable={editable}
          onSubmit={handleSubmit}
          components={components}
          initialValues={initialValues}
        >
          <Field type="string" name="introduction" x-component="XmEditor" />

          <FormButtonGroup
            align="center"
            className={cs('form__footer', { hidden: !editable })}
          >
            <Submit>保存</Submit>
            <Button onClick={handleCancel}>取消</Button>
          </FormButtonGroup>
        </SchemaForm>
      </Paragraph>
    </Typography>
  )
}
