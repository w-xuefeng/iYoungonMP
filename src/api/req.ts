import Taro from '@tarojs/taro'
import { loginUrlTag } from './url'
const wxToken = 'lalala'


export interface HttpRequestOption {
  url: string
  data?: {} | string | ArrayBuffer
  header?: {}
  method: 'OPTIONS'|'GET'|'HEAD'|'POST'|'PUT'|'DELETE'|'TRACE'|'CONNECT'
  dataType?: string
  responseType?: string
  success?: () => {}
  fail?: () => {}
  complete?: () => {}
}

export interface HttpResponOption {
  status: string | boolean
  resdata?: any
  openid?: string
  error?: string
  title?: string
  message?: string
  msg?: string
}

export const Req = (opt: HttpRequestOption) => {
  let res: HttpResponOption;
  const isLoginReq = opt.url.includes(loginUrlTag)
  if (!isLoginReq) {
    opt.header = {
      'content-type': 'application/json',
      'Authorization': `Bearer ${wxToken}`,
      ...opt.header
    }    
  }
  return Taro.request(opt).then(rs => rs.data)
  .then(rs => {
    res = rs
    if (
      !res.status &&
      !isLoginReq &&
      (res.title || res.msg || res.message || res.error)
    ) {
      Taro.showToast({
        title: res.title || res.msg || res.message || res.error || '网络出现了一点波动...',
        icon: 'none',
        duration: 2000
      })
    }
    return res
  }).catch(err=> {
    Taro.showToast({
      title: '迷失在茫茫网络中...',
      icon: 'none',
      duration: 2000
    })
    res = { status: false, error: err }
    return res
  })
}

export const getCode = () => {
  return Taro.login()
}
