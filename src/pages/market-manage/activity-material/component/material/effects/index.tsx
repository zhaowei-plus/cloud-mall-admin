import React from 'react'
import { createFormActions, FormEffectHooks, FormPath } from '@formily/antd'

import http from '@/api'
import store from '@/store'
import { PROVINCE } from '@/assets/constant'
import { REWARD_CONFIG, MARK_TYPE } from '../constant'
import {
  TARGET_SELECT,
  PUSH_USERS,
  REWARD_TYPES,
  EDITABLE_FIELD,
} from '../../../constant'

const {
  onFormInit$,
  onFieldValueChange$,
  onFieldInputChange$,
  onFieldChange$,
} = FormEffectHooks

export default () => {
  const { setFormState, setFieldState } = createFormActions()
  const province = store.getState().province

  // Form 初始化
  onFormInit$().subscribe(() => {
    MARK_TYPE.hidden.map(key => {
      setFieldState(key, state => {
        state.display = false
      })
    })
  })

  onFieldValueChange$('status').subscribe(({ value }) => {
    // 待上架，所有项都可编辑
    const isEditable = [1].includes(value)
    // 未开始、已推送、进行中, 则只能编辑活动名称、短信内容、活动结束时间、公众号标题、公众号摘要
    const isPartEditable = [2, 3, 4].includes(value)

    setFormState(state => {
      state.editable = value === -1 ? true : isEditable // 如果是待上架状态，所有项可修改，否则只有特定项可修改
    })

    if (isPartEditable) {
      EDITABLE_FIELD.map(field => {
        setFieldState(field, state => {
          state.editable = true
        })
      })

      setFieldState('validPeriod', state => {
        state.props['x-component-props'].disabled = [true, false]
      })
    }
  })

  onFieldInputChange$('dataType').subscribe(({ value }) => {
    // 活动类型：1集团模式 2市场模式
    const isGroup = value === 1
    const isMarket = value === 2

    // 目标客户选择项
    setFieldState('targetSelect', state => {
      const [selectFile, selectArea] = TARGET_SELECT
      if (isGroup) {
        state.value = selectFile.value
      }

      if (isMarket) {
        state.value = selectArea.value
      }
    })

    setFieldState('friendType', state => {
      state.value = false
    })
  })

  // 活动类型
  onFieldValueChange$('dataType').subscribe(({ value }) => {
    // 活动类型：1集团模式 2市场模式
    const isGroup = value === 1
    const isMarket = value === 2

    // 不同活动模式下隐藏的表单项
    MARK_TYPE.hidden.map(key => {
      setFieldState(key, state => {
        state.display = !(value === MARK_TYPE.type)
      })
    })

    // 市场模式
    setFieldState('friendType', state => {
      state.display = isGroup
    })

    setFieldState('targetSelect', state => {
      const [selectFile, selectArea, selectUserTag] = TARGET_SELECT
      state.display = true

      // 集团模式：选择文件  / 市场模式：全体渝企信用户
      const dataSource = isGroup ? [selectFile] : [selectArea]

      // 只有浙江环境
      if (province === PROVINCE.ZJ) {
        dataSource.push(selectUserTag) // 选择用户群标签
      }

      state['props'].enum = dataSource
    })

    setFieldState('pushUsers', state => {
      const [xmUser, accountManager] = PUSH_USERS

      // 集团模式
      if (isGroup) {
        state.value = [xmUser.value, accountManager.value]
      }
      // 市场模式
      if (isMarket) {
        state.value = [xmUser.value]
      }
    })
  })

  onFieldValueChange$('activityExist').subscribe(({ value }) => {
    // 选择用户全标签
    setFieldState('activityId', state => {
      state.display = !!value
    })
  })

  // 目标客户
  onFieldValueChange$('targetSelect').subscribe(({ value }) => {
    const [selectFile, selectArea, selectUserTag] = TARGET_SELECT
    // 选择文件
    setFieldState('targetCustomer', state => {
      state.display = value == selectFile.value
    })
    // 选择目标地市
    setFieldState('area', state => {
      state.display = value == selectArea.value
    })
    // 选择客户群标签
    setFieldState('userTags', state => {
      state.display = value == selectUserTag.value
    })

    if (value === selectFile.value) {
      // 查询选择文件列表
      http.get('material/customerList').then(res => {
        const { success, data = [] } = res
        if (success) {
          const dataSource = data.map(item => ({
            label: item.title,
            value: item.id,
            disabled: false,
            listType: item.listType,
            count: item.caiyunNum,
          }))
          setFieldState('targetCustomer', state => {
            state['props'].enum = dataSource
          })
        }
      })
    }
  })

  // 目标客户：选择文件发生修改
  onFieldChange$('targetCustomer').subscribe(fieldState => {
    const {
      value = [],
      props: { enum: dataSource },
    } = fieldState
    const valueOptions = dataSource.filter(item => value.includes(item.value))

    // 目标客户类型
    let listType = -1
    if (valueOptions.length > 0) {
      listType = valueOptions[0].listType
    }

    // 目标客户数量
    const userCount = valueOptions.reduce((count, item) => {
      return count + item.count
    }, 0)

    setFieldState('targetCustomer', state => {
      state.description = userCount > 0 ? `共计${userCount}人` : ''
      state['props'].enum = dataSource.map(item => ({
        ...item,
        disabled: listType === -1 ? false : item.listType !== listType,
      }))
    })
  })

  // 友好客户转发
  onFieldValueChange$('friendType').subscribe(({ value }) => {
    // 友好客户奖励配置
    setFieldState('fsRewardConfig', state => {
      state.display = !!value
    })
  })

  // 奖励配置
  REWARD_CONFIG.map(key => {
    onFieldValueChange$(`${key}.awardMode`).subscribe(({ value }) => {
      const [orderAward, ruleAwards] = REWARD_TYPES
      setFieldState(`${key}.orderAward`, state => {
        state.display = value === orderAward.value // 按订单
      })
      setFieldState(`${key}.ruleAwards`, state => {
        state.display = value === ruleAwards.value // 按规则
      })
    })
  })
}
