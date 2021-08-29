import React, { useEffect, useState, useMemo } from 'react'
import { Button, PageHeader, Modal, message } from 'antd'
import { useParams } from 'umi'
import cs from 'classnames'
import {
  SchemaForm,
  Field,
  FormButtonGroup,
  Submit,
  createFormActions,
} from '@formily/antd'
import { FormMegaLayout, FormBlock } from '@formily/antd-components'
import { RESERVATION_VISIBLE } from '@/assets/constant'
import components from './components/form'
import http from '@/api'

import useEffects from './effects'

import './index.less'

import { Layout } from '@/components'

import { getProcessConfig } from '../config'
import { formatMoney } from '@/assets/utils'

const { Content, Footer } = Layout

export default () => {
  const { orderId } = useParams()
  const [detail, setDetail] = useState<any>()
  const [payStatus, setPayStatus] = useState<number>() // 付款状态
  const [reserveStatus, setReserveStatus] = useState<number>() // 订单状态
  const [reservationConfig, setReservationConfig] = useState<number>(0)

  const actions = useMemo(() => createFormActions(), [])

  // 查询收款方公司
  const fetchDetail = () => {
    http.get('reservation/detail', { orderId }).then((res: any) => {
      const { success, data } = res
      if (success) {
        setDetail(data)
      }
    })
  }

  const handleSave = () => {
    actions.submit().then(({ values = {} }) => {
      const {
        orderId,
        paidPrice,
        handleResult,
        companyName,
        contactName,
        contactPhone,
        contactAddress,
        idCard,
        idCardImgFront,
        idCardImgBack,
        planTime,
        payStatus,
      } = values

      const params: any = {
        orderId,
        handleResult,
        reserveInfo: {
          companyName,
          contactName,
          contactPhone,
          contactAddress,
          idCard,
          idCardImgFront,
          idCardImgBack,
          planTime,
          preManagerflag: reservationConfig,
        },
      }

      // 待付款
      if (+payStatus === 1) {
        params.discountPrice = formatMoney(paidPrice, 'toCent')
      }

      if (!Boolean(reservationConfig & 1)) {
        delete params.reserveInfo
      }

      Modal.confirm({
        centered: true,
        title: '提示',
        content: (
          <div>
            <p>
              订单处理后会到已完成订单内且无法再次处理，保存所有修改的信息。
            </p>
            <p style={{ fontSize: 16 }}>确定提交办理吗？</p>
          </div>
        ),
        onOk: () => {
          http.post('reservation/handle', params).then(res => {
            const { code, success, msg } = res

            // 订单已处理/已关闭，返回列表页。。
            if ([6000001, 6000002].includes(code)) {
              message.error(msg)
              handleBack()
              return false
            }

            if (success) {
              handleBack()
            } else {
              message.error(msg)
            }
          })
        },
      })
    })
  }

  const handleClose = () => {
    actions.submit().then(({ values = {} }) => {
      const { handleResult } = values
      Modal.confirm({
        centered: true,
        title: '提示',
        content: (
          <div>
            <p>
              订单关闭后会到已完成订单内且无法再次处理，只保存处理结果信息且实付款默认为0。
            </p>
            <p style={{ fontSize: 16 }}>确定关闭订单吗？</p>
          </div>
        ),
        onOk: () => {
          http
            .post('reservation/close', { orderId, handleResult })
            .then(res => {
              const { code, success, msg } = res
              // 订单已处理/已关闭，返回列表页。。
              if ([6000001, 6000002].includes(code)) {
                message.error(msg)
                handleBack()
                return false
              }

              if (success) {
                handleBack()
              } else {
                message.error(msg)
              }
            })
        },
      })
    })
  }

  const handleBack = () => {
    history.back()
  }

  useEffect(() => {
    fetchDetail()
  }, [])

  const initialValues = useMemo(() => {
    if (detail) {
      const { orderDetail = {}, reserveInfo = {}, ...rest } = detail
      const { payStatus, originalPrice, reserveStatus, paidPrice } = orderDetail

      orderDetail.originalPrice = originalPrice
        ? formatMoney(originalPrice, 'toYuan', {
            thousandsSeparator: false,
          })
        : undefined
      orderDetail.paidPrice = paidPrice
        ? formatMoney(paidPrice, 'toYuan', {
            thousandsSeparator: false,
          })
        : paidPrice

      setPayStatus(payStatus)
      setReserveStatus(reserveStatus)
      setReservationConfig(reserveInfo.preManagerflag)

      return {
        ...rest,
        ...orderDetail,
        ...reserveInfo,
      }
    }
  }, [detail])

  const editable = [1].includes(reserveStatus)

  const { orderDetail, reserveInfo, resultInfo } = getProcessConfig(
    reservationConfig,
    payStatus,
    editable
  )

  return (
    <Layout>
      <PageHeader onBack={handleBack} title="订单详情" />
      <Content wrapperClassName="reservation-detail">
        <SchemaForm
          editable={false}
          actions={actions}
          effects={useEffects}
          validateFirst={true}
          components={components}
          previewPlaceholder="暂无数据"
          initialValues={initialValues}
        >
          <FormBlock
            name="orderDetail"
            title="订单信息"
            className="order-detail"
          >
            {Object.keys(orderDetail).map(name => (
              <Field required key={name} name={name} {...orderDetail[name]} />
            ))}
          </FormBlock>
          <FormBlock
            name="reserveInfo"
            title="预约信息"
            className="reserve-info"
            visible={Boolean(reservationConfig & 1)}
          >
            {Object.keys(reserveInfo).map(name => (
              <Field
                required
                key={name}
                name={name}
                editable={editable}
                {...reserveInfo[name]}
              />
            ))}
            <FormMegaLayout
              grid
              label="身份证图片"
              columns={2}
              required={editable}
              visible={Boolean(
                reservationConfig & RESERVATION_VISIBLE.IDPicture
              )}
            >
              <Field
                editable={editable}
                key="idCardImgFront"
                type="image-upload"
                name="idCardImgFront"
                x-props={{
                  action: '/ygw/api/upload/csm/ifs/uploadFile',
                  message: '身份证正面',
                }}
                x-rules={[{ required: editable, message: '请上传身份证正面' }]}
                visible={Boolean(
                  reservationConfig & RESERVATION_VISIBLE.IDPicture
                )}
              />
              <Field
                editable={editable}
                key="idCardImgBack"
                name="idCardImgBack"
                type="image-upload"
                x-props={{
                  action: '/ygw/api/upload/csm/ifs/uploadFile',
                  message: '身份证反面',
                }}
                x-rules={[{ required: editable, message: '请上传身份证反面' }]}
                visible={Boolean(
                  reservationConfig & RESERVATION_VISIBLE.IDPicture
                )}
              />
            </FormMegaLayout>
          </FormBlock>
          <FormBlock name="resultInfo" title="处理结果" className="result-info">
            {Object.keys(resultInfo).map(name => (
              <Field
                required
                key={name}
                name={name}
                {...resultInfo[name]}
                editable={editable && payStatus}
              />
            ))}
          </FormBlock>
        </SchemaForm>
      </Content>
      <Footer wrapperClassName={cs({ hidden: !editable })}>
        <Button onClick={handleSave} type="primary">
          提交办理
        </Button>
        <Button onClick={handleClose}>关闭订单</Button>
      </Footer>
    </Layout>
  )
}
