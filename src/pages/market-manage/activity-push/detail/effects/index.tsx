import React from 'react'
import { createFormActions, FormEffectHooks } from '@formily/antd'
import cookies from 'react-cookies'
import http from '@/api'
import {
  PUBLISH_RANGE,
  PUSH_USERS,
  FREE_SMS,
  SUBSCRIPT_MAP,
} from '../../constant'

const {
  onFieldInitialValueChange$,
  onFieldValueChange$,
  onFieldChange$,
} = FormEffectHooks

const [
  singleGrant, // 精准下发（单个输入）
  batchGrant, // 精准下发（批量导入）
  targetClientListImport, // 目标客户名单导入
  targetListImport, // 目标名单导入
  customerLabel, // 客户群标签用户
] = PUBLISH_RANGE

export default () => {
  const { setFieldState } = createFormActions()
  const { inherentBiz } = cookies.load('user')
  const isManager = inherentBiz === 1

  onFieldInitialValueChange$('activity').subscribe(({ value = {} }) => {
    const { id } = value
    if (id) {
      // 查询地市列表
      http.get('material/detail', { id }).then(res => {
        const { success, data = {} } = res
        if (success) {
          setFieldState('activity', state => {
            state.value = data
          })
        }
      })
    }
  })

  // 活动素材
  onFieldValueChange$('activity').subscribe(({ value = {} }) => {
    const { id, dataType, friendType, forwardConfig = [], targetSelect } = value
    // 活动类型：1集团模式 2市场模式
    const isGroup = dataType === 1
    const isMarket = dataType === 2

    // 下发范围
    if (isManager) {
      // 客户经理
      !!id &&
        http.get('material/materialCmTarget', { materialId: id }).then(res => {
          const { success, data = {} } = res
          if (success) {
            const { count, type } = data
            const TypeMap = {
              1: '家企业',
              2: '个人数',
            }
            setFieldState('publishRange', state => {
              state.visible = true
              state['props'].enum = [
                { label: `共${count}${TypeMap[type]}`, value: 7 },
              ]
              state.value = 7
            })
          }
        })
    } else {
      // 其他
      setFieldState('publishRange', state => {
        state.visible = true
        state.materialId = id
        let dataSource = []

        if (isGroup) {
          // 集团活动
          dataSource = [
            singleGrant, // 精准下发（单个输入）
            batchGrant, // 精准下发（批量导入）
          ]
          // 选择文件
          if (targetSelect === 1) {
            dataSource.push(targetClientListImport)
          }
          // 选择客户群标签
          if (targetSelect === 2) {
            dataSource.push(customerLabel)
          }
        }

        if (isMarket) {
          // 市场活动
          dataSource = [
            targetListImport, // 目标名单导入
          ]
          // 选择客户群标签
          if (targetSelect === 2) {
            dataSource.push(customerLabel)
          }
        }
        state['props'].enum = dataSource.map((item, index) => ({
          ...item,
          label: `${SUBSCRIPT_MAP[index]}：${item.label}`, // 格式化选择项
        }))
      })
    }

    // 推送人群
    setFieldState('publishMode', state => {
      const [Group, Friend, targetCustomer] = PUSH_USERS
      state.visible = true
      if (isGroup) {
        // 集团活动
        state['props'].enum = [
          Group, // 集团成员
        ]
        if (friendType) {
          state['props'].enum.push(Friend) // 友好客户
        }
      }

      if (isMarket) {
        // 市场活动
        state['props'].enum = [
          targetCustomer, // 市场目标客户
        ]
      }
    })

    setFieldState('pushConfig.empty', state => {
      state.visible = false
    })
    // 推送人群
    setFieldState('pushConfig.publishMode', state => {
      state.visible = true
    })
    // 推送方式
    setFieldState('pushConfig.pushWay', state => {
      state.visible = true
      state['props']['x-component-props'].required = false
    })

    forwardConfig.map(item => {
      switch (item.imageType) {
        case 3: {
          // APP弹窗
          setFieldState('appPop', state => {
            state.props['x-props'].content = <img src={item.imageUrl} />
          })
          break
        }
        case 4: {
          // APP广告位
          setFieldState('appAd', state => {
            state.props['x-props'].content = <img src={item.imageUrl} />
          })
          break
        }
        case 6: {
          // 消息封面
          setFieldState('msgCover', state => {
            state.props['x-props'].content = <img src={item.imageUrl} />
          })
          break
        }
        default: {
          break
        }
      }
    })
  })

  onFieldChange$('publishRange').subscribe(({ materialId, value }) => {
    // 精准下发：单个输入
    setFieldState('singleGrant', state => {
      state.props['x-props'].materialId = materialId
      state.visible = value === singleGrant.value // 精准下发（单个导入）
    })
    // 精准下发：批量导入
    setFieldState('batchGrant', state => {
      state.props['x-props'].materialId = materialId
      state.visible = value === batchGrant.value // 精准下发（批量导入）
    })
    // 目标客户名单导入
    setFieldState('targetClientListImport', state => {
      state.props['x-props'].params = {
        materialId,
      }
      state.visible = value === targetClientListImport.value // 目标客户名单导入
    })
    // 目标名单导入
    setFieldState('targetListImport', state => {
      state.visible = value === targetListImport.value // 目标名单导入
    })
  })

  // 推送人群
  onFieldValueChange$('publishMode').subscribe(({ editable = true, value }) => {
    const [, Friend] = PUSH_USERS
    const canEditable = editable && value !== Friend.value
    setFieldState('appPop', state => {
      state.editable = canEditable
    })
    setFieldState('appAd', state => {
      state.visible = value !== Friend.value
      state.editable = canEditable
    })
    setFieldState('msgCover', state => {
      state.editable = canEditable
    })
    setFieldState('freeSms', state => {
      state.editable = canEditable
      if (value === 2) {
        state.props['x-props'].content = FREE_SMS.FRIEND
      } else {
        state.props['x-props'].content = FREE_SMS.GROUP
      }
    })
  })

  onFieldInitialValueChange$(
    `*(${['appPop', 'appAd', 'msgCover', 'freeSms'].join(',')})`
  ).subscribe(({ name, value }) => {
    setFieldState(name, state => {
      state.visible = value
    })
  })
}
