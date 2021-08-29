import React, { useMemo, useState, useEffect } from 'react'
import { SchemaForm, createFormActions } from '@formily/antd'
import { Input, Switch, DatePicker, ArrayTable } from '@formily/antd-components'
import { Button, message } from 'antd'
import { history } from 'umi'
import cs from 'classnames'
import moment from 'moment'
import http from '@/api'

import { Layout } from '@/components'
import { useFetch } from '@/hooks'

import { flatRegion, formatMoney } from '@/assets/utils'

import components from '../form'

import BasicConfig from '../basic-config'
import PictureConfig from '../picture-config'
import PushConfig from '../push-config'
import FsRewardConfig from '../fs-reward-config'
import SmRewardConfig from '../sm-reward-config'

import { TARGET_SELECT } from '../../constant'
import { formatRuleAwards } from '../../utils'
import useEffects from './effects'

import './index.less'

const { Header, Content, Footer } = Layout

export default props => {
  const { id, title, isAdd = false, isEdit = false, isDetail = false } = props

  const [draft, setDraft] = useState<any>()
  const [detail, setDetail] = useState<any>()

  const fetchDetail = async params => {
    const { success, data } = await http.get('material/detail', params)
    if (success) {
      setDetail(data)
    }
  }

  const fetchDraft = async () => {
    const {
      success,
      data: { draftJson = '{}' },
    } = await http.get('material/getDraft')
    if (success) {
      setDraft(JSON.parse(draftJson))
    }
  }

  const materialDraft = useFetch(fetchDraft)
  const materialDetail = useFetch(fetchDetail)

  const handleBack = () => {
    history.goBack()
  }

  const handleDraft = () => {
    const { values = {} } = actions.getFormState()
    http
      .post('material/saveDraft', {
        draftJson: JSON.stringify(values),
      })
      .then(res => {
        if (res.success) {
          message.destroy()
          message.success('暂存成功')
        }
      })
  }

  const handleSave = () => {
    actions.submit().then(({ values }) => {
      const {
        dataType,
        title,
        smsContent,
        activityExist,
        activityId,
        activityUrl,
        validPeriod = [],
        targetSelect,
        appletsType,

        friendType,
        publicTitle,
        publicAbstract,
        listImg,
        thumbnail,
        appPop,
        appAd,
        qRcode,
        msgCover,
        fsReward,
        smReward,
      } = values

      // 活动类型：1集团模式 2市场模式
      const isGroup = dataType === 1
      const isMarket = dataType === 2

      const basicConfig: any = {
        dataType,
        title,
        smsContent,
        activityUrl,
        targetSelect,
        appletsType: appletsType ? 1 : 0,
      }

      if (validPeriod.length > 0) {
        const [activityBeginTime, activityEndTime] = validPeriod
        basicConfig.activityBeginTime = moment(activityBeginTime)
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        basicConfig.activityEndTime = moment(activityEndTime)
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
      }

      if (activityExist) {
        basicConfig.activityId = activityId
      }

      const [selectFile, selectArea, selectUserTag] = TARGET_SELECT
      switch (targetSelect) {
        case selectFile.value: {
          // 选择文件
          const {
            value = [],
            props: { enum: dataSource },
          } = actions.getFieldState('targetCustomer')

          const valueOptions = dataSource.filter(item =>
            value.includes(item.value)
          )
          if (valueOptions.length > 0) {
            basicConfig.targetType = valueOptions[0].listType
            basicConfig.regionWls = valueOptions.map(item => ({
              wlsId: item.value,
              wlsName: item.label,
            }))
          }
          break
        }
        case selectArea.value: {
          // 选择地市
          const state = actions.getFieldState('area')
          const flatRegions = flatRegion(3)
          const { value = [] } = state
          basicConfig.regionWls = value.map(item => ({
            wlsId: item,
            wlsName: (flatRegions.find(d => item === d.value) || {}).label,
          }))
          break
        }
        case selectUserTag.value: {
          // 选择客户群标签
          const { value = [] } = actions.getFieldState('userTags')
          basicConfig.regionWls = value.map(item => ({
            wlsId: item.custId,
            wlsName: item.custName,
          }))
          break
        }

        default: {
          break
        }
      }

      const pushConfig = {
        friendType: friendType ? 1 : 0,
        publicTitle,
        publicAbstract,
      }

      // forwardConfig
      const pictureConfig = [
        {
          imageType: 1, // 列表图
          imageUrl: listImg,
        },
        {
          imageType: 3, // APP弹窗
          imageUrl: appPop,
        },
        {
          imageType: 4, // APP广告位
          imageUrl: appAd,
        },
        {
          imageType: 6, // 消息封面
          imageUrl: msgCover,
        },
      ]

      // 缩略图
      if (thumbnail) {
        pictureConfig.push({
          imageType: 2, // 缩略图
          imageUrl: thumbnail,
        })
      }

      // 二维码活动
      if (qRcode) {
        pictureConfig.push({
          imageType: 5,
          imageUrl: qRcode,
        })
      }

      // 格式化友好客户奖励配置
      let formatFsReward
      if (fsReward.awardMode === 1) {
        // 按订单：格式化订单金额
        formatFsReward = {
          awardMode: fsReward.awardMode,
          orderAward: formatMoney(fsReward.orderAward, 'toCent'),
        }
      } else if (fsReward.awardMode === 2) {
        // 按规则
        formatFsReward = {
          awardMode: fsReward.awardMode,
          ruleAwards: formatRuleAwards(fsReward.ruleAwards, 'toCent'),
        }
      }
      // 格式化讯盟奖励配置
      let formatSmReward
      if (smReward.awardMode === 1) {
        // 按订单：格式化订单金额
        formatSmReward = {
          awardMode: smReward.awardMode,
          orderAward: formatMoney(smReward.orderAward, 'toCent'),
        }
      } else if (smReward.awardMode === 2) {
        // 按规则
        formatSmReward = {
          awardMode: smReward.awardMode,
          ruleAwards: formatRuleAwards(smReward.ruleAwards, 'toCent'),
        }
      }

      const awardConfig = []
      if (isGroup) {
        // 集团模式：友好客户奖励配置、讯盟奖励配置
        if (friendType) {
          // 开启友好客户转发，需要配置友好客户奖励配置
          awardConfig.push({
            ...formatFsReward,
            awardType: 1,
          })
        }
        awardConfig.push({
          ...formatSmReward,
          awardType: 2,
        })
      }

      if (isMarket) {
        // 市场模式：讯盟奖励配置
        awardConfig.push({ ...formatSmReward, awardType: 2 })
      }

      const params = {
        ...basicConfig,
        ...pushConfig,
        forwardConfig: pictureConfig,
        awardConfig,
      }

      if (isEdit) {
        params.id = id
      }

      let url = 'material/save'
      if (isEdit) {
        url = 'material/update'
      }
      http.post(url, params).then(res => {
        if (res.success) {
          message.destroy()
          message.success('保存成功')
          handleBack()
        }
      })
    })
  }

  const actions = useMemo(() => createFormActions(), [])
  const defaultValue = useMemo(() => {
    if (detail) {
      const {
        id,
        dataType,
        title,
        status,
        smsContent,
        activityId,
        activityUrl,
        activityBeginTime,
        activityEndTime,
        targetSelect,
        appletsType,
        regionWls,
        friendType,
        publicTitle,
        publicAbstract,
        forwardConfig = [],
        awardConfig = [],
      } = detail

      const basicConfig: any = {
        dataType,
        title,
        status: isEdit ? status : -1,
        smsContent,
        activityUrl,
        activityExist: !!activityId,
        activityId,
        validPeriod: [activityBeginTime, activityEndTime],
        targetSelect,
        appletsType,
      }

      const [selectFile, selectArea, selectUserTag] = TARGET_SELECT
      switch (targetSelect) {
        case selectFile.value: {
          // 选择文件
          basicConfig.targetCustomer = regionWls.map(item => item.wlsId)
          break
        }
        case selectArea.value: {
          // 选择目标地市
          basicConfig.area = regionWls.map(item => item.wlsId)
          break
        }
        case selectUserTag.value: {
          // 选择客户群标签
          basicConfig.userTags = regionWls.map(item => ({
            custId: item.wlsId,
            custName: item.wlsName,
          }))
          break
        }
        default: {
          break
        }
      }

      const pushConfig = {
        friendType,
        publicTitle,
        publicAbstract,
      }

      const pictureConfig: any = {}
      forwardConfig.map(({ imageType, imageUrl }) => {
        switch (imageType) {
          case 1: {
            // 列表图
            pictureConfig.listImg = imageUrl
            break
          }
          case 2: {
            // 缩略图
            pictureConfig.thumbnail = imageUrl
            break
          }
          case 3: {
            // APP弹窗
            pictureConfig.appPop = imageUrl
            break
          }
          case 4: {
            // APP广告位
            pictureConfig.appAd = imageUrl
            break
          }
          case 5: {
            // 二维码活动
            pictureConfig.qRcode = imageUrl
            break
          }
          case 6: {
            // 消息封面
            pictureConfig.msgCover = imageUrl
            break
          }
          default: {
            break
          }
        }
      })

      // 友好客户奖励配置
      const originFsReward = awardConfig.find(item => item.awardType === 1) || {
        awardMode: 1,
      }
      let fsReward
      if (originFsReward.awardMode === 1) {
        // 按订单：格式化订单金额
        fsReward = {
          awardMode: originFsReward.awardMode,
          orderAward: formatMoney(originFsReward.orderAward, 'toYuan', {
            illegalCharacter: '',
          }),
        }
      } else if (originFsReward.awardMode === 2) {
        // 按规则
        fsReward = {
          awardMode: originFsReward.awardMode,
          ruleAwards: formatRuleAwards(originFsReward.ruleAwards),
        }
      }

      // 迅盟奖励配置
      const originSmReward = awardConfig.find(item => item.awardType === 2) || {
        awardMode: 1,
      }
      let smReward
      if (originSmReward.awardMode === 1) {
        // 按订单：格式化订单金额
        smReward = {
          awardMode: originSmReward.awardMode,
          orderAward: formatMoney(originSmReward.orderAward, 'toYuan', {
            illegalCharacter: '',
          }),
        }
      } else if (originSmReward.awardMode === 2) {
        // 按规则
        smReward = {
          awardMode: originSmReward.awardMode,
          ruleAwards: formatRuleAwards(originSmReward.ruleAwards),
        }
      }

      return {
        ...basicConfig,
        ...pushConfig,
        ...pictureConfig,
        fsReward,
        smReward,
      }
    }

    return {
      dataType: 1, // 集团活动
      targetSelect: 1,
      activityExist: true,
      appletsType: false, // 小程序办理
      friendType: false, // 友好客户转发
      // 友好客户配置
      fsReward: {
        awardMode: 1,
      },
      // 讯盟奖励配置
      smReward: {
        awardMode: 1,
      },
      ...draft,
    }
  }, [detail, draft])

  useEffect(() => {
    if (id) {
      materialDetail.onFetch({ id })
    }

    if (isAdd) {
      materialDraft.onFetch()
    }
  }, [id])

  // 是否可编辑：新增/编辑，即非详情页
  const editable = !isDetail
  const loading = materialDetail.loading || materialDraft.loading

  return (
    <Layout wrapperClassName="material">
      <Header title={title} onBack={handleBack} />
      <Content wrapperClassName="material__content">
        {!loading && (
          <SchemaForm
            labelCol={3}
            wrapperCol={16}
            actions={actions}
            editable={editable}
            effects={useEffects}
            validateFirst={true}
            defaultValue={defaultValue}
            previewPlaceholder="暂未配置"
            components={{
              ...components,
              Input,
              Switch,
              RangePicker: DatePicker.RangePicker,
              ArrayTable,
            }}
          >
            <BasicConfig />
            <PushConfig />
            <PictureConfig />
            <FsRewardConfig />
            <SmRewardConfig />
          </SchemaForm>
        )}
      </Content>
      <Footer
        wrapperClassName={cs('material__footer', {
          hidden: !editable,
        })}
      >
        <Button type="primary" onClick={handleSave}>
          保存提交
        </Button>
        {isAdd && (
          <Button type="primary" ghost onClick={handleDraft}>
            暂存
          </Button>
        )}
        <Button onClick={handleBack}>取消</Button>
      </Footer>
    </Layout>
  )
}
