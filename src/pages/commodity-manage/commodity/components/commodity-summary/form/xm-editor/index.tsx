import React from 'react'
import { Empty } from 'antd'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn.js'
import store from '@/store'

import './index.less'
import '@/assets/ck-editor.css'

const XmEditor = props => {
  const { value = '', mutators, editable = true } = props

  if (editable) {
    return (
      <div className="xm-editor">
        <CKEditor
          editor={ClassicEditor}
          config={{
            extraPlugins: [ImageUploadPlugin],
            toolbar: [
              'Heading',
              'bold',
              'italic',
              'bulletedList',
              'numberedList',
              'link',
              'ImageUpload',
            ],
            language: 'zh-cn',
            additionalLanguages: 'all',
          }}
          data={value}
          onChange={(event, editor) => {
            store.dispatch({
              type: 'SET_LOADING',
              payload: /<img>/g.test(editor.getData()),
            })
            mutators.change(editor.getData())
          }}
        />
      </div>
    )
  }

  return (
    <div className="xm-editor">
      {!value ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div
          className="ck-content"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      )}
    </div>
  )
}

function ImageUploadPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = loader => {
    return new UploadAdapter(loader)
  }
}

class UploadAdapter {
  constructor(loader) {
    this.loader = loader
  }

  upload() {
    const body = new FormData()
    return this.loader.file
      .then(file => {
        body.append('file', file)
        return fetch('/ygw/api/upload/csm/ifs/uploadFile', {
          method: 'POST',
          body,
        }).then(res => res.json())
      })
      .then(res => {
        return { default: res.data }
      })
  }
}

XmEditor.isFieldComponent = true

export default XmEditor
