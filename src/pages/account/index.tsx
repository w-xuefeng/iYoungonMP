import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import { getUserInfo } from '@/api'
import {
  LocalData,
  LDKey,
  isDataTimeOut,
  gotoIndex,
  handelUserInfo
} from "@/utils/index";
import YGHeader from '@/components/YGHeader'
import YGRegister from '@/components/YGRegister'
import YGBindAccount from '@/components/YGBindAccount'
import './index.scss'


interface AccountSettingStateType {
  currentRegOrBindTabs: number,
  loading: boolean
}
export default class AccountSetting extends Component<{}, AccountSettingStateType> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationStyle: 'custom',
    navigationBarTextStyle: 'white'
  }

  constructor() {
    super(...arguments)
    this.state = {
      currentRegOrBindTabs: 0,
      loading: true
    }
    this.login()
  }

  switchTabs(value: number) {
    this.setState({
      currentRegOrBindTabs: value
    })
  }

  login() {
    if (!LocalData.getItem(LDKey.USER) || isDataTimeOut()) {
      // 本地不存在有效的登录信息
      getUserInfo().then(rs => {
        LocalData.setItem(LDKey.OPENID, rs.openid)
        if (rs && rs.status) {
          // 用户已绑定账号
          LocalData.setItem(LDKey.USER, handelUserInfo(rs.resdata))
          LocalData.setItem(LDKey.ONLINE, Number(rs.resdata.online) === 1)
          LocalData.setItem(LDKey.TIMESTAMP, new Date().getTime())
          gotoIndex()
        }
        this.setState({ loading: false })
        // 用户未绑定帐号，显示绑定帐号页面
      })
    } else {
      // 已有有效登录信息
      gotoIndex()
    }
  }

  render() {
    const { currentRegOrBindTabs, loading } = this.state
    const tabList = [
      {
        title: '绑定 iYoungon 帐号'
      },
      {
        title: '注册 iYoungon 帐号'
      }
    ]
    return loading ? (
      <View className='loading yg-background'>
        <View style='display: flex;margin: 0 auto;align-items:center;'>
          <AtIcon value='loading-3' size='25' color='#333' className='span'></AtIcon>
          <View className='at-col ml-10'>加载中...</View>
        </View>
      </View>
    ) : (
        <View className='account'>
          <YGHeader title='设置账号' />
          <AtTabs current={currentRegOrBindTabs} tabList={tabList} onClick={this.switchTabs.bind(this)}>
            <AtTabsPane current={currentRegOrBindTabs} index={0} >
              <YGBindAccount />
            </AtTabsPane>
            <AtTabsPane current={currentRegOrBindTabs} index={1}>
              <YGRegister />
            </AtTabsPane>
          </AtTabs>
        </View>
      )
  }
}
