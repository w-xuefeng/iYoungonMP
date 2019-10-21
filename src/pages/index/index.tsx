import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtTabs, AtTabsPane } from 'taro-ui'
import YGRegister from '../../components/YGRegister'
import YGBindAccount from '../../components/YGBindAccount'
import './index.less'

export default class Index extends Component<any, any> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
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
      currentRegOrBindTabs: 0,
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  switchTabs (value: number) {
    this.setState({
      currentRegOrBindTabs: value
    })
  }

  registerOrBindAccountDom () {
    const tabList = [
      {
        title: '绑定 iYoungon 帐号'
      },
      {
        title: '注册 iYoungon 帐号'
      }
    ]
    const { currentRegOrBindTabs } = this.state
    return (
      <AtTabs current={currentRegOrBindTabs} tabList={tabList} onClick={this.switchTabs.bind(this)}>
        <AtTabsPane current={currentRegOrBindTabs} index={0} >
          <YGBindAccount></YGBindAccount>
        </AtTabsPane>
        <AtTabsPane current={currentRegOrBindTabs} index={1}>
          <YGRegister></YGRegister>
        </AtTabsPane>
      </AtTabs>
    )
  }

  render () {
    return (
      <View className='index'>
        {
          this.registerOrBindAccountDom()
        }
        <AtButton
          className='menu-btn'
          type='primary'
          size='small' circle={true}
          onClick={this.openMenuPage}
        >
          菜单
        </AtButton>
      </View>
    )
  }
}
