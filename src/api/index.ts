import { Http } from 'esc-ui'
import { message } from 'antd'
import cookies from 'react-cookies'
import { history } from 'umi'
import urlMap from './url-map'
import store from '@/store'

const http = new Http({
  baseUrl: '/',
  urlMap,
  notify: res => {
    message.destroy()
    message.error(res)
  },
  contentType: 'application/json',
  beforeRequest: data => {
    const resourceId = cookies.load('resourceId')
    return {
      data: {
        resourceId,
        ...data,
      },
    }
  },
  loadingMethods: {
    open: () => store.dispatch({ type: 'START_LOADING' }),
    close: () => store.dispatch({ type: 'END_LOADING' }),
  },
  beforeCatch: res => {
    if ([403, 700, 800].includes(res.code)) {
      message.error(res.msg)
      history.push('/login')
    }
    return res
  },
})

export default http
