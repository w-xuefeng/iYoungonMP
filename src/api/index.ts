import { YGURL } from './url'
import { Req, getCode, HttpRequestOption, ReqAnyData } from './req'

/**
 * @function 绑定微信账号
 * */
export const bindAccount = ({
  stuid,
  password,
  wxid
}:{
  stuid: string,
  password: string,
  wxid: string
}) => {
  const opt: HttpRequestOption = {
    url: YGURL.patch_wxid,
    data: { stuid, password, wxid },
    method: 'POST'
  }
  return  Req(opt)
}

/**
 * @function 注册账号
 * */
export const regAccount = ({
  stuid,
  password,
  name,
  email,
  utype,
  wxid
}: {
  stuid: string | number,
  password: string,
  name: string,
  email: string,
  utype: string | number,
  wxid: string
}) => {
  const opt: HttpRequestOption = {
    url: YGURL.post_users,
    data: { stuid, password, name, email, utype, wxid },
    method: 'POST'
  }
  return  Req(opt)
}

/**
 * @function 获取注册码
 * */
export const getRegisterCode = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_rcode,
    method: 'GET'
  }
  return Req(opt)
}

/**
 * @function 获取用户信息
 * */
export const getUserInfo = () => {
  return getCode().then(rs => {
    const opt: HttpRequestOption = {
      url: YGURL.get_users,
      data: { code: rs.code },
      method: 'GET'
    }
    return Req(opt)
  })
}

/**
 * @function 获取最新公告
 * */
export const getLastNotice = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_last_notices,
    method: 'GET'
  }
  return ReqAnyData(opt)
}

/**
 * @function 获取当前在站成员信息
 * */
export const getCurrentOnline = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_current_online,
    method: 'GET'
  }
  return Req(opt)
}

/**
 * @function 获取携带钥匙站员信息
 * */
export const getHaskey = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_has_key,
    method: 'GET'
  }
  return Req(opt)
}

/**
 * @function 获取本周签到记录
 * */
export const getThisWeekSR = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_sign_record_this_week,
    method: 'GET'
  }
  return ReqAnyData(opt)
}


/**
 * @function 获取上周签到记录
 * */
export const getLastWeekSR = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_sign_record_last_week,
    method: 'GET'
  }
  return ReqAnyData(opt);
}

