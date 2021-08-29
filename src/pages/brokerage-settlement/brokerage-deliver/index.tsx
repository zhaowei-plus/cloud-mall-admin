import React, { useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import {} from 'umi'

import { Layout, Action, Search } from '@/components'
import { useVisible, useTable } from '@/hooks'
import http from '@/api'
import { getSchema, getColumns } from './config'

import ChannelModal from './components/channel-modal'
import BeanDeliverModal from './components/bean-deliver-modal'

import style from './index.less'

const { Header, Content } = Layout

export default props => {
  const { history, location } = props
  const { pathname } = location

  const channelModal = useVisible()
  const beanDeliverModal = useVisible()

  const [currentChannel, setCurrentChannel] = useState<any>({}) // 当前分公司信息
  const { table, XmTable } = useTable(
    'beSettlement/beDeliver/list',
    {},
    {},
    false
  )
  const { selectedRows } = table.params
  const [enableBeans, setEnableBeans] = useState(0)

  const fetchChannel = () => {
    http
      .get('channel/currentChannel', {}, { notify: false })
      .then(res => {
        const { success, data = {} } = res
        if (success) {
          const { id } = data
          table.onSearch({ channelId: id })
          setCurrentChannel(data)
          fetchEnableBeans(data.id)
        }
      })
      .catch(() => {
        channelModal.open()
      })
  }

  const fetchEnableBeans = channelId => {
    http.get('beSettlement/beDeliver/enableBeans', { channelId }).then(res => {
      const { success, data } = res
      if (success) {
        setEnableBeans(data)
      }
    })
  }

  const handleDeliver = () => {
    beanDeliverModal.open(currentChannel)
  }

  const handleDetail = () => {
    message.destroy()

    if (selectedRows.length === 0) {
      message.warn('请选择查看的记录信息')
      return false
    }
    if (selectedRows.length > 1) {
      message.warn('请单选记录查看')
      return false
    }

    history.push(`${pathname}/detail/${selectedRows[0].id}`)
  }

  const handleChangeChannel = () => {
    channelModal.open(currentChannel)
  }

  useEffect(() => {
    fetchChannel()
  }, [])

  const extra = useMemo(() => {
    const { id, operatorNumber, channelName } = currentChannel
    if (id) {
      return (
        <div className={style['bd-channel']}>
          <span>
            分公司：{channelName} {operatorNumber}
          </span>
          <a onClick={handleChangeChannel}>切换</a>
        </div>
      )
    }
    return (
      <div className="bd-channel">
        <a onClick={handleChangeChannel}>切换</a>
      </div>
    )
  }, [currentChannel])

  const actionMap = {
    137: handleDeliver, // 发放彩豆
    138: handleDetail, // 查看
  }

  const columns = getColumns()

  return (
    <Layout>
      <Header extra={extra} title={`可用彩豆：${enableBeans}`} />
      <Content>
        <Action actionMap={actionMap} />
        <XmTable columns={columns} />
      </Content>
      {channelModal.visible && (
        <ChannelModal
          params={channelModal.params}
          onCancel={channelModal.close}
          onOk={() => {
            channelModal.close()
            fetchChannel()
          }}
        />
      )}
      {beanDeliverModal.visible && (
        <BeanDeliverModal
          params={beanDeliverModal.params}
          onCancel={beanDeliverModal.close}
          onOk={() => {
            beanDeliverModal.close()
            fetchChannel()
          }}
        />
      )}
    </Layout>
  )
}
