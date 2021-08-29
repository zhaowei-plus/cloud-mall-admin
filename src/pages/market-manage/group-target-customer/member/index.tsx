import React, { Fragment } from 'react'
import moment from 'moment'
import { message, Alert, Button, Modal } from 'antd'
import { css } from 'emotion'

import { Layout, Search, ImportExcel } from '@/components'
import { useTable } from '@/hooks'
import http from '@/api'
import { getSchema } from './config'
import template from '@/assets/files/集团活动目标成员模板.xlsx'
import { STATUS } from './constant'

const { Content } = Layout

const alertCl = css(`
  padding: 20px;
  color: #262a30;
  line-height: 20px;
  background-color: #f7f8f9;
  border: 1px solid #e9ecf0;
  border-radius: 4px;
  margin-bottom:16px;
`)

const text = (
  <div>
    <p>1、目标成员通过excel进行导入，excel的表头字段为手机号。</p>
    <p>2、导入表格后，系统将会过滤非渝企信企业。</p>
    <p>
      3、在“活动管理-活动素材-选择目标客户”中只会选择已过滤后的目标客户表格。
    </p>
  </div>
)

const schema = getSchema()

export default (): JSX.Element => {
  const { table, XmTable } = useTable(
    'groupTargetCustomer/userList',
    {},
    { listType: 2 }
  )

  const remove = ids => {
    http.post('groupTargetCustomer/orgDelete', { idList: ids }).then(() => {
      message.success('删除成功')
      table.onSearch()
    })
  }

  const handleBatchDelete = () => {
    const ids = table.params.selectedRows.map(it => it.id)

    if (!ids.length) return message.warn('请至少选择一条数据')

    Modal.confirm({
      title: '确定要删除吗？',
      content: '名单删除后，活动配置目标用户时无法选择该名单',
      onOk: () => {
        remove(ids)
      },
    })
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'code',
    },
    {
      title: '名称',
      dataIndex: 'title',
    },
    {
      title: '创建人手机号',
      dataIndex: 'creatorMobile',
    },
    {
      title: '导入时间',
      dataIndex: 'importTime',
      render: val => moment(val).format('YYYY-MM-DD HH:mm'),
    },

    {
      title: '导入量',
      dataIndex: 'totalNum',
    },
    {
      title: '渝企信用户数',
      key: 'caiyunNum',
      render: it =>
        it.caiyunNum ? (
          <a href={`/cmmc-market/aims/user/export?id=${it.id}&caiyun=true`}>
            {it.caiyunNum}
          </a>
        ) : (
          0
        ),
    },
    {
      title: '非渝企信用户数',
      key: 'uncaiyunNum',
      render: it => {
        return it.uncaiyunNum ? (
          <a href={`/cmmc-market/aims/user/export?id=${it.id}&caiyun=false`}>
            {it.uncaiyunNum}
          </a>
        ) : (
          0
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (value, record) => {
        const { importFailureId } = record
        const item = STATUS.find(item => value === item.value)
        if (item) {
          if (value === 2) {
            return (
              <span>
                {item.label}
                {importFailureId > 0 && (
                  <Fragment>
                    （
                    <a
                      href={`/cmmc-market/aims/customer/download/error/excel?id=${importFailureId}`}
                    >
                      报错名单
                    </a>
                    ）
                  </Fragment>
                )}
              </span>
            )
          }
          return item.label
        }
        return '-'
      },
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

  return (
    <Layout>
      <Content>
        <Alert className={alertCl} message={text} />
        <Search schema={schema} onSearch={table.onSearch} />
        <div className="mt2">
          <ImportExcel
            name="file"
            action="/cmmc-market/aims/user/import"
            onLoaded={handleLoaded}
            className="mr2"
          >
            {loading => (
              <Button type="primary" loading={loading}>
                导入目标成员
              </Button>
            )}
          </ImportExcel>
          <Button onClick={handleBatchDelete} className="mr2">
            批量删除
          </Button>
          <a href={template}>模板下载</a>
        </div>
        <XmTable
          columns={columns}
          className="mt2"
          scroll={{ x: 'max-content' }}
        />
      </Content>
    </Layout>
  )
}
