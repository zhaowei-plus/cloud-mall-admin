import React, { useEffect, useState, useMemo, Fragment } from 'react'
import { Button, message } from 'antd'
import cookies from 'react-cookies'
import { history, useParams } from 'umi'
import { FormProvider, createFormActions } from '@formily/antd'
import cs from 'classnames'

import http from '@/api'
import { Layout } from '@/components'
import { IResponse } from '@/assets/constant'
import { htmlCodec } from '@/assets/utils'

import CommodityInfo from '../commodity-info'
import CommoditySummary from '../commodity-summary'
import ProductManage from '../product-manage'
import ReservationInfo from '../reservation-info'

import './index.less'

import {
  ReservationConfig,
  validCommodityInfo,
  validCommoditySummary,
  validProductManage,
  validReservationInfo,
} from './utils'

const { Header, Content, Footer } = Layout

interface IProps {
  isAdd?: boolean
  isEdit?: boolean
  isDetail?: boolean
  title?: string
  params?: any
}

export default (props: IProps) => {
  const {
    params = {},
    isAdd = false,
    isEdit = false,
    isDetail = false,
    title,
  } = props
  const { itemId, ...rest } = params
  const resourceId = cookies.load('resourceId')
  const [detail, setDetail] = useState<any>()

  const [
    commodityInfoAction,
    commoditySummaryAction,
    productManageAction,
    reservationInfoAction,
  ] = useMemo(
    () => [
      createFormActions(),
      createFormActions(),
      createFormActions(),
      createFormActions(),
    ],
    []
  )

  const fetchDraft = () => {
    http.post('commodity/getDraft').then((res: IResponse) => {
      const { success, data = [] } = res
      if (success) {
        const detail = data.reduce(
          (total, { itemDraftType, itemDraftInfoJson }) => {
            if (itemDraftInfoJson) {
              const values = JSON.parse(itemDraftInfoJson)
              return { ...total, ...values }
            }
            return { ...total }
          },
          {}
        )
        setDetail(detail)
      }
    })
  }

  const fetchDetail = itemId => {
    http
      .get('commodity/detail', { itemId, resourceId })
      .then((res: IResponse) => {
        if (res.success) {
          setDetail(res.data)
        }
      })
  }

  const handleSave = () => {
    const {
      values: commodityInfo,
      valid: commodityValid,
    } = commodityInfoAction.getFormState()
    const { values: commoditySummary } = commoditySummaryAction.getFormState()
    const { values: productManage } = productManageAction.getFormState()
    const { values: reservationInfo } = reservationInfoAction.getFormState()
    message.destroy()

    if (!commodityValid) {
      message.warn('??????????????????????????????')
      return false
    }

    const validInfoError = validCommodityInfo(commodityInfo)
    if (validInfoError) {
      message.warn('?????????????????????')
      return false
    }
    commodityInfo.catId = commodityInfo.catId ? commodityInfo.catId : -1

    const validSummaryError = validCommoditySummary(commoditySummary)
    if (validSummaryError) {
      message.warn('?????????????????????')
      return false
    }

    const validProductError = validProductManage(productManage)
    if (validProductError) {
      message.warn(validProductError)
      return false
    }

    const validReservationError = validReservationInfo(reservationInfo)
    if (validReservationError) {
      message.warn(validReservationError)
      return false
    }

    const { status, configFields = [] } = reservationInfo
    const preManagerflag = configFields.reduce(
      (result, item) => result | item,
      status
    )

    // ?????????????????????????????????????????????????????????
    const { buyType } = commodityInfo
    const { skuList = [] } = productManage
    const isOnlineBuy = [1, 2].includes(buyType)
    const isOnlineReservation = +buyType === 3
    if (isOnlineBuy) {
      const result = skuList.every(item => item.priceType === 1)
      if (!result) {
        message.warn('????????????????????????????????????????????????????????????')
        return false
      }
    }
    if (isOnlineReservation) {
      const result = skuList.every(item => item.priceType === 2)
      if (!result) {
        message.warn('????????????????????????????????????????????????????????????')
        return false
      }
    }

    const params = {
      resourceId,
      ...commodityInfo,
      introduction: htmlCodec.encode(commoditySummary.introduction),
      ...productManage,
      preManagerflag,
    }

    if (isAdd) {
      http.post('commodity/add', params).then((res: IResponse) => {
        if (res.success) {
          message.success('????????????')
          history.goBack()
        }
      })
    }

    if (isEdit) {
      http
        .post('commodity/update', { ...params, itemId })
        .then((res: IResponse) => {
          if (res.success) {
            message.success('????????????')
            history.goBack()
          }
        })
    }
  }

  const handleBack = () => {
    history.goBack()
  }

  useEffect(() => {
    if (itemId) {
      fetchDetail(itemId)
    } else {
      fetchDraft()
    }
  }, [itemId])

  const commodity = useMemo(() => {
    if (detail) {
      const {
        id,
        name, // ????????????
        itemImg, // ????????????
        itemCode, // ????????????
        catId, //????????????
        supplierId, // ?????????ID
        buyType, // ????????????
        itemInst, // ????????????
        caiyunType, // ???????????????
        userType, // ????????????
        introduction, // ????????????
        skuList = [],
        status,
        preManagerflag,
      } = Object.assign({}, detail, rest)

      return {
        info: {
          id,
          status,
          name,
          itemImg,
          itemCode,
          catId: catId === -1 ? undefined : catId,
          supplierId,
          buyType,
          itemInst,
          caiyunType,
          userType,
        },
        summary: {
          introduction: htmlCodec.decode(introduction),
        },
        products: {
          skuList,
        },
        reservation: ReservationConfig.analyze(preManagerflag),
      }
    }
    return {
      info: rest,
    }
  }, [detail])
  const enableEdit = isAdd || isEdit

  return (
    <Layout>
      <Header title={title} onBack={handleBack} />
      <FormProvider>
        <Content wrapperClassName="edit-commodity">
          <CommodityInfo
            actions={commodityInfoAction}
            values={commodity.info}
            enableEdit={enableEdit}
            isAdd={isAdd}
          />
          <CommoditySummary
            actions={commoditySummaryAction}
            values={commodity.summary}
            enableEdit={enableEdit}
          />
          <ProductManage
            actions={productManageAction}
            values={commodity.products}
            enableEdit={enableEdit}
          />
          <ReservationInfo
            actions={reservationInfoAction}
            values={commodity.reservation}
            enableEdit={enableEdit}
          />
        </Content>
        <Footer
          wrapperClassName={cs({
            hidden: isDetail,
          })}
        >
          <Button onClick={handleSave} type="primary">
            ??????
          </Button>
          <Button onClick={handleBack}>??????</Button>
        </Footer>
      </FormProvider>
    </Layout>
  )
}
