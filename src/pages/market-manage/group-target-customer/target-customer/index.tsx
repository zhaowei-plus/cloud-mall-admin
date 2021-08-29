import React, { useState } from 'react'
import { message, Alert, Modal, Button } from 'antd'
import { css } from 'emotion'

import { Layout, Search, ImportExcel } from '@/components'
import { useTable } from '@/hooks'
import { getSchema } from './config'
import ViewRecord from './components/ViewRecord'
import Add from './components/Add'

const { Content } = Layout

const suffixType = {
  1: '企业',
  2: '用户',
}

const alertCl = css(`
  padding: 20px;
  color: #262a30;
  line-height: 20px;
  background-color: #f7f8f9;
  border: 1px solid #e9ecf0;
  border-radius: 4px;
  margin-bottom:16px;
`)

export default (): JSX.Element => {
  const { table, XmTable } = useTable('groupTargetCustomer/appendList')

  const schema = getSchema()

  const [state, setState] = useState({
    viewRecordVisible: false,
    materialId: '',
    addVisible: false,
    listType: '',
  })

  const columns = [
    {
      title: '活动编码',
      dataIndex: 'code',
    },
    {
      title: '活动名称',
      dataIndex: 'materialName',
    },
    {
      title: '原名单',
      dataIndex: 'originNum',
    },
    {
      title: '追加名单',
      dataIndex: 'appendNum',
      render: (appendNum, record) => (
        <span>{`${appendNum}个${suffixType[record.listType]}`}</span>
      ),
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

  const handleClick = (type, e?: any) => {
    if (table.params.selectedRows.length !== 1) {
      e && e.stopPropagation()
      return message.warning('请单选记录')
    }

    const record = table.params.selectedRows[0]

    switch (type) {
      case 1:
        setState(preState => ({
          ...preState,
          viewRecordVisible: true,
          materialId: record.materialId,
          listType: record.listType,
        }))
        break
      case 2:
        setState(preState => ({
          ...preState,
          addVisible: true,
          materialId: record.materialId,
          listType: record.listType,
        }))
        break
      case 3:
        break
      default:
        break
    }
  }

  return (
    <Layout>
      <Content>
        <Alert
          className={alertCl}
          message="可通过输入活动ID筛选要追加名单的活动素材，筛选后点击“追加名单”进行追加"
        />

        <Search schema={schema} onSearch={table.onSearch} />
        <div className="mt2">
          <Button type="primary" className="mr2" onClick={() => handleClick(1)}>
            查看
          </Button>
          <Button className="mr2" onClick={() => handleClick(2)}>
            手动添加
          </Button>
          <ImportExcel
            name="file"
            data={{
              id: table.params.selectedRows.length
                ? table.params.selectedRows[0].materialId
                : '',
            }}
            action="/cmmc-market/aims/customer/append/import"
            onLoaded={handleLoaded}
          >
            {loading => (
              <Button
                loading={loading}
                onClick={e => {
                  handleClick(3, e)
                }}
              >
                批量添加
              </Button>
            )}
          </ImportExcel>
        </div>
        <XmTable
          type="radio"
          columns={columns}
          className="mt2"
          rowKey="materialId"
          scroll={{ x: 'max-content' }}
        />
      </Content>
      {state.viewRecordVisible ? (
        <ViewRecord
          onCancel={() =>
            setState(preState => ({
              ...preState,
              viewRecordVisible: false,
            }))
          }
          visible
          listType={state.listType}
          materialId={state.materialId}
        />
      ) : null}
      <Add
        onCancel={() =>
          setState(preState => ({
            ...preState,
            addVisible: false,
          }))
        }
        visible={state.addVisible}
        listType={state.listType}
        materialId={state.materialId}
        callback={table.onFetch}
      />
    </Layout>
  )
}
