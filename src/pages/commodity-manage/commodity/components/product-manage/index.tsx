import React from 'react'
import { SchemaForm, SchemaMarkupField as Field } from '@formily/antd'

import components from './form'
import useEffects from './effects'

export default props => {
  const { actions, values, enableEdit } = props

  return (
    <SchemaForm
      actions={actions}
      effects={useEffects}
      editable={enableEdit}
      initialValues={values}
      components={components}
    >
      <Field type="string" name="skuList" x-component="DraggableTable" />
    </SchemaForm>
  )
}
