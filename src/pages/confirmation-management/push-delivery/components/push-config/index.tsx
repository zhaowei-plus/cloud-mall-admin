import React, { useMemo, useState, useEffect } from 'react'
import {
  SchemaForm,
  createFormActions,
  SchemaMarkupField as Field,
} from '@formily/antd'
import { Button, message } from 'antd'
import { history } from 'umi'
import cs from 'classnames'
import dayjs from 'dayjs'
import http from '@/api'
import { Layout } from '@/components'
import components from '../form'
import { useFetch } from '@/hooks'
import { PUSH_TYPE } from '../../constant'
import './index.less'

const { Header, Content, Footer } = Layout

export default props => {
  const { id, title, isAdd = false, isEdit = false, isDetail = false } = props
  const [detail, setDetail] = useState<any>()

  const fetchDetail = async params => {
    const { success, data } = await http.get(
      'confirmationManagement/pushDelivery/detail',
      params
    )
    if (success) {
      setDetail(data)
    }
  }

  const pushDetail = useFetch(fetchDetail)

  const handleBack = () => {
    history.goBack()
  }

  const handleSave = () => {
    actions.submit().then(({ values }) => {
      const {
        order,
        bizIds = [],
        pushType = [],
        customBizTypes = [],
        expiryDate,
        ...param
      } = values
      const { fileId } = order
      // 业务类型、自定义业务类型 二选一 或全选 判断
      if (!bizIds.length && !customBizTypes.length) {
        return message.warn('请选择业务类型或自定义业务类型')
      }

      const query = {
        bizIds,
        fileId,
        customBizTypes,
        pushType: pushType.reduce((result, item) => result | item),
        expiryDate: dayjs(expiryDate)
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
        ...param,
      }
      if (isEdit) {
        query.id = Number(id)
      }

      http
        .post(
          `confirmationManagement/pushDelivery/${isAdd ? 'add' : 'update'}`,
          query
        )
        .then(res => {
          if (res.success) {
            message.destroy()
            message.success('保存成功')
            handleBack()
          }
        })
    })
  }

  const actions = useMemo(() => createFormActions(), [])
  const initialValues = useMemo(() => {
    if (detail) {
      const {
        bizIds,
        customBizTypes,
        expiryDate,
        pushType,
        fileId,
        fileName,
        num,
      } = detail
      return {
        bizIds,
        customBizTypes,
        expiryDate,
        pushType: [pushType & 1, pushType & 2],
        order: {
          fileId,
          fileName,
          num,
        },
      }
    }
    return {
      pushType: [1, 2],
    }
  }, [detail])

  useEffect(() => {
    if (id) {
      pushDetail.onFetch({ id })
    }
  }, [id])

  // 是否可编辑：新增/编辑，即非详情页
  const editable = !isDetail
  const loading = pushDetail.loading

  return (
    <Layout wrapperClassName="push-config">
      <Header title={title} onBack={handleBack} />
      <Content wrapperClassName="push-config__content">
        {!loading && (
          <SchemaForm
            labelCol={3}
            wrapperCol={16}
            actions={actions}
            editable={editable}
            validateFirst={true}
            components={components}
            initialValues={initialValues}
          >
            <Field title="业务类型" name="bizIds" x-component="bizConfigs" />
            <Field
              required
              title="截止时间"
              name="expiryDate"
              type="date"
              x-props={{
                format: 'YYYY-MM-DD',
                placeholder: '请选择',
                disabledDate: currentDate =>
                  dayjs(currentDate).format('YYYY-MM-DD') <
                  dayjs().format('YYYY-MM-DD'),
              }}
            />
            <Field
              title="自定义业务类型"
              name="customBizTypes"
              x-component="customBizTypes"
            />
            <Field
              required
              title="目标用户名单"
              name="order"
              x-component="FileUpload"
              x-props={{
                placeholder: '请上传',
                action: '/cmmc-market/confirm/uploadFile',
                file: '目标用户名单.xlsx',
              }}
            />
            <Field
              required
              title="推送方式"
              name="pushType"
              type="checkbox"
              enum={PUSH_TYPE}
              x-props={{
                addonAfter: (
                  <div className="addon-after">
                    注：非渝企信用户默认会发送短信做确认
                  </div>
                ),
              }}
            />
          </SchemaForm>
        )}
      </Content>
      <Footer
        wrapperClassName={cs('push-config__footer', {
          hidden: !editable,
        })}
      >
        <Button type="primary" onClick={handleSave}>
          保存
        </Button>
        <Button onClick={handleBack}>取消</Button>
      </Footer>
    </Layout>
  )
}
