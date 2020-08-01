import Taro, { Component, Config, WifiInfo } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { getAllowWifi, setAllowWifi } from '@/api'
import YGHeader from '@/components/YGHeader'
import { AtButton, AtIcon } from 'taro-ui'
import './index.scss'

export default class WifiOptions extends Component<{}, {
  wifiInfo: WifiInfo | null;
  allowwifi: string[];
  loading: boolean;
  btnloading: boolean;
}> {

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

  wifi: string[] = []

  constructor() {
    super(...arguments)
    this.state = {
      wifiInfo: null,
      allowwifi: [],
      loading: true,
      btnloading: false
    }
  }

  componentDidMount () {
    this.refreshPage()
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
      this.wifi = rs.wifi
    })
  }

  refreshPage() {
    this.setState(
      {
        loading: true
      },
      () => {
        Promise.all([
          this.getAllowWifi(),
          this.getConnectedWifi()
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

  updateWifiInfo() {
    this.setState({ btnloading: true })
    const { wifi } = this
    setAllowWifi({ wifi }).then(rs => {
      if (rs.status) {
        Taro.showToast({
          title: 'WIFI 信息更新成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        Taro.showToast({
          title: 'WIFI 信息未修改',
          icon: 'none',
          duration: 2000
        })
      }
      this.setState({ btnloading: false })
    })
  }

  private changeWIFI(fn: (wifi: string[]) => string[]) {
    this.setState(
      state => ({ allowwifi: fn(state.allowwifi) }),
      () => { this.wifi = this.state.allowwifi }
    )
  }

  private handleInput = (value: string, i: number) => (this.wifi[i] = value,value)

  private add() {
    this.changeWIFI(wifi => [...wifi, ''])
  }

  private sub(i: number) {
    this.changeWIFI(wifi => {
      const value = [...wifi]
      value.splice(i, 1)
      return value
    })
  }

  private genWifiInput(allowwifi: string[]) {
    return (
      <View className='page-super'>
        {
          allowwifi.map((wifi, i) => (
            <View key={wifi} className='row'>
              <View className='row input'>
                <View className='col'>
                  <AtIcon value='streaming' size='20' color='#007ACC'></AtIcon>
                </View>
                <View className='col col-3 input-inner'>
                  <Input
                    className='input-inner-text'
                    type='text'
                    placeholder='请输入 Wifi 名称'
                    value={wifi}
                    onInput={e => this.handleInput(e.detail.value, i)}
                    onBlur={e => this.handleInput(e.detail.value, i)}
                  />
                </View>
              </View>
              <View className='col'>
                {i === 0 ? (
                  <AtIcon value='add-circle' size='25' color='#007ACC' onClick={this.add.bind(this)}></AtIcon>
                ) : (
                    <AtIcon value='subtract-circle' size='25' color='#F00' onClick={this.sub.bind(this, i)}></AtIcon>
                  )}
              </View>
            </View>
          ))
        }
      </View>
    )
  }

  render () {
    const { wifiInfo, allowwifi, loading, btnloading } = this.state
    return (
      <View className='index'>
        <YGHeader back title='设置网站 WIFI' background='#1F3BA6' />
        <View className='main yg-background'>
          {loading ? (
            <View className='loading'>
              <View style='display: flex;margin: 0 auto;align-items:center;'>
                <AtIcon value='loading-3' size='25' color='#333' className='span'></AtIcon>
                <View className='at-col ml-10'>加载中...</View>
              </View>
            </View>
          ) : (
            <View>
              <View className='curwifi'>
                网站当前 WIFI 设置信息：
              </View>
              {this.genWifiInput(allowwifi)}
              <View className='curwifi'>
                当前连接 WIFI： {wifiInfo ? wifiInfo.SSID : '正在获取当前 Wifi 信息...'}
              </View>
              <AtButton
                type='primary'
                className='btn'
                loading={btnloading}
                disabled={btnloading}
                onClick={this.updateWifiInfo.bind(this)}
              >
                更新 WIFI 信息
              </AtButton>
            </View>
          )}
        </View>
      </View>
    )
  }
}
