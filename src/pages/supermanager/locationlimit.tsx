import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { getAllowLocation, setAlloLocation, getLocation } from '@/api'
import YGHeader from '@/components/YGHeader'
import { AtButton, AtIcon, AtInput } from 'taro-ui'
import './index.scss'

export default class LocationLimit extends Component<{}, {
  latitude: number;
  longitude: number;
  range: number;
  currentLocation: {
    latitude: number;
    longitude: number;
  },
  currentAddress: string;
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

  constructor() {
    super(...arguments)
    this.state = {
      latitude: 0,
      longitude: 0,
      range: 0,
      currentLocation: {
        latitude: 0,
        longitude: 0,
      },
      currentAddress: '正在定位中...',
      loading: true,
      btnloading: false
    }
  }

  componentDidMount() {
    this.refreshPage()
  }

  noop = () => {}

  handleChangeRange(value: string) {
    this.setState({
      range: Number(value)
    })
    return value
  }

  getCurrentLocation() {
    return Taro.getLocation({
      type: 'gcj02',
      highAccuracyExpireTime: 30000,
      isHighAccuracy: true,
      success: (res) => {
        const { latitude, longitude } = res
        const currentLocation = { latitude, longitude }
        this.setState({ currentLocation })
        getLocation({ latitude, longitude }).then(rs => {
          if (rs.result && rs.result) {
            this.setState({
              currentAddress: `${rs.result.address} ${rs.result.formatted_addresses && rs.result.formatted_addresses.recommend}`
            })
          } else {
            this.setState({
              currentAddress: `获取位置信息失败，请刷新重试`
            })
          }
        })
      },
      fail: () => {
        this.setState({
          currentAddress: `获取位置信息失败，请刷新重试`
        })
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
        latitude: rs.lat * 1,
        longitude: rs.long * 1,
        range: rs.range * 1
      })
    })
  }

  refreshPage() {
    this.setState(
      {
        loading: true
      },
      () => {
        Promise.all([
          this.getAllowLocation(),
          this.getCurrentLocation()
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

  updateLocation() {
    this.setState({ btnloading: true })
    const { currentLocation, range } = this.state
    setAlloLocation({
      lat: currentLocation.latitude,
      long: currentLocation.longitude,
      range
    }).then(rs => {
      if (rs.status) {
        Taro.showToast({
          title: '网站经纬度信息更新成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        Taro.showToast({
          title: '网站经纬度信息未修改',
          icon: 'none',
          duration: 2000
        })
      }
      this.setState({ btnloading: false })
    })
  }

  private genLocation() {
    const { latitude, longitude, range } = this.state
    return (
      <View className='page-super'>
        <AtInput
          name='longitude'
          title='经度'
          type='number'
          value={String(longitude)}
          onChange={this.noop}
          disabled
        />
        <AtInput
          name='latitude'
          title='纬度'
          type='number'
          value={String(latitude)}
          onChange={this.noop}
          disabled
        />
        <AtInput
          name='range'
          title='范围'
          type='number'
          placeholder='请输入范围'
          value={String(range)}
          onChange={this.handleChangeRange.bind(this)}
        />
      </View>
    )
  }

  private genCurrentLocation() {
    const { currentLocation } = this.state
    return (
      <View className='page-super'>
        <AtInput
          name='longitude'
          title='当前经度'
          type='number'
          value={String(currentLocation.longitude)}
          onChange={this.noop}
          disabled
        />
        <AtInput
          name='latitude'
          title='当前纬度'
          type='number'
          value={String(currentLocation.latitude)}
          onChange={this.noop}
          disabled
        />
      </View>
    )
  }

  render() {
    const { currentAddress, loading, btnloading } = this.state
    return (
      <View className='index'>
        <YGHeader back title='设置网站位置信息' background='#1F3BA6' />
        <View className='main yg-background'>
          {loading ? (
            <View className='loading'>
              <View style='display: flex;margin: 0 auto;align-items:center;'>
                <AtIcon value='loading-3' size='25' color='#333' className='span'></AtIcon>
                <View className='at-col ml-10'>正在获取位置信息...</View>
              </View>
            </View>
          ) : (
              <View>
                <View className='curlocation'>
                  网站当前位置信息：
                </View>
                {this.genLocation()}
                <View className='curlocation'>
                  当前位置： {currentAddress}
                </View>
                {this.genCurrentLocation()}
                <AtButton
                  type='primary'
                  className='btn'
                  loading={btnloading}
                  disabled={btnloading}
                  onClick={this.updateLocation.bind(this)}
                >
                  将当前位置信息设为网站所在位置
              </AtButton>
              </View>
            )}
        </View>
      </View>
    )
  }
}
