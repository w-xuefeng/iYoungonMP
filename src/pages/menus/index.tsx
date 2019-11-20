import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import YGMenu, { Menu, HeaderInfo } from '@/components/YGMenu'
import './index.scss'

export default class MenusPage extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarBackgroundColor: '#007acc',
    navigationStyle: 'custom',
    navigationBarTitleText: 'iYoungon',
    navigationBarTextStyle: 'white'
  }

  menus: Menu[] = [
    {
      name: '个人中心',
      url: '/pages/index/index',
      icon: 'user',
    },
    {
      name: '我的值班',
      url: '/pages/index/index',
      icon: 'clock',
    },
    {
      name: '提出申请',
      url: '/pages/index/index',
      icon: 'message',
    },
    {
      name: '我的申请',
      url: '/pages/index/index',
      icon: 'alert-circle',
    },      
  ]

  headerInfor: HeaderInfo = {
    fullhead: 'https://api.wangxuefeng.com.cn/static/assets/uploads/img/head/20190521175332_202.png',
    name: '小Young',
    utype: '超级管理员',
    ulevel: 255,
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <YGMenu menus={this.menus} headerInfor={this.headerInfor}></YGMenu>
      </View>
    )
  }
}
