import React, { memo } from 'react'
import { Modal } from 'antd'
import { useTable } from '@/hooks'

const suffixType = {
  1: '企业',
  2: '用户',
}

const ViewRecord = ({ visible, onCancel, materialId, listType }) => {
  const { XmTable } = useTable('groupTargetCustomer/recordList', {
    materialId,
  })

  const columns = [
    {
      title: '追加人',
      dataIndex: 'creatorName',
    },
    {
      title: '追加时间',
      dataIndex: 'appendTime',
    },
    {
      title: '追加名单',
      dataIndex: 'appendNum',
      render: (appendNum, record) =>
        appendNum ? (
          <>
            <span className="mr2">{`${appendNum}家${suffixType[listType]}`}</span>
            <a
              href={`/cmmc-market/aims/customer/append/record/export?id=${record.id}`}
            >
              下载
            </a>
          </>
        ) : (
          <span>{`${appendNum}家${suffixType[listType]}`}</span>
        ),
    },
  ]

  return (
    <Modal
      visible={visible}
      title="操作记录"
      width={700}
      onCancel={() => onCancel()}
      footer={null}
      bodyStyle={{ maxHeight: 500, overflow: 'auto' }}
    >
      <XmTable columns={columns} rowSelection={false} />
    </Modal>
  )
}

export default memo(ViewRecord)
