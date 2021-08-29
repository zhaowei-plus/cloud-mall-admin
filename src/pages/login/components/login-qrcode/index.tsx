import React, { useEffect, useMemo, useState } from 'react'
import { Spin } from 'antd'
import cookies from 'react-cookies'
import axios from 'axios'
import http from '@/api'
import urlMap from '@/api/url-map'
import './index.less'

const CancelToken = axios.CancelToken

interface IInfo {
  content?: string
  token?: string
}

export default props => {
  const { onLogin } = props
  const [loading, setLoading] = useState(true)
  const [scanTimeout, setScanTimeout] = useState(false)
  const [{ content, token }, setGenerateInfo] = useState<IInfo>({})

  const source = useMemo(() => CancelToken.source(), [token])

  const fetchQRCode = () => {
    setLoading(true)
    setScanTimeout(false)
    return http.get('login/scanQrCode/cq/generate').then(res => {
      setGenerateInfo(res.data)
      setLoading(false)
    })
  }

  const fetchAace = token => {
    return axios
      .get(urlMap.login.scanQrCode.cq.aace, {
        params: {
          token,
        },
        cancelToken: source.token,
      })
      .then((res: any) => {
        const { status, data } = res
        if (status === 200) {
          const { tickettoken } = data
          fetchQrLogin(token, tickettoken)
        }
      })
      .catch(() => {
        setScanTimeout(true)
      })
  }

  const fetchQrLogin = (token, ticketToken) => {
    return axios
      .get(urlMap.login.scanQrCode.cq.qrlogin, {
        params: {
          token,
          ticketToken,
        },
      })
      .then((res: any) => {
        const { status } = res
        if (status === 200) {
          return onLogin({
            uid: cookies.load('uid'),
            timestamp: cookies.load('ticket'),
            ticket: cookies.load('ts'),
          })
        }
      })
  }

  useEffect(() => {
    fetchQRCode()
  }, [])

  useEffect(() => {
    if (token) {
      fetchAace(token)
      return source.cancel // 取消请求
    }
  }, [token])

  return (
    <div className="login-qrcode">
      <div className="login-qrcode__img">
        <Spin spinning={loading}>
          {content && <img src={`data:image/png;base64,${content}`} />}
        </Spin>
      </div>
      {scanTimeout && (
        <div className="login-qrcode__info">
          <span style={{ marginBottom: 10 }}>二维码已失效</span>
          <a className="refresh" onClick={fetchQRCode}>
            点此刷新
          </a>
        </div>
      )}
      <div className="login-qrcode__tips">用{APP}客户端扫一扫登录</div>
    </div>
  )
}
