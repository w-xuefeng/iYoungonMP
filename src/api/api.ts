import { YGURL } from './url'
import { Req, getCode, HttpRequestOption } from './req'

// 绑定 wxid
export const bindAccount = ({ stuid, password, wxid }) => {
  const opt: HttpRequestOption = {
    url: YGURL.patch_wxid,
    data: { stuid, password, wxid },
    method: 'POST'
  }
  return  Req(opt)
}

// 注册 账号
export const regAccount = ({ stuid, password, name, email, utype, wxid }) => {
  const opt: HttpRequestOption = {
    url: YGURL.post_users,
    data: { stuid, password, name, email, utype, wxid },
    method: 'POST'
  }
  return  Req(opt)
}

// 获取 用户信息
export const getUserInfo = async () => {
  return await getCode().then(rs => {
    const opt: HttpRequestOption = {
      url: YGURL.get_users,
      data: { code: rs.code },
      method: 'GET'
    }
    return Req(opt)
  })
}
