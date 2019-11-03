export const BaseUrl = 'https://api.wangxuefeng.com.cn';

export class YGURL {
  
  /*
  * @function: 静态资源 url
  */
  static asset_url = `${BaseUrl}/static/assets`

  /*
  * @function: 绑定 wxid
  * @method: PATCH | POST
  * @data: { stuid, password, wxid }
  */
  static patch_wxid = `${BaseUrl}/users/patch/wxid`

  /*
  * @function: 注册
  * @method: POST
  * @data:  { stuid, password, name, email, utype, wxid }
  */
  static post_users = `${BaseUrl}/users`
  

  /*
  * @function: 获取用户信息
  * @method: get
  * @data:  { code }  wx.login()
  */
  static get_users = `${BaseUrl}/users/get/wxlogin`

}
