import React from 'react'

const urlReg = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i'
) // fragment locator

const XmString = props => {
  const { value } = props

  if (urlReg.test(value)) {
    return (
      <a href={value} target="_blank">
        点击查看
      </a>
    )
  } else {
    return value
  }
}

XmString.isFieldComponent = true

export default XmString
