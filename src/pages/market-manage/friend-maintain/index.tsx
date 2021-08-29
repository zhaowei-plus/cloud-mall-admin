import React, { useState, useEffect } from 'react'
import { message, Alert, Modal, Button } from 'antd'
import querystring from 'querystring'

import AddEditForm from './components/AddEditForm'
import { useTable } from '@/hooks'
import { Layout, Search, Action, ImportExcel } from '@/components'
import http from '@/api'
import { getSchema } from './config'
import template from '@/assets/files/友好客户导入模版.xlsx'
import { downloadFileByPost } from './download'

import './index.less'

const { Content } = Layout

const schema = getSchema()

const text = (
  <div>
    <p>1、一家企业有且仅能设置一位友好客户，负责范围默认是全企业。</p>
    <p>2、支持单个添加和批量导入，导入请下载模板。</p>
    <p>3、导入表格后，如果出现异常数据，系统会返回异常原因，可进行下载修改。</p>
  </div>
)

export default (): JSX.Element => {
  const { table, XmTable } = useTable('friendMaintain/list')

  const [invalidUserTotal, setInvalidUserTotal] = useState(0)

  const [state, setState] = useState({
    customerVisible: false,
    record: {},
    batchVisible: false,
  })

  useEffect(() => {
    http.get('friendMaintain/leaveConut').then(data => {
      setInvalidUserTotal(data.data)
    })
  }, [])

  const handleModalVisible = (key, flag?: any, record = {}) => {
    setState(preState => ({
      ...preState,
      record,
      [key]: !!flag,
    }))
  }

  const handleExport = () => {
    const params = {
      ...table.params,
      resourceId: '',
      idList: table.params.selectedRows.map(it => it.id),
    }

    delete params.resourceId
    delete params.selectedRows
    downloadFileByPost('/cmmc-market/friend/customer/org/export', params)
  }

  const columns = [
    {
      title: '友好客户',
      dataIndex: 'friendName',
    },
    {
      title: '企业编码',
      dataIndex: 'orgId',
    },
    {
      title: '企业名称',
      dataIndex: 'orgName',
    },
    {
      title: '手机号码',
      dataIndex: 'friendMobile',
    },

    {
      title: '企业所在地区',
      dataIndex: 'cityName',
    },
    {
      title: '添加人',
      dataIndex: 'creatorName',
    },
    {
      title: '时间',
      dataIndex: 'gmtCreate',
    },
  ]

  const handleLoaded = res => {
    if (res.success) {
      if (res.data.success) {
        message.success('导入成功')
        table.onSearch()
      } else {
        Modal.error({
          title: '导入出错',
          content: (
            <div>
              <p>
                存在{`${res.data.errorC}`}条上传失败的数据，请下载修改后再上传
              </p>
              <div>
                <span className="mr2">{res.data.fileName}</span>
                <a
                  href={`/cmmc-market/aims/customer/download/error/excel?id=${res.data.importFileId}`}
                >
                  下载文件
                </a>
              </div>
            </div>
          ),
          okText: '关闭',
        })
      }
    } else {
      message.error(res.msg || '导入出错，请重试')
    }
  }

  const messageInfo = (
    <div>
      <span className="mr1">
        {`记录内有${invalidUserTotal}家企业暂无友好客户，无法进行活动下发`}
      </span>
      <a href={`/cmmc-market/friend/customer/org/unrelation/export`}>
        下载数据
      </a>
      <span className="ml3">
        注:企业无友好客户原因:企业已配置友好客户，但该用户移除了企业通讯录
      </span>
    </div>
  )

  const actionMap = {
    92: () => {
      handleModalVisible('customerVisible', true)
    }, // 新增友好客户
    94: () => {
      if (table.params.selectedRows.length !== 1)
        return message.warning('请选择一条数据')

      handleModalVisible('customerVisible', true, table.params.selectedRows[0])
    }, // 修改
    95: handleExport, // 导出excel
  }

  const componentMap = {
    93: ({ index }) => (
      <ImportExcel
        name="file"
        action="/cmmc-market/friend/customer/org/import"
        onLoaded={handleLoaded}
      >
        {loading => (
          <Button loading={loading} type={!index ? 'primary' : 'default'}>
            批量导入
          </Button>
        )}
      </ImportExcel>
    ),
  }

  return (
    <Layout>
      <Content wrapperClassName="friend-maintain">
        {invalidUserTotal ? (
          <Alert
            className="friend-maintain-alert friend-maintain-alert-warning"
            message={messageInfo}
          />
        ) : null}
        <Alert className="friend-maintain-alert" message={text} />
        <Search schema={schema} onSearch={table.onSearch} />
        <div>
          <Action actionMap={actionMap} componentMap={componentMap} />
          <a href={template}>模板下载</a>
        </div>
        <XmTable columns={columns} rowSelection={true} scroll={{ x: 1400 }} />
        <AddEditForm
          visible={state.customerVisible}
          record={state.record}
          callback={table.onFetch}
          onCancel={() => {
            handleModalVisible('customerVisible')
          }}
        />
      </Content>
    </Layout>
  )
}
