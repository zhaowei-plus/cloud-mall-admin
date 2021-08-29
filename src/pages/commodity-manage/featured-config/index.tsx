import React, { useState, useEffect } from 'react'
import { Button, Modal, message } from 'antd'
import cloneDeep from 'lodash/cloneDeep'
import { Layout, Preview } from '@/components'
import { useVisible } from '@/hooks'
import http from '@/api'
import ModeConfig from './components/mode-config'
import ModeList from './components/mode-list'
import BannerModal from './components/banner-modal'
import ModeModal from './components/mode-modal'
import { ACTION, MODULE_TYPE } from './constant'
import './index.less'
const { Header, Content, Footer } = Layout

interface IItem {
  img?: String
  itemName?: String
  itemId?: Number
  remark?: String
}

interface IMode {
  moduleType: Number
  moduleName: String
  moduleExplain: String
  item: Array<IItem>
}

export default () => {
  const modeModal = useVisible()
  const bannerModal = useVisible()
  const [id, setId] = useState()
  const [preUrl, setPreUrl] = useState()
  const [modes, setModes] = useState<Array<IMode>>([])

  const fetchModes = () => {
    http.get('featured/get').then(res => {
      const { success, data } = res
      if (success) {
        const { id, preUrl, select = [] } = data
        setId(id)
        setPreUrl(preUrl)
        setModes(select)
      }
    })
  }

  const handleBannerModalOk = params => {
    const {
      type,
      index,
      itemIndex,
      moduleType,
      moduleName,
      moduleExplain,
      img,
      itemId,
      itemName,
    } = params
    const item = {
      img,
      itemId,
      itemName,
    }
    const banner = {
      moduleType,
      moduleName,
      moduleExplain,
      item: [item],
    }
    const newModes = cloneDeep(modes)
    if (type === ACTION.ADD) {
      if (index > -1) {
        // 新增 item
        const target = newModes[index]
        target.item.push(item)
        newModes.splice(index, 1, target)
      } else {
        // 新增 mode
        newModes.push(banner)
      }
    } else {
      // 编辑
      const target = newModes[index]
      target.item[itemIndex] = item
      newModes.splice(index, 1, target)
    }
    setModes(newModes)
    bannerModal.close()
  }

  const handleModeModalOk = params => {
    const {
      type,
      moduleType,
      moduleName,
      moduleExplain,
      index,
      item = [],
    } = params
    const mode = {
      moduleType,
      moduleName,
      moduleExplain,
      item,
    }
    const newModes = cloneDeep(modes)
    if (type === ACTION.ADD) {
      // 新增 mode
      newModes.push(mode)
    } else {
      // 修改 mode
      newModes.splice(index, 1, mode)
    }
    setModes(newModes)
    modeModal.close()
  }

  const handleSave = () => {
    let content = '提交后，云商城页面将不再显示"精选"页。 确定提交吗？'
    if (modes.length > 0) {
      content =
        '提交后，云商城页面内将显示"精选"页并展示配置内容。 确定提交吗？'
    }
    Modal.confirm({
      content,
      title: '提示',
      centered: true,
      onOk: () => {
        http.post('featured/save', { id, select: modes }).then(res => {
          const { success } = res
          if (success) {
            message.success('提交成功')
          }
        })
      },
    })
  }

  const handlePreview = () => {
    if (preUrl) {
      Preview.iframe(preUrl)
    } else {
      message.warn('暂无预览地址，请保存后预览')
    }
  }

  const handleCancel = () => {
    history.back()
  }

  const handleAddMode = params => {
    const { moduleType } = params
    if (moduleType === MODULE_TYPE.BANNER) {
      bannerModal.open(params)
    } else {
      modeModal.open(params)
    }
  }

  const handleDeleteMode = (index, itemIndex?) => {
    const newModes = cloneDeep(modes)
    if (itemIndex > -1) {
      newModes[index].item.splice(itemIndex, 1)
      if (newModes[index].item.length === 0) {
        newModes.splice(index, 1)
      }
    } else {
      newModes.splice(index, 1)
    }
    setModes(newModes)
  }

  const handleChangeMode = (index, mode) => {
    const newModes = cloneDeep(modes)
    newModes.splice(index, 1, mode)
    setModes(newModes)
  }

  useEffect(() => {
    fetchModes()
  }, [])

  return (
    <Layout>
      <Header title="精选页配置" />
      <Content wrapperClassName="featured-config">
        <ModeConfig addMode={handleAddMode} />
        <ModeList
          modes={modes}
          addMode={handleAddMode}
          deleteMode={handleDeleteMode}
          changeMode={handleChangeMode}
        />
      </Content>
      <Footer>
        <Button type="primary" onClick={handleSave}>
          提交
        </Button>
        {/*<Button onClick={handlePreview}>配置预览</Button>*/}
        <Button type="dashed" onClick={handleCancel}>
          取消
        </Button>
      </Footer>
      {bannerModal.visible && (
        <BannerModal
          onOk={handleBannerModalOk}
          params={bannerModal.params}
          onCancel={bannerModal.close}
        />
      )}
      {modeModal.visible && (
        <ModeModal
          onOk={handleModeModalOk}
          params={modeModal.params}
          onCancel={modeModal.close}
        />
      )}
    </Layout>
  )
}
