import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { LocalData, LDKey, accountPagePath } from '@/utils/index';
import { User } from '@/models'
import YGHeader from '@/components/YGHeader'
import './index.less'


interface IndexPageStateType {
  user: User
}
export default class Index extends Component<any, IndexPageStateType> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationStyle: 'custom',
    navigationBarBackgroundColor: '#007acc',    
    navigationBarTitleText: 'iYoungon',
    navigationBarTextStyle: 'white'
  }

  openMenuPage = () => {
    Taro.navigateTo({
      url: '/pages/menus/index'
    })
  }

  constructor () {
    super(...arguments)
    this.state = {
      user: new User,
    }
  }

  componentWillMount () {
    const user = LocalData.getItem(LDKey.USER)
    if (user) {
      this.setState({ user })
    } else {
      Taro.redirectTo({
        url: accountPagePath
      })
    }    
  }

  componentDidMount () {}

  componentWillUnmount () {}

  componentDidShow () { }

  componentDidHide () {}

  render () {
    const { user } = this.state
    return (
      <View className='index'>
        <YGHeader />
        <View> {user.stuid} </View>
      </View>
    )
  }
}
