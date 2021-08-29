import React, { useMemo, useState, useEffect } from 'react'
import { Modal, message, Button } from 'antd'
import cookies from 'react-cookies'
import http from '@/api'
import {
  SchemaForm,
  Field,
  FormButtonGroup,
  Submit,
  FormSpy,
  createFormActions,
  FormEffectHooks,
} from '@formily/antd'
import { FormStep, FormCard } from '@formily/antd-components'
import { factoryValidLength, validMobile } from '@/assets/validator'
import { IResponse, STATUS } from '@/assets/constant'
import './index.less'
import { USER } from '@/assets/constant'
import { formatFormSchema } from '@/assets/utils'
import { getAddSchema } from '../../config'
import createUseEffects from './effects'

interface IProps {
  params: {
    [key: string]: any
  }
  onCancel: () => void
  onOk: () => void
}

export default (props: IProps) => {
  const user = cookies.load('user') || {}
  const resourceId = cookies.load('resourceId')
  // 特殊角色：迅盟用户/超管
  const { inherentBiz, accountTypeId } = user
  const isSpecialRole = [
    USER.SUPER_ADMIN,
    USER.XM_USER,
    USER.PROVINCE_ADMIN,
    USER.CITY_ADMIN,
    USER.COUNTRY_ADMIN,
  ].includes(+inherentBiz)
  const { params = {}, onCancel, onOk } = props
  const { id, accountTypes = [], supply = {} } = params

  const [role, setRole] = useState<any>({
    dataSource: [],
  })
  const [detail, setDetail] = useState<any>()
  const [regions, setRegions] = useState<Array<any>>([])

  const actions = useMemo(() => createFormActions(), [])

  const fetchRegion = () => {
    http.get('role/region').then((res: IResponse) => {
      const { success, data = [] } = res
      if (success) {
        setRegions(
          JSON.parse(
            JSON.stringify(data)
              .replace(/code/g, 'value')
              .replace(/name/g, 'label')
          )
        )
      }
    })
  }

  // 查询详情
  const fetchDetail = (id: string | number) => {
    http.post('user/detail', { id, resourceId }).then(res => {
      if (res.success) {
        setDetail(res.data)
      }
    })
  }

  // 查询角色列表
  const fetchRoles = accountTypeId => {
    http.post('user/roleList', { resourceId, accountTypeId }).then(res => {
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
        setRole({
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

  const onSubmit = async (params: any = {}) => {
    // 针对 formily FormStep BUG 的临时性处理
    const explains = document.body
      .querySelector('.add-user-model')
      .querySelectorAll('.ant-form-item-explain')
    if (explains.length > 0) {
      return false
    }

    const { accountTypeId, mobile } = params
    const onSave = params => {
      const { regionCodeList, supplyId, ...rest } = params
      if (regionCodeList && regionCodeList.length > 0) {
        rest.regionCodeList = [regionCodeList[regionCodeList.length - 1]]
      }
      if (isSpecialRole) {
        rest.supplyId = supplyId
      }

      if (id) {
        http
          .post('user/update', { ...rest, id, resourceId })
          .then((res: IResponse) => {
            if (res.success) {
              message.success('修改成功')
              onOk()
            }
          })
      } else {
        http
          .post('user/add', { ...rest, resourceId })
          .then((res: IResponse) => {
            if (res.success) {
              message.success('新增成功')
              onOk()
            } else {
              message.success('新增失败')
            }
          })
      }
    }

    if (accountTypeId === 3) {
      const {
        data: { display, alert },
      } = await http.get('user/isAccountManager', { accountTypeId, mobile })
      if (display) {
        Modal.confirm({
          centered: true,
          title: '提示',
          content: alert,
          onOk: () => onSave(params),
        })
      } else {
        onSave(params)
      }
    } else {
      onSave(params)
    }
  }

  useEffect(() => {
    id && fetchDetail(id)
  }, [id])

  const initialValues = useMemo(() => {
    if (isSpecialRole) {
      // 迅盟用户/超管用户，查询地市数据
      fetchRegion()
    } else {
      // 非迅盟用户/超管用户，需要手动查询用户角色
      fetchRoles(accountTypeId)
    }

    if (id) {
      if (detail) {
        const { accountTypeId } = detail
        // 详情页，需要查询用户角色
        fetchRoles(accountTypeId)
      }
      return detail
    }

    return {
      accountTypeId: isSpecialRole ? undefined : accountTypeId,
      status: 1,
    }
  }, [id, detail])

  const renderSpecialForm = () => {
    return (
      <SchemaForm
        labelCol={7}
        validateFirst
        wrapperCol={12}
        actions={actions}
        effects={createUseEffects({ resourceId, supply })}
        onSubmit={onSubmit}
        previewPlaceholder="-"
        initialValues={initialValues}
      >
        <FormStep
          style={{ marginBottom: 30 }}
          dataSource={[
            { title: '账号类型', name: 'accountTypes' },
            { title: '基本信息', name: 'baseInfo' },
          ]}
        />
        <FormCard name="accountTypes">
          <Field
            required
            type="string"
            name="accountTypeId"
            title="账号类型"
            enum={accountTypes}
            x-props={{
              placeholder: '请选择',
            }}
          />
          <Field
            required
            type="region-cascader"
            name="regionCodeList"
            title="区域选择"
            visible={false}
            x-props={{
              level: 2,
              options: regions,
            }}
          />
          <Field
            required
            type="string"
            name="supplyId"
            title="商品收款方"
            visible={false}
            enum={supply.dataSource}
            default={supply.default}
            x-props={{
              placeholder: '请输入',
              showSearch: true,
              optionFilterProp: 'title',
            }}
          />
        </FormCard>
        <FormCard name="baseInfo">
          <Field
            required
            editable={!id}
            type="xm-string"
            name="mobile"
            title="用户账号"
            x-props={{
              placeholder: '请输入',
            }}
            x-rules={[{ validator: validMobile }]}
          />
          <Field
            required
            type="xm-string"
            name="name"
            title="用户姓名"
            x-props={{
              placeholder: '请输入',
            }}
            x-rules={[{ validator: factoryValidLength(10) }]}
          />
          <Field
            required
            type="string"
            name="roleIdList"
            title="用户角色"
            enum={role.dataSource}
            default={role.default}
            x-props={{
              mode: 'multiple',
              placeholder: '请输入',
              showSearch: true,
              optionFilterProp: 'title',
            }}
          />
          <Field
            required
            type="string"
            name="status"
            title="用户状态"
            enum={STATUS}
            x-props={{
              placeholder: '请选择',
            }}
          />
        </FormCard>
        <FormSpy selector={FormStep.ON_FORM_STEP_CURRENT_CHANGE}>
          {({ state }) => {
            const { value = 0 } = state
            return (
              <FormButtonGroup sticky offset={16}>
                {value === 1 && (
                  <Button
                    onClick={() =>
                      actions.dispatch(
                        FormStep.ON_FORM_STEP_PREVIOUS,
                        undefined
                      )
                    }
                  >
                    上一步
                  </Button>
                )}
                {value === 0 && (
                  <Button
                    onClick={() =>
                      actions.dispatch(FormStep.ON_FORM_STEP_NEXT, undefined)
                    }
                  >
                    下一步
                  </Button>
                )}
                <Submit disabled={value !== 1}>提交</Submit>
              </FormButtonGroup>
            )
          }}
        </FormSpy>
      </SchemaForm>
    )
  }

  const renderNormalForm = () => {
    const schema = getAddSchema(role, supply, Boolean(id))
    return (
      <SchemaForm
        labelCol={7}
        validateFirst
        wrapperCol={12}
        actions={actions}
        effects={createUseEffects({ resourceId, supply })}
        onSubmit={onSubmit}
        previewPlaceholder="-"
        initialValues={initialValues}
        schema={{
          type: 'object',
          properties: formatFormSchema(schema),
        }}
      >
        <FormButtonGroup align="right">
          <Button onClick={onCancel}>取消</Button>
          <Submit>提交</Submit>
        </FormButtonGroup>
      </SchemaForm>
    )
  }

  return (
    <Modal
      visible
      centered
      footer={null}
      onCancel={onCancel}
      maskClosable={false}
      className="add-user-model"
      title={`${id ? '修改' : '新增'}用户`}
    >
      {isSpecialRole ? renderSpecialForm() : renderNormalForm()}
    </Modal>
  )
}
