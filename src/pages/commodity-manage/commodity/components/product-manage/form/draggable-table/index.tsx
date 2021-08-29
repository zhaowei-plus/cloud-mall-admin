import React, { useState, useCallback, useRef } from 'react'
import { Button, Table, Modal, message, Typography } from 'antd'
import { DndProvider, useDrag, useDrop, createDndContext } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import cs from 'classnames'
import update from 'immutability-helper'
import { useParams } from 'umi'
import { useVisible } from '@/hooks'
import AddModal from './components/add-modal'
import { getColumns } from './config'
import http from '@/api'
import { IResponse } from '@/assets/constant'

const { Title, Paragraph } = Typography

const RNDContext = createDndContext(HTML5Backend)

const type = 'DraggableRow'

const DraggableRow = ({
  index,
  moveRow,
  className,
  style,
  editable = true,
  ...restProps
}) => {
  const ref = React.useRef()
  const [, drag] = useDrag({
    item: {
      type,
      dragIndex: index,
    },
  })
  const [, drop] = useDrop({
    accept: type,
    drop: ({ dragIndex }: any) => {
      moveRow(dragIndex, index)
    },
  })
  drop(drag(ref))

  return (
    <tr
      ref={ref}
      className={cs(className, {
        'pointer-events-none': !editable,
      })}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  )
}

const DraggableTable = props => {
  const { itemId } = useParams()
  const { value = [], mutators, editable = true } = props

  const addModal = useVisible()

  const handleAdd = () => {
    addModal.open()
  }

  const handleEdit = (detail, index) => {
    addModal.open({ detail, index })
  }

  const saveDraft = skuList => {
    if (!itemId) {
      // 新增
      http
        .post('commodity/saveDraft', {
          itemDraftType: 3,
          itemDraftInfoJson: JSON.stringify({ skuList }),
        })
        .then((res: IResponse) => {
          if (res.success) {
            message.success('保存成功')
          } else {
            message.error(res.msg || '保存失败')
          }
        })
    }
  }

  const handleDelete = index => {
    if (value.length === 1) {
      message.warn('产品信息至少需要保留一条，否则无法提交')
      return false
    }

    Modal.confirm({
      centered: true,
      title: '提示',
      content: '确定删除吗？',
      onOk: () => {
        const newValue = JSON.parse(JSON.stringify(value))
        newValue.splice(index, 1)
        mutators.change(newValue)
        saveDraft(newValue)
      },
    })
  }

  const handleOk = params => {
    const { index, ...rest } = params
    const newValue = JSON.parse(JSON.stringify(value))
    if (isNaN(index)) {
      newValue.unshift(rest)
    } else {
      newValue.splice(index, 1, rest)
    }
    mutators.change(newValue)
    saveDraft(newValue)

    addModal.close()
  }

  const components = {
    body: {
      row: DraggableRow,
    },
  }

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = value[dragIndex]
      const newValue = update(value, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      })
      mutators.change(newValue)
      saveDraft(newValue)
    },
    [value]
  )

  const manager = useRef(RNDContext)
  const onRow = (record, index) => ({
    index,
    moveRow,
    editable,
  })
  const columns = getColumns(handleEdit, handleDelete, editable)

  return (
    <Typography className="form">
      <Title level={2}>
        产品管理
        {editable && (
          <Button type="link" onClick={handleAdd}>
            新增
          </Button>
        )}
      </Title>
      <Paragraph>
        <DndProvider manager={manager.current.dragDropManager}>
          <Table
            onRow={onRow}
            rowKey={(record, index) => index}
            columns={columns}
            pagination={false}
            dataSource={value}
            components={components}
          />
        </DndProvider>
      </Paragraph>
      {addModal.visible && (
        <AddModal
          params={addModal.params}
          onCancel={addModal.close}
          onOk={handleOk}
        />
      )}
    </Typography>
  )
}

DraggableTable.isFieldComponent = true

export default DraggableTable
