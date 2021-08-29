import React from 'react'
import { Button, Space } from 'antd'
import { useSelector } from 'react-redux'

export default (props: any) => {
  const { actionMap, componentMap = {} } = props
  const buttons = useSelector((store: { buttons: [] }) => store.buttons)

  return (
    <Space style={{ margin: 10 }}>
      {buttons.map(({ key, title }, index) => {
        const Component = componentMap[key]

        return Component ? (
          <Component key={key} index={index} />
        ) : (
          <Button
            key={key}
            onClick={actionMap[key]}
            type={index == 0 && 'primary'}
          >
            {title}
          </Button>
        )
      })}
    </Space>
  )
}
