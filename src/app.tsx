import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/account/index',
      'pages/index/index',
      'pages/sign/index',
      'pages/menus/index',
      'pages/signdetail/index',
      'pages/personal/index',
      'pages/resume/index',
      'pages/notice/index',
      'pages/notice/post',
      'pages/apply/index',
      'pages/apply/myapply',
      'pages/apply/list',
      'pages/duty/myduty',
      'pages/duty/autoquery',
      'pages/duty/modifyduty',
      'pages/duty/downloaddutylist',
      'pages/usermanager/index',
      'pages/supermanager/wifioption',
      'pages/supermanager/locationlimit',
      'pages/supermanager/registercode',
      'pages/supermanager/addmanager',
      'pages/supermanager/delmanager'
    ],
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示和签到位置的判断'
      }
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#FFFFFF00'
    },
    tabBar: {
      color: '#515151',
      selectedColor: '#1296DB',
      backgroundColor: '#ffffff',
      borderStyle: 'black',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '首页',
          iconPath: 'static/img/icon_nav_home.png',
          selectedIconPath: 'static/img/icon_nav_home_target.png'
        },
        {
          pagePath: 'pages/sign/index',
          text: '签到',
          iconPath: 'static/img/icon_nav_sign.png',
          selectedIconPath: 'static/img/icon_nav_sign_target.png'
        },
        {
          pagePath: 'pages/menus/index',
          text: '我的',
          iconPath: 'static/img/icon_nav_my.png',
          selectedIconPath: 'static/img/icon_nav_my_target.png'
        }
      ]
    }
  }

  // componentDidMount() { }

  // componentDidShow() { }

  // componentDidHide() { }

  // componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
