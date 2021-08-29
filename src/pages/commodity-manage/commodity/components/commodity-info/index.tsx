import React, { useState, useEffect } from 'react'
import { Button, message, Typography } from 'antd'
import cs from 'classnames'
import cookies from 'react-cookies'
import { useParams } from 'umi'
import {
  SchemaForm,
  SchemaMarkupField as Field,
  FormButtonGroup,
  Submit,
} from '@formily/antd'
import { FormBlock, FormItemGrid, FormCard } from '@formily/antd-components'

import http from '@/api'
import { IResponse } from '@/assets/constant'
import { validCommodityInfo } from '../edit-commodity/utils'
import { USER_TYPES } from '@/assets/constant'
import { BUY_TYPES } from './constant'
import useEffects from './effects'

import './index.less'

interface IProps {
  actions: any
  values: any
  enableEdit: boolean
  isAdd?: boolean
}

const { Title, Paragraph } = Typography

export default (props: IProps) => {
  const { itemId } = useParams()
  const resourceId = cookies.load('resourceId')
  const { actions, values, enableEdit, isAdd } = props
  const [key, setKey] = useState(new Date().valueOf())
  const [editable, setEditable] = useState(false)
  const [initialValues, setInitialValues] = useState(values)

  const [supply, setSupply] = useState<any>({
    dataSource: [],
  })
  const [categoryList, setCategoryList] = useState([])
  const [provinceList, setProvinceList] = useState([])

  const handleSubmit = (params = {}) => {
    const error = validCommodityInfo(params)
    if (!error) {
      if (!itemId) {
        // 新增
        http
          .post('commodity/saveDraft', {
            itemDraftType: 1,
            itemDraftInfoJson: JSON.stringify(params),
          })
          .then((res: IResponse) => {
            if (res.success) {
              message.success('保存成功')
            } else {
              message.error(res.msg || '保存失败')
              return false
            }
          })
      }

      // 更新数据信息
      setInitialValues(params)
      setKey(new Date().valueOf())
      setEditable(false)
      return true
    } else {
      // 文本态
      if (!(enableEdit && editable)) {
        message.warn('请完善商品信息')
        return false
      } else {
        message.warn(error)
        return false
      }
    }
  }

  // 查询商品类目
  const fetchCategoryList = () => {
    http.get('category/list', { resourceId }).then(res => {
      if (res.success) {
        setCategoryList(
          res.data.rows.map(item => ({
            label: item.name,
            value: item.id,
          }))
        )
      }
    })
  }

  // 查询渝企信省份
  const fetchProvinceList = () => {
    http.post('commodity/province').then(({ success, data }) => {
      if (success) {
        const { name: label, id: value } = data
        setProvinceList([{ label, value }])
      }
    })
  }

  // 查询收款方
  const fetchSupplierList = () => {
    http.get('user/supplies', { resourceId }).then((res: any) => {
      const { success, data } = res
      if (success) {
        const { required, selectList = [] } = data
        let defaultValue = undefined
        if (required) {
          const defaultSelected = selectList.find(s => s.selected)
          if (defaultSelected) {
            defaultValue = defaultSelected.id
          }
        }
        setSupply({
          required,
          dataSource: selectList.map(item => ({
            label: item.name,
            value: Number(item.id),
          })),
          default: defaultValue,
        })
      }
    })
  }

  const handleEdit = () => {
    setEditable(true)
  }

  const handleCancel = () => {
    actions.reset().then(() => {
      setEditable(false)
    })
  }

  const descValidator = value => {
    if (value) {
      if (value.length > 30) {
        return '商品说明最长30为字符'
      }
    }
  }

  useEffect(() => {
    if (resourceId) {
      fetchCategoryList()
      fetchProvinceList()
      fetchSupplierList()
    }
  }, [resourceId])

  useEffect(() => {
    setInitialValues(values)
  }, [values])

  return (
    <Typography className="form">
      <Title level={2}>
        商品信息
        {!editable && enableEdit && (
          <Button type="link" onClick={handleEdit}>
            编辑
          </Button>
        )}
      </Title>
      <Paragraph>
        <SchemaForm
          key={key}
          actions={actions}
          editable={editable}
          effects={useEffects}
          onSubmit={handleSubmit}
          previewPlaceholder=" "
          className="commodity-info"
          initialValues={initialValues}
        >
          <FormItemGrid cols={[4, 20]}>
            <FormBlock className="commodity-info__icon">
              <Field
                type="image-upload"
                name="itemImg"
                x-props={{
                  action: '/ygw/api/upload/csm/ifs/uploadFile',
                  max: 5 * 1024 * 1024,
                  message: '255X255',
                  sizeVerify: true,
                  width: 255,
                  height: 255,
                }}
              />
            </FormBlock>
            <FormCard className="commodity-info__content">
              <Field
                type="xm-string"
                name="itemCode"
                title="商品编码"
                x-props={{
                  placeholder: '请输入',
                  maxLength: 15,
                }}
                editable={false}
              />
              <Field
                type="xm-string"
                name="name"
                title="商品名称"
                x-props={{
                  placeholder: '请输入',
                }}
              />
              <Field
                type="string"
                name="catId"
                title="商品类别"
                enum={categoryList}
                x-props={{
                  placeholder: '请选择',
                  allowClear: true,
                }}
              />
              <Field
                type="string"
                name="supplierId"
                title="收款方公司"
                enum={supply.dataSource}
                default={supply.default}
                x-props={{
                  placeholder: '请选择',
                  allowClear: true,
                }}
              />
              <Field
                type="string"
                name="buyType"
                title="购买方式"
                enum={BUY_TYPES}
                x-props={{
                  placeholder: '请选择',
                  allowClear: true,
                }}
              />
              <Field
                type="string"
                name="caiyunType"
                title="渝企信省份"
                enum={provinceList}
                x-props={{
                  placeholder: '请选择',
                  allowClear: true,
                }}
              />
              <Field
                type="string"
                name="userType"
                title="用户类别"
                enum={USER_TYPES}
                x-props={{
                  placeholder: '请选择',
                  allowClear: true,
                }}
              />
              <Field
                type="xm-string"
                name="itemInst"
                title="商品说明"
                x-props={{
                  placeholder: '请输入30字符以内说明',
                }}
                x-rules={[{ validator: descValidator }]}
              />
            </FormCard>
          </FormItemGrid>
          <FormButtonGroup
            align="center"
            className={cs('form__footer', { hidden: !editable })}
          >
            <Submit>保存</Submit>
            <Button onClick={handleCancel}>取消</Button>
          </FormButtonGroup>
        </SchemaForm>
      </Paragraph>
    </Typography>
  )
}
