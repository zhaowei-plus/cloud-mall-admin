import React, { useState, useEffect } from 'react'
import { Button, message, Typography } from 'antd'
import cs from 'classnames'
import { useParams } from 'umi'
import {
  SchemaForm,
  SchemaMarkupField as Field,
  FormSlot,
  FormButtonGroup,
  Submit,
  Reset,
} from '@formily/antd'

import http from '@/api'
import { Preview } from '@/components'
import { IResponse } from '@/assets/constant'
import {
  ReservationConfig,
  validReservationInfo,
} from '../edit-commodity/utils'
import { RESERVATION_CONFIG } from './constant'
import useEffects from './effects'

import './index.less'

const PREVIEW_IMAGE = require('@/assets/image/preview.png')

interface IProps {
  actions: any
  values: any
  enableEdit: boolean
}

const { Title, Paragraph } = Typography

export default (props: IProps) => {
  const { itemId } = useParams()
  const { actions, values, enableEdit } = props
  const [status, setStatus] = useState(0)
  const [key, setKey] = useState(new Date().valueOf())
  const [editable, setEditable] = useState(false)
  const [initialValues, setInitialValues] = useState(values)

  const handleSubmit = (params = {}) => {
    const error = validReservationInfo(params)
    if (!error) {
      if (!itemId) {
        // 新增
        http
          .post('commodity/saveDraft', {
            itemDraftType: 4,
            itemDraftInfoJson: JSON.stringify({
              preManagerflag: ReservationConfig.format(params),
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
      }

      // 更新数据信息
      setInitialValues(params)
      setKey(new Date().valueOf())
      setEditable(false)
      return true
    } else {
      // 文本态
      if (!(enableEdit && editable)) {
        message.warn('请完善预约信息')
        return false
      } else {
        message.warn(error)
        return false
      }
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

  const handlePreview = () => {
    Preview.gif(PREVIEW_IMAGE)
  }

  const handleChange = ({ status }) => {
    setStatus(status)
  }

  useEffect(() => {
    setInitialValues(values)
  }, [values])

  return (
    <Typography className="form reservation-info">
      <Title level={2}>
        预约管理
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
          effects={useEffects}
          onSubmit={handleSubmit}
          onChange={handleChange}
          previewPlaceholder="暂无配置项"
          initialValues={initialValues}
        >
          <Field
            type="radio"
            title="商品是否支持可预约"
            name="status"
            enum={[
              { label: '不支持', value: 0 },
              { label: '支持', value: 1 },
            ]}
            x-props={{
              addonAfter: (
                <a
                  className={cs('page-preview', {
                    hidden: status === 0,
                  })}
                  onClick={handlePreview}
                >
                  页面样式预览
                </a>
              ),
            }}
          />
          <Field
            type="checkbox"
            name="configFields"
            enum={RESERVATION_CONFIG}
          />
          <FormSlot>
            <div
              style={{ margin: 14 }}
              className={cs({
                hidden: status === 0,
              })}
            >
              *请根据实际需要来勾选对应字段，勾选后会在预约页面内展示。适用于线上下单线下付款和线上预约办理两种场景。
              目前订单信息内会自动保存购买者的姓名，电话和公司信息。
            </div>
          </FormSlot>
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
