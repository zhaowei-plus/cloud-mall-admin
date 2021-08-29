import React, { Fragment } from 'react'
import { SchemaForm, FormButtonGroup, Submit, Reset } from '@formily/antd'
import { formatFormSchema, clearObject } from '@/assets/utils'

import './index.less'

interface IProps {
  schema: any
  onSearch: (params: object) => void
  // 获取搜索参数
  getParams?: (params: object) => void
  params?: {
    [key: string]: any
  }
  [key: string]: any
}

export default ({
  schema,
  onSearch,
  params: initialParams = {},
  ...rest
}: IProps) => {
  const onSubmit = (params: any = {}) => {
    onSearch(clearObject(params))
  }

  return (
    <Fragment>
      {schema && (
        <SchemaForm
          onSubmit={onSubmit}
          onReset={onSubmit}
          className="search"
          schema={{
            type: 'object',
            properties: formatFormSchema(schema),
          }}
          defaultValue={initialParams}
          {...rest}
        >
          <FormButtonGroup className="search__actions">
            <Submit loading={false}>查询</Submit>
            <Reset>重置</Reset>
          </FormButtonGroup>
        </SchemaForm>
      )}
    </Fragment>
  )
}
