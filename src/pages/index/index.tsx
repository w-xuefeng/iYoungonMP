import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtTag } from 'taro-ui'
import { getUserInfo } from '../../api/api'
import { LocalData, LDKey, isDataTimeOut } from '../../utils/index';
import { User } from '../../models'
import YGRegister from '../../components/YGRegister'
import YGBindAccount from '../../components/YGBindAccount'
import './index.less'


interface IndexPageStateType {
  currentRegOrBindTabs: number
  user: User,
  isBindAccount: boolean
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
      user: new User,
      isBindAccount: true
    }
  }

  componentWillMount () {
    this.login()
  }

  componentDidMount () {}

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () {}

  switchTabs (value: number) {
    this.setState({
      currentRegOrBindTabs: value
    })
  }

  login() {
    if(!LocalData.getItem(LDKey.OPENID) || isDataTimeOut()) {
      getUserInfo().then(rs => {
        if (rs && rs.status) {
          LocalData.setItem(LDKey.OPENID, rs.openid)
          LocalData.setItem(LDKey.USER, rs.resdata)
          LocalData.setItem(LDKey.TIMESTAMP, new Date().getTime())
          this.setState({
            user: rs.resdata
          })
        } else {
          this.setState({
            isBindAccount: false
          })
        }
      })
    } else {
      this.setState({
        user: LocalData.getItem(LDKey.USER)
      })
    }
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
          <YGBindAccount />
        </AtTabsPane>
        <AtTabsPane current={currentRegOrBindTabs} index={1}>
          <YGRegister />
        </AtTabsPane>
      </AtTabs>
    )
  }

  indexPage() {
    const { user } = this.state
    return (
      <View>
        <View>
          <AtTag type='primary' circle>学号：{ user.stuid }</AtTag>
        </View>
        <View>
          <AtTag type='primary' circle>姓名：{ user.name }</AtTag>
        </View>
      </View>
    )
  }

  render () {
    const { isBindAccount } = this.state
    return (
      <View className='index'>
        {
          isBindAccount? this.indexPage() : this.registerOrBindAccountDom()
        }
      </View>
    )
  }
}
