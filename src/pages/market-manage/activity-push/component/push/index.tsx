import React, { useMemo, useState, useEffect } from 'react'
import { Button, message } from 'antd'
import { history } from 'umi'
import { SchemaForm, createFormActions } from '@formily/antd'
import cs from 'classnames'
import http from '@/api'
import { Layout } from '@/components'
import { useFetch } from '@/hooks'
import components from '../form'
import PushConfig from '../push-config'
import MaterialConfig from '../material-config'
import { PUBLISH_RANGE } from '../../constant'

import './index.less'

const { Header, Content, Footer } = Layout
const [
  enumSingleGrant, // 精准下发（单个输入）
  enumBatchGrant, // 精准下发（批量导入）
  enumTargetClientListImport, // 目标客户名单导入
  enumTargetListImport, // 目标名单导入
  enumCustomerLabel, // 客户群标签用户
] = PUBLISH_RANGE
export default props => {
  const { title, isDetail = false, id, useEffects } = props
  const [detail, setDetail] = useState<any>()
  const actions = useMemo(() => createFormActions(), [])

  const fetchDetail = async params => {
    const { success, data } = await http.get('push/detail', params)
    if (success) {
      setDetail(data)
    }
  }

  const info = useFetch(fetchDetail)

  const handleBack = () => {
    history.goBack()
  }

  const handleSave = () => {
    actions.submit().then(({ values = {} }) => {
      const {
        activity = {},
        publishRange,
        singleGrant = [], // 精准下发（单个输入）
        batchGrant = {}, // 精准下发（批量导入）
        targetClientListImport = [], // 目标客户名单导入
        targetListImport = [], // 目标名单导入
        publishMode,
        appPop,
        appAd,
        msgCover,
        freeSms,
      } = values

      const { id, dataType } = activity

      // 1集团模式 2市场模式
      const isGroup = dataType === 1 // 集团活动
      const isMarket = dataType === 2 // 市场活动

      const materialConfig: any = {
        materialId: id,
        publishRange,
      }

      if (isGroup) {
        // 精准下发（单个输入）
        if (publishRange === enumSingleGrant.value) {
          materialConfig.attachContent = singleGrant.map(item => ({
            id: item.value,
            name: item.label,
          }))
        }
        // 精准下发（批量导入）
        if (publishRange === enumBatchGrant.value) {
          materialConfig.attachContent = [
            { id: batchGrant.list.join(','), name: batchGrant.name },
          ]
        }
        // 目标客户名单选择
        if (publishRange === enumTargetClientListImport.value) {
          materialConfig.attachIds = targetClientListImport.map(item => ({
            id: item.value,
            name: item.label,
          }))
        }
      }

      if (isMarket) {
        // 目标名单选择
        if (publishRange === enumTargetListImport.value) {
          materialConfig.attachIds = targetListImport.map(item => ({
            id: item.value,
            name: item.label,
          }))
        }
      }

      const forwardConfigs = []
      appPop && forwardConfigs.push(1)
      appAd && forwardConfigs.push(2)
      msgCover && forwardConfigs.push(4)
      freeSms && forwardConfigs.push(16)

      if (forwardConfigs.length === 0) {
        message.warning('至少选择一种推送方式')
      }

      const pushConfig = {
        publishMode,
        forwardConfigs,
      }

      const params = {
        ...materialConfig,
        ...pushConfig,
      }

      http.post('push/save', params).then(res => {
        if (res.success) {
          message.success('保存成功')
          handleBack()
        }
      })
    })
  }

  useEffect(() => {
    id && info.onFetch({ id })
  }, [id])

  const initialValues = useMemo(() => {
    if (detail) {
      const {
        materialId,
        publishRange,
        publishMode,
        forwardConfigs = [],
        attachs,
      } = detail

      const attachConfig = attachs

      const materialConfig: any = {
        activity: {
          id: materialId,
        },
        publishRange,
      }

      switch (publishRange) {
        case enumSingleGrant.value: {
          // 精准下发（单个输入）
          materialConfig.singleGrant = attachConfig.map(item => ({
            label: item.name,
            value: item.id,
          }))
          break
        }
        case enumBatchGrant.value: {
          // 精准下发（批量导入）
          const [first = {}] = attachConfig
          materialConfig.batchGrant = {
            name: first.name,
            list: first.id.split(',').map(Number),
          }
          break
        }
        case enumTargetClientListImport.value: {
          // 目标客户名单选择
          materialConfig.targetClientListImport = attachConfig.map(
            item => item.id
          )
          break
        }
        case enumTargetListImport.value: {
          // 目标名单选择
          materialConfig.targetListImport = attachConfig.map(item => item.id)
          break
        }
      }
      const pushConfig = {
        publishMode,
        appPop: forwardConfigs.includes(1),
        appAd: forwardConfigs.includes(2),
        msgCover: forwardConfigs.includes(4),
        freeSms: forwardConfigs.includes(16),
      }

      return {
        ...materialConfig,
        ...pushConfig,
      }
    }
  }, [detail])

  const editable = !isDetail
  const loading = id ? info.loading : false

  return (
    <Layout>
      <Header title={title} onBack={handleBack} />
      <Content wrapperClassName="push">
        <section className="tips-block">
          <p>
            1、如果推送活动是普惠大市场活动，只可选择普惠市场活动的目标客户名单进行推送。
          </p>
          <p>
            2、对于普惠大市场活动，渝企信个人用户可推送；非渝企信用户会进行短信下发提醒，用户激活渝企信后可收到“专属优惠”服务号的活动推送。
          </p>
          <p>
            3、对于集团以及集团市场活动只对集团、激活的渝企信用户进行活动推送。
          </p>
        </section>
        {!loading && (
          <SchemaForm
            labelCol={3}
            wrapperCol={16}
            actions={actions}
            editable={editable}
            effects={useEffects}
            validateFirst={true}
            components={components}
            previewPlaceholder="暂无配置"
            initialValues={initialValues}
          >
            <MaterialConfig />
            <PushConfig />
          </SchemaForm>
        )}
      </Content>
      <Footer
        wrapperClassName={cs({
          hidden: !editable,
        })}
      >
        <Button type="primary" onClick={handleSave}>
          确认推送
        </Button>
        <Button onClick={handleBack}>取消</Button>
      </Footer>
    </Layout>
  )
}
