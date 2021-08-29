import React, { useState } from 'react'
import { Upload, message } from 'antd'

export default (props): JSX.Element => {
  const [loading, setLoading] = useState(false)

  return (
    <Upload
      accept=".xls,.xlsx"
      showUploadList={false}
      {...props}
      onChange={({ file }) => {
        const { status, response } = file

        switch (status) {
          case 'uploading':
            setLoading(true)
            break
          case 'done':
            setLoading(false)
            props.onLoaded(response)
            break
          default:
            setLoading(false)
            message.error('上传出错，请刷新重试')
        }
      }}
    >
      {props.children(loading)}
    </Upload>
  )
}
