import React from 'react'
import cookies from 'react-cookies'
import { createFormActions, FormEffectHooks } from '@formily/antd'
import http from '@/api'
import {
  PUBLISH_RANGE,
  PUSH_USERS,
  FREE_SMS,
  SUBSCRIPT_MAP,
} from '../../constant'

const { onFieldValueChange$, onFieldChange$ } = FormEffectHooks

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
              state.editable = false
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
        state.editable = true
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
        state.value = (dataSource[0] || {}).value
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
        state.value = Group.value
      }

      if (isMarket) {
        // 市场活动
        state['props'].enum = [
          targetCustomer, // 市场目标客户
        ]
        state.value = targetCustomer.value
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
    })

    forwardConfig.map(item => {
      switch (item.imageType) {
        case 3: {
          // APP弹窗
          setFieldState('appPop', state => {
            state.value = true
            state.props['x-props'].content = <img src={item.imageUrl} />
          })
          break
        }
        case 4: {
          // APP广告位
          setFieldState('appAd', state => {
            state.value = true
            state.props['x-props'].content = <img src={item.imageUrl} />
          })
          break
        }
        case 6: {
          // 消息封面
          setFieldState('msgCover', state => {
            state.value = true
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
      state.value = []
    })
    // 精准下发：批量导入
    setFieldState('batchGrant', state => {
      state.props['x-props'].materialId = materialId
      state.visible = value === batchGrant.value // 精准下发（批量导入）
      state.value = []
    })
    // 目标客户名单导入
    setFieldState('targetClientListImport', state => {
      state.props['x-props'].params = {
        materialId,
      }
      state.visible = value === targetClientListImport.value // 目标客户名单导入
      state.value = []
    })
    // 目标名单导入
    setFieldState('targetListImport', state => {
      state.visible = value === targetListImport.value // 目标名单导入
      state.value = []
    })
  })

  // 推送人群
  onFieldValueChange$('publishMode').subscribe(({ value }) => {
    const [, Friend] = PUSH_USERS
    setFieldState('appPop', state => {
      state.value = true
      state.editable = value !== Friend.value
    })
    setFieldState('appAd', state => {
      state.value = true
      state.visible = value !== Friend.value
      state.editable = value !== Friend.value
    })
    setFieldState('msgCover', state => {
      state.value = true
      state.editable = value !== Friend.value
    })
    setFieldState('freeSms', state => {
      state.value = true
      state.editable = value !== Friend.value
      if (value === 2) {
        state.props['x-props'].content = FREE_SMS.FRIEND
      } else {
        state.props['x-props'].content = FREE_SMS.GROUP
      }
    })
  })
}
