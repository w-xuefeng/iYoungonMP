export const BaseUrl = 'https://api.wangxuefeng.com.cn'
export const loginUrlTag = '/wxlogin'

export class YGURL {

  /**
  * @function: 静态资源 url
  */
  static asset_url = `${BaseUrl}/static/assets`

  /**
  * @function: 绑定 wxid
  * @method: PATCH | POST
  * @param: { stuid, password, wxid }
  */
  static patch_wxid = `${BaseUrl}/users/patch/wxid`

  /**
  * @function: 注册
  * @method: POST
  * @param:  { stuid, password, name, email, utype, wxid }
  */
  static post_users = `${BaseUrl}/users`

  /**
  * @function: 获取注册码
  * @method: GET
  */
  static get_rcode =  `${BaseUrl}/commonset/index/getrcode`

  /**
  * @function: 获取用户信息
  * @method: GET
  * @param:  { code }  wx.login()
  */
  static get_users = `${BaseUrl}/users/get/wxlogin`


  /**
  * @function: 获取最新公告
  * @method: GET
  */
  static get_last_notices = `${BaseUrl}/notice/get`

  /**
  * @function: 获取当前在站人员信息
  * @method: GET
  */
  static get_current_online = `${BaseUrl}/users/get/online`

  /**
  * @function: 获取携带钥匙站员信息
  * @method: GET
  */
  static get_has_key = `${BaseUrl}/users/get/haskey`

  /**
  * @function: 获取本周签到记录
  * @method: GET
  */
  static get_sign_record_this_week = `${BaseUrl}/sign/record/thisweek`

  /**
  * @function: 获取上周签到记录
  * @method: GET
  */
  static get_sign_record_last_week = `${BaseUrl}/sign/record/lastweek`
}
