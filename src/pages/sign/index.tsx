import Taro, { Component, Config, WifiInfo } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components';
import { AtFab } from 'taro-ui'
import { LocalData, LDKey, accountPagePath, handelUserInfo, getNowTime } from '@/utils/index'
import { User } from '@/models'
import { getLocation, getUserInfo, getAllowWifi, getAllowLocation } from '@/api'
import YGHeader from '@/components/YGHeader'
import './index.scss'

const ImageYou = 'https://pub.wangxuefeng.com.cn/asset/youngon_logo/littleYou.png'
const ImageYoung = 'https://pub.wangxuefeng.com.cn/asset/youngon_logo/littleYoung.png'

interface CurrentState {
  user: User;
  online: boolean;
  wifiInfo: WifiInfo | null;
  latitude: number;
  longitude: number;
  address: string;
}

interface SystemConfig {
  allowlocation: {
    maxlat: number;
    minlat: number;
    maxlng: number;
    minlng: number;
  };
  allowwifi: string[];
}

interface UserInterface {
  loading: boolean;
  reason: string[];
  ifkey: string[];
  selectIndex: number;
  open: boolean;
}

interface SignPageStateType extends CurrentState, SystemConfig, UserInterface {}
export default class Sign extends Component<{}, SignPageStateType> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationStyle: 'custom',
    navigationBarTextStyle: 'white',
    backgroundColor: '#1F3BA6',
    enablePullDownRefresh: true
  }

  openMenuPage = () => {
    Taro.navigateTo({
      url: '/pages/menus/index'
    })
  }

  constructor() {
    super(...arguments)
    this.state = {

      /**
       * CurrentState 用户当前的状态
       */
      user: new User,
      online: false,
      wifiInfo: {
        SSID: '正在检测中...',
        BSSID: '',
        secure: true,
        signalStrength: -1
      },
      latitude: 0,
      longitude: 0,
      address: '正在定位中...',

      /**
       * SystemConfig 系统设置
       */
      allowlocation: {
        maxlat: 0,
        minlat: 0,
        maxlng: 0,
        minlng: 0
      },
      allowwifi: [],

    /**
     * UserInterface UI 界面
     */
      reason: ['请选择', '值班', '补值班', '例会', '临时进站', '自习', '其他'],
      ifkey: ['请选择', '否', '是'],
      loading: true,
      selectIndex: 0,
      open: false
    }
  }

  componentWillMount () {
    this.refreshPage()
  }

  componentDidMount () {}

  componentWillUnmount () {}

  componentDidShow () { }

  componentDidHide () {}

  getUser() {
    const user: User = LocalData.getItem(LDKey.USER)
    if (user) {
      this.setState({ user })
    } else {
      Taro.redirectTo({
        url: accountPagePath
      })
    }
  }

  checkOnline() {
    return getUserInfo().then(rs => this.updateUserInfoAndCheckOnline(rs.resdata))
  }

  updateUserInfoAndCheckOnline(user: User) {
    const curUser: User = handelUserInfo(user)
    this.setState({ user: curUser })
    this.setOnline(Number(user.online) === 1)
    LocalData.setItem(LDKey.USER, curUser)
    LocalData.setItem(LDKey.TIMESTAMP, new Date().getTime())
  }

  setOnline(online: boolean) {
    this.setState({ online })
    LocalData.setItem(LDKey.ONLINE, online)
  }

  getCurrentLocation() {
    return Taro.getLocation({
      type: 'gcj02',
      highAccuracyExpireTime: 30000,
      isHighAccuracy: true,
      success: (res) => {
        const { latitude, longitude } = res
        this.setState({ latitude, longitude })
        getLocation({ latitude, longitude }).then(rs => {
          if (rs.result && rs.result) {
            this.setState({
              address: `${rs.result.address} ${rs.result.formatted_addresses && rs.result.formatted_addresses.recommend}`
            })
          } else {
            this.setState({
              address: `获取位置信息失败，请刷新重试`
            })
          }
        })
      },
      fail: () => {
        Taro.showToast({
          title: '获取位置信息失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  }

  getAllowLocation() {
    return getAllowLocation().then(rs => {
      this.setState({
        allowlocation: {
          maxlat: rs.lat * 1 + rs.range * 1 * 0.00001,
          minlat: rs.lat * 1 - rs.range * 1 * 0.00001,
          maxlng: rs.long * 1 + rs.range * 1 * 0.00001,
          minlng: rs.long * 1 - rs.range * 1 * 0.00001
        }
      })
    })
  }

  getConnectedWifi() {
    return Taro.startWifi({
      success: () => {
        Taro.getConnectedWifi({
          success: (result: { wifi: WifiInfo }) => {
            this.setState({ wifiInfo: result.wifi })
          },
          fail: () => {
            this.setState({ wifiInfo: null })
          },
          complete: () => {
            Taro.stopWifi()
          }
        })
      },
    })
  }

  getAllowWifi() {
    return getAllowWifi().then(rs => {
      this.setState({
        allowwifi: rs.wifi
      })
    })
  }

  refreshPage() {
    this.setState({ loading: true })
    this.setState({ selectIndex: 0 })
    this.getUser()
    Promise.all([
      this.checkOnline(),
      this.getAllowWifi(),
      this.getAllowLocation(),
      this.getConnectedWifi(),
      this.getCurrentLocation(),
    ]).then(() => {
      this.setState({ loading: false })
      Taro.stopPullDownRefresh()
    }).catch(() => {
      this.setState({ loading: false })
      Taro.stopPullDownRefresh()
    })
  }

  onPullDownRefresh() {
    this.refreshPage()
  }

  signMenu(online: boolean) {
    return (
      <View>
      </View>
    )
  }

  signBtnClick(open: boolean) {
    this.setState({ open: !open })
  }

  signUI(online: boolean, open: boolean) {
    return (
      <View className='fab-inner'>
        <View className={`sign-menu ${open ? 'sign-menu-open' : 'sign-menu-hide'}`}>{this.signMenu(online)}</View>
        <AtFab className={`fab-inner-btn-${online ? 'out' : 'in'}`} onClick={this.signBtnClick.bind(this, open)}>
          <Text className={`at-fab__icon at-icon at-icon-${online ? 'upload' : 'download'} ${open ? 'at-icon-open' : 'at-icon-hide'}`}></Text>
          <Text className='fab-inner-btn-text'>{online ? '签退' : '签到'}</Text>
        </AtFab>
      </View>
    )
  }

  render () {
    const { loading, open, wifiInfo, latitude, longitude, address, user, reason, ifkey, online, allowlocation, allowwifi, selectIndex } = this.state
    return (
      <View className='index'>
        <YGHeader index />
        <View className='main'>
          <Image lazyLoad mode='aspectFit' src={online ? ImageYou : ImageYoung} style={{ width: '160px', position: 'fixed', bottom: '20px' }} />
          <Text>当前WiFi：{wifiInfo ? wifiInfo.SSID : loading ? '正在获取 wifi 信息...' : '尚未连接 wifi'}</Text>
          <Text>当前位置：{loading ? '正在获取位置信息...' : address}</Text>
          <View className='fab'>{this.signUI(online, open) }</View>
        </View>
      </View>
    )
  }
}
