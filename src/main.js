import Vue from 'vue'
import App from './App'
import '../static/css/weui.css'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      'pages/register/main',
      '^pages/index/main',
      'pages/sign/main',
      'pages/dynamic/main',
      'pages/record/main'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#1296DB',
      navigationBarTitleText: 'iYoungon',
      navigationBarTextStyle: '#FFF'
    },
    tabBar: {
      color: '#515151',
      selectedColor: '#1296DB',
      backgroundColor: '#ffffff',
      borderStyle: '#eee',
      /* eslint-disable */
      list: [{
          pagePath: 'pages/index/main',
          text: '首页',
          iconPath: 'static/img/icon_nav_home.png',
          selectedIconPath: 'static/img/icon_nav_home_target.png'
        },
        {
          pagePath: 'pages/sign/main',
          text: '签到',
          iconPath: 'static/img/icon_nav_sign.png',
          selectedIconPath: 'static/img/icon_nav_sign_target.png'
        },
        // {
        //   pagePath: 'pages/dynamic/main',
        //   text: '动态',
        //   iconPath: 'static/img/icon_nav_dynamic.png',
        //   selectedIconPath: 'static/img/icon_nav_dynamic_target.png'
        // },
        {
          pagePath: 'pages/record/main',
          text: '签到记录',
          iconPath: 'static/img/icon_nav_record.png',
          selectedIconPath: 'static/img/icon_nav_record_target.png'
        }
      ]
      /* eslint-enable */
    }
  }
}
