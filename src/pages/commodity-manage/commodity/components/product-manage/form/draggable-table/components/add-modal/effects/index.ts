import { createFormActions, FormEffectHooks } from '@formily/antd'

const { onFieldValueChange$ } = FormEffectHooks

export default () => {
  const { setFieldState } = createFormActions()
  // 企业人数范围
  onFieldValueChange$('orgNumConfig.noLimit').subscribe(({ value = [] }) => {
    const noLimit = value.includes(-1)
    setFieldState('orgNumConfig.numDisabled', state => {
      state.visible = noLimit
    })
    setFieldState('orgNumConfig.range', state => {
      state.visible = !noLimit
    })
  })

  // 使用人数范围
  onFieldValueChange$('useNumConfig.noLimit').subscribe(({ value = [] }) => {
    const noLimit = value.includes(-1)
    setFieldState('useNumConfig.numDisabled', state => {
      state.visible = noLimit
    })
    setFieldState('useNumConfig.num', state => {
      state.visible = !noLimit
    })
  })

  // 容量限制
  onFieldValueChange$('capacityConfig.noLimit').subscribe(({ value = [] }) => {
    const noLimit = value.includes(-1)
    setFieldState('capacityConfig.numDisabled', state => {
      state.visible = noLimit
    })
    setFieldState('capacityConfig.num', state => {
      state.visible = !noLimit
    })
    setFieldState('capacityConfig.unit', state => {
      state.props['x-component-props'].disabled = noLimit
    })
  })

  // 数量限制
  onFieldValueChange$('numConfig.noLimit').subscribe(({ value = [] }) => {
    const noLimit = value.includes(-1)
    setFieldState('numConfig.numDisabled', state => {
      state.visible = noLimit
    })
    setFieldState('numConfig.num', state => {
      state.visible = !noLimit
    })
  })

  // 时效性限制
  onFieldValueChange$('timelinessConfig.noLimit').subscribe(
    ({ value = [] }) => {
      const noLimit = value.includes(-1)
      setFieldState('timelinessConfig.numDisabled', state => {
        state.visible = noLimit
      })
      setFieldState('timelinessConfig.num', state => {
        state.visible = !noLimit
      })
      setFieldState('timelinessConfig.unit', state => {
        state.props['x-component-props'].disabled = noLimit
      })
    }
  )

  // 产品价格
  onFieldValueChange$('productConfig.status').subscribe(({ value }) => {
    setFieldState('productConfig.price', state => {
      state.visible = value === 1
    })
    setFieldState('productConfig.input', state => {
      state.visible = value === 2
    })
  })

  // 优惠价
  onFieldValueChange$('favorableConfig.status').subscribe(({ value }) => {
    setFieldState('favorableConfig.amount', state => {
      state.visible = value === 1
    })
  })

  // 可销售库存
  onFieldValueChange$('stockConfig.noLimit').subscribe(({ value = [] }) => {
    const noLimit = value.includes(-1)
    setFieldState('stockConfig.numDisabled', state => {
      state.visible = noLimit
    })
    setFieldState('stockConfig.num', state => {
      state.visible = !noLimit
    })
  })
}
