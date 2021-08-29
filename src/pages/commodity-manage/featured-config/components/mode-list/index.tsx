import React, { useRef } from 'react'
import { Space, Table, Button, Empty } from 'antd'
import update from 'immutability-helper'
import { createDndContext, DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { MODULE_TYPE, IMode, ACTION } from '../../constant'
import { Image } from '@/components'

import './index.less'

interface IProps {
  modes: Array<IMode>
  addMode: Function
  deleteMode: Function
  changeMode: Function
}

const RNDContext = createDndContext(HTML5Backend)

const type = 'DraggableRow'

const TipsMap = {
  [MODULE_TYPE.COMMODITY]: '单行单商品样式',
  [MODULE_TYPE.COMMODITY_2]: '单行双商品样式',
  [MODULE_TYPE.COMMODITY_4]: '单行四商品样式',
}

const DraggableRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = useRef()
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

  return <tr ref={ref} style={{ cursor: 'move', ...style }} {...restProps} />
}

export default (props: IProps) => {
  const { modes, addMode, deleteMode, changeMode } = props
  const manager = useRef(RNDContext)

  const renderModes = () => {
    return modes.map((mode, index) => {
      const { moduleType, moduleName, moduleExplain, item = [] } = mode
      const bannerColumn = {
        title: 'banner图片',
        dataIndex: 'img',
        width: '45%',
        render: text => <Image src={text} className="banner-thumbnail" />,
      }
      const itemNameColumn = {
        title: '商品名称',
        dataIndex: 'itemName',
        width: '45%',
      }
      const remarkColumn = {
        title: '商品说明',
        dataIndex: 'remark',
        width: '45%',
      }
      const actionColumn = {
        title: '操作',
        width: 120,
        render: (text, record, itemIndex) => {
          if (moduleType === MODULE_TYPE.BANNER) {
            return (
              <Space>
                <a
                  onClick={() =>
                    addMode({
                      type: ACTION.EDIT,
                      moduleType,
                      record,
                      index,
                      itemIndex,
                    })
                  }
                >
                  修改
                </a>
                <a onClick={() => deleteMode(index, itemIndex)}>删除</a>
              </Space>
            )
          }
          return <a onClick={() => deleteMode(index, itemIndex)}>删除</a>
        },
      }

      const columns: Array<any> = [
        {
          title: '操作',
          width: 120,
          render: (text, record, itemIndex) => {
            if (moduleType === MODULE_TYPE.BANNER) {
              return (
                <Space>
                  <a
                    onClick={() =>
                      addMode({
                        type: ACTION.EDIT,
                        moduleType,
                        record,
                        index,
                        itemIndex,
                      })
                    }
                  >
                    修改
                  </a>
                  <a onClick={() => deleteMode(index, itemIndex)}>删除</a>
                </Space>
              )
            }
            return <a onClick={() => deleteMode(index, itemIndex)}>删除</a>
          },
        },
      ]

      // banner 显示缩略图
      if (moduleType === MODULE_TYPE.BANNER) {
        columns.unshift(itemNameColumn)
        columns.unshift(bannerColumn)
      } else {
        columns.unshift(remarkColumn)
        columns.unshift(itemNameColumn)
      }

      const moveRow = (dragIndex, hoverIndex) => {
        const dragRow = item[dragIndex]
        const newValue = update(item, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        })
        changeMode(index, {
          ...mode,
          item: newValue,
        })
      }

      const onRow = (record, index) => ({
        index,
        moveRow,
      })

      const components = {
        body: {
          row: DraggableRow,
        },
      }

      const tipsText = TipsMap[Number(moduleType)]
      return (
        <div className="mode" key={Number(mode.moduleType)}>
          <div className="mode__header">
            <div className="info">
              <div className="info__title">
                <label className="title">
                  {moduleType === MODULE_TYPE.BANNER
                    ? 'banner样式'
                    : moduleName}
                </label>
                {tipsText && <label className="tips">{tipsText}</label>}
              </div>
              <label className="explain">{moduleExplain}</label>
            </div>
            <Space>
              {moduleType === MODULE_TYPE.BANNER ? (
                <Button
                  type="primary"
                  onClick={() =>
                    addMode({ type: ACTION.ADD, moduleType, index })
                  }
                >
                  新增
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() =>
                    addMode({
                      type: ACTION.EDIT,
                      moduleType,
                      index,
                      record: mode,
                    })
                  }
                >
                  修改
                </Button>
              )}
              <Button onClick={() => deleteMode(index)}>删除</Button>
            </Space>
          </div>
          <div className="mode__content">
            <DndProvider manager={manager.current.dragDropManager}>
              <Table
                onRow={onRow}
                columns={columns}
                pagination={false}
                dataSource={item}
                components={components}
              />
            </DndProvider>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="mode-list">
      {modes.length > 0 ? (
        renderModes()
      ) : (
        <Empty
          imageStyle={{
            width: 300,
            height: 240,
          }}
          description="请选择模块做精选页的配置"
        />
      )}
    </div>
  )
}
