import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { getAllowWifi, setAllowWifi } from '@/api'
import YGHeader from '@/components/YGHeader'
import { AtButton, AtIcon } from 'taro-ui'
import './index.scss'

export default class DelAdmin extends Component<{}, {
  // wifiInfo: WifiInfo | null;
  // allowwifi: string[];
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
    backgroundColor: '#1F3BA6'
  }

  wifi: string[] = []

  constructor() {
    super(...arguments)
    this.state = {
      // wifiInfo: null,
      // allowwifi: [],
      loading: true,
      btnloading: false
    }
  }

  componentWillMount() {}

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }


  updateWifiInfo() {
    // this.setState({ btnloading: true })
    // const { wifi } = this
    // setAllowWifi({ wifi }).then(rs => {
    //   if (rs.status) {
    //     Taro.showToast({
    //       title: 'WIFI 更新成功',
    //       icon: 'success',
    //       duration: 2000
    //     })
    //   }
    //   this.setState({ btnloading: false })
    // })
  }

   render() {
    const { loading, btnloading } = this.state
    return (
      <View className='index'>
        <YGHeader back title='设置网站 WIFI' background='#1F3BA6' />
        <View className='main'>
          {loading ? (
            <View className='loading'>
              <View style='display: flex;margin: 0 auto;'>
                <AtIcon value='loading-3' size='20' color='#333' className='span'></AtIcon>
                <View className='at-col'>加载中...</View>
              </View>
            </View>
          ) : (
              <View>
                <AtButton
                  type='primary'
                  className='btn'
                  loading={btnloading}
                  disabled={btnloading}
                  onClick={this.updateWifiInfo.bind(this)}
                >
                  设为管理员
              </AtButton>
              </View>
            )}
        </View>
      </View>
    )
  }
}
