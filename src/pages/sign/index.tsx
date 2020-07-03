import Taro, { Component, Config, WifiInfo } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components';
import { AtFab, AtCard, AtLoadMore, AtButton } from 'taro-ui'
import { LocalData, LDKey, accountPagePath, handelUserInfo, getNowTime } from '@/utils/index'
import { User, SignRecord } from '@/models'
import {
  addDuty,
  getLocation,
  getUserInfo,
  getAllowWifi,
  signInRequest,
  signOutRequest,
  getAllowLocation,
  getSignRecordByTime,
} from '@/api'
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
  signLoading: boolean;
  loadMoreStatus: 'loading' | 'noMore' | 'more';
  reason: string[];
  ifkey: string[];
  open: boolean;
  menuSpace: boolean;
  todayRecord: SignRecord[];
  todayRecordCountPrePage: number;
  todayRecordTotal?: number;
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
      reason: ['值班', '补值班', '例会', '临时进站', '自习', '其他'],
      ifkey: ['没有携带钥匙', '携带钥匙'],
      loadMoreStatus: 'more',
      todayRecord: [],
      todayRecordTotal: 0,
      loading: true,
      signLoading: false,
      open: false,
      menuSpace: false,
      todayRecordCountPrePage: 10
    }
  }

  componentWillMount () {
    this.refreshPage()
    Taro.eventCenter.on('refreshPage', () => this.checkOnline())
  }

  componentDidMount () {}

  componentWillUnmount () {
    Taro.eventCenter.off('refreshPage')
  }

  componentDidShow () { }

  componentDidHide () {}

  toast(title: string, icon: 'loading' | 'success' | 'none' = 'none', duration: number = 2000) {
    Taro.showToast({ title, icon, duration })
  }

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
          title: '(づ╥﹏╥)づ， 网络出现了一点小波动',
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

  getTodaySignRecord() {
    return getSignRecordByTime({
      time: getNowTime().ymd,
      page: this.state.todayRecord.length,
      count: this.state.todayRecordCountPrePage
    }).then(rs => {
      const { todayRecord } = this.state
      rs.resdata.forEach((e: SignRecord) => {
        if (todayRecord.every((record: SignRecord) => record.id !== e.id)) {
          todayRecord.push(e)
        }
      })
      this.setState({
        todayRecord,
        todayRecordTotal: rs.count,
        loadMoreStatus: rs.count && rs.count < this.state.todayRecordCountPrePage || rs.resdata.length === 0 ? 'noMore' : 'more'
      })
      return rs.resdata
    })
  }

  afterSign() {
    Taro.eventCenter.trigger('signEvent')
    this.setState(
      {
        open: false,
        menuSpace: false,
        todayRecord: [],
        loadMoreStatus: 'more',
        loading: true
      },
      () => {
        this.getUser()
        Promise.all([
          this.checkOnline(),
          this.getTodaySignRecord(),
        ]).then(() => {
          this.setState({ loading: false })
        }).catch(() => {
          this.setState({ loading: false })
        })
      }
     )
  }

  refreshPage() {
    this.setState(
      {
        open: false,
        menuSpace: false,
        todayRecord: [],
        loadMoreStatus: 'more',
        loading: true
      },
      () => {
        this.getUser()
        Promise.all([
          this.checkOnline(),
          this.getAllowWifi(),
          this.getAllowLocation(),
          this.getConnectedWifi(),
          this.getCurrentLocation(),
          this.getTodaySignRecord(),
        ]).then(() => {
          this.setState({ loading: false })
          Taro.stopPullDownRefresh()
        }).catch(() => {
          this.setState({ loading: false })
          Taro.stopPullDownRefresh()
        })
      }
     )
  }

  onPullDownRefresh() {
    this.refreshPage()
  }

  loadMore() {
    this.setState({
      loadMoreStatus: 'loading'
    })
    this.getTodaySignRecord()
  }

  signIn(item: string) {
    const {
      open,
      user,
      allowlocation,
      allowwifi,
      wifiInfo,
      latitude,
      longitude,
      loading,
      signLoading
    } = this.state
    if (loading || signLoading) {
      this.toast('别急，数据正在拼命加载中(ง •_•)ง')
    }
    if (open && !loading && !signLoading) {
      const islinkWifi = allowwifi.includes(wifiInfo ? wifiInfo.SSID : '')
      const islat = latitude < (allowlocation.maxlat * 1) && latitude > (allowlocation.minlat * 1)
      const islong = longitude < (allowlocation.maxlng * 1) && longitude > (allowlocation.minlng * 1)
      if (islinkWifi || (islat && islong)) {
        this.setState({ signLoading: true })
        this.signInRequest(item, user)
      } else {
        this.toast('请在指定位置签到')
      }
    }
  }

  signInRequest(item: string, user: User) {
    Taro.showLoading({
      title: `(●'◡'●)，签到中...`,
    })
    signInRequest(user.stuid, item).then(rs => {
      Taro.hideLoading()
      if (rs.status) {
        if (item.includes('值班')) {
          this.addDuty(user.stuid)
        } else {
          this.toast('o(*￣▽￣*)ブ， 签到成功')
        }
        this.afterSign()
        this.setOnline(true)
      } else {
        this.toast('(T_T)， 签到失败嘞，别灰心，再试一次')
      }

      this.setState({ signLoading: false })
    }).catch(() => {
      Taro.hideLoading()
      this.toast('迷失在茫茫网络中...')
      this.setState({ signLoading: false })
    })
  }

  addDuty(stuid: string | number) {
    Taro.showLoading({
      title: `(●'◡'●)，耐心...`,
    })
    addDuty(stuid, getNowTime().cn).then(rs => {
      Taro.hideLoading()
      if (rs.status) {
        this.toast(`(●'◡'●)， 值班签到成功`)
      } else {
        this.toast('≧ ﹏ ≦， 添加值班记录失败啦')
      }
    }).catch (() => {
      Taro.hideLoading()
      this.toast('值班记录迷失在茫茫网络中...')
    })
  }

  signOut(i: number) {
    const { user, open, loading, signLoading } = this.state
    if (loading || signLoading) {
      this.toast('别急，数据正在拼命加载中(ง •_•)ง')
    }
    if (open && !loading && !signLoading) {
      Taro.showLoading({
        title: `(●'◡'●)，签退中...`,
      })
      this.setState({ signLoading: true })
      signOutRequest(user.stuid, i).then(rs => {
        Taro.hideLoading()
        if (rs && rs.status) {
          this.afterSign()
          this.toast('o(*￣▽￣*)ブ， 签退成功')
          this.setOnline(false)
        } else {
          this.toast('(；′⌒`)，签退失败啦，别灰心， 再试一次')
        }
        this.setState({ signLoading: false })
      }).catch(() => Taro.hideLoading())
    }
  }

  signMenu() {
    const { online, reason, ifkey, signLoading, menuSpace } = this.state
    const colorIn = ['blue', 'green', 'yellow', 'red', 'blue', 'green']
    const colorOut = ['blue', 'green']
    if (!menuSpace) return
    if (online) {
      return (
        <View className='sign-menu-inner'>
          {
            ifkey.map((item: string, i: number) => (
              <AtButton
                loading={signLoading}
                disabled={signLoading}
                className={`background background-${colorOut[i]}`}
                size='small'
                key={item}
                onClick={this.signOut.bind(this, i)}
              >{item}</AtButton>
            ))
          }
        </View>
      )
    }
    return (
      <View className='sign-menu-inner'>
        {
          reason.map((item: string, i: number) => (
            <AtButton
              loading={signLoading}
              disabled={signLoading}
              className={`background background-${colorIn[i]}`}
              size='small'
              key={item}
              onClick={this.signIn.bind(this, item)}
            >{item}</AtButton>
          ))
        }
      </View>
    )
  }

  signBtnClick(open: boolean) {
    if (open) {
      this.setState({ open: false })
      setTimeout(() => {
        this.setState({ menuSpace: false })
      }, 500)
    } else {
      this.setState({ menuSpace: true, open: true })
    }
  }

  signUI(online: boolean, open: boolean) {
    return (
      <View className='fab-inner'>
        <View className={`sign-menu ${open ? 'sign-menu-open' : 'sign-menu-hide'}`}>{this.signMenu()}</View>
        <AtFab className={`fab-inner-btn-${online ? 'out' : 'in'}`} onClick={this.signBtnClick.bind(this, open)}>
          <Text className={`at-fab__icon at-icon at-icon-${online ? 'upload' : 'download'} ${open ? 'at-icon-open' : 'at-icon-hide'}`}></Text>
          <Text className='fab-inner-btn-text'>{online ? '签退' : '签到'}</Text>
        </AtFab>
      </View>
    )
  }

  genList(title: string[], content: SignRecord[], loading: boolean, loadMoreStatus: 'loading' | 'noMore' | 'more') {
    return (
      <View className='list'>
        <View
          className='at-row row-sapce'
          style={{
            borderBottom: '1px solid #eee'
          }}
        >
          {
            title.map((item: string) => (
              <View className='at-col list-title' key={item}>{item}</View>
            ))
          }
        </View>
        <View className='list-content'>
          {
            content && content.length > 0 ? content.map((item: SignRecord) => (
              <View
                className='at-row row-sapce' key={item.id}
                style={{
                  borderBottom: '1px solid #eee'
                }}
              >
                <View className='at-col'>{item.id}</View>
                <View className='at-col'>{item.name}</View>
                <View className='at-col'>{item.entertime.split(' ')[1]}</View>
                <View className='at-col'>{item.reason}</View>
                <View className='at-col'>{item.outtertime.includes('1949-10-01') ? '' : item.outtertime.split(' ')[1]}</View>
              </View>
            )) : <View className='none'>{loading ? '加载中' : '暂无记录'}</View>
          }
          {
            content && content.length > 0 && loadMoreStatus !== 'noMore'
              ? (
                <AtLoadMore
                  className='loadmore'
                  onClick={this.loadMore.bind(this)}
                  status={loadMoreStatus}
                />
              )
              : content && content.length > 0 && loadMoreStatus === 'noMore'
              ? <View className='none-more'>已加载全部 ♪(＾∀＾●)ﾉ</View>
              : ''
          }
        </View>
      </View>
    )
  }

  render () {
    const {
      /**
       * UserInterface UI 界面
       */
      loading,
      open,
      todayRecord,
      todayRecordTotal,
      loadMoreStatus,

      /**
      * CurrentState 用户当前的状态
      */
      online,
      address,
      wifiInfo
    } = this.state
    const listTitle = ['记录编号', '姓名', '进站时间', '进站原因', '离站时间']
    return (
      <View className='index'>
        <YGHeader index />
        <View className='main yg-background'>
          <View className='sign-main'>
            <AtCard
              extra={`总计：${todayRecordTotal}`}
              title={`阳光网站 ${getNowTime().ymd} 签到表`}
              icon={{ value: 'tag'}}
              className='card'
            >
              {
                this.genList(listTitle, todayRecord, loading, loadMoreStatus)
              }
              <View className='at-card__content-note footer'>
                <Text>当前WiFi：{wifiInfo ? wifiInfo.SSID : loading ? '正在获取 wifi 信息...' : '尚未连接 wifi'}</Text>
                <Text>当前位置：{loading ? '正在获取位置信息...' : address}</Text>
              </View>
            </AtCard>
          </View>
          <Image lazyLoad mode='aspectFit' src={online ? ImageYou : ImageYoung} style={{ width: '160px', position: 'fixed', bottom: '20px' }} />
          <View className='fab'>{this.signUI(online, open) }</View>
        </View>
      </View>
    )
  }
}
