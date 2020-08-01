import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SignRecord } from '@/models'
import { AtAvatar } from 'taro-ui'
import { YGURL } from '@/api/url'
import YGHeader from '@/components/YGHeader'
import YGCardWithTitleTip from '@/components/YGCardWithTitleTip'
import './index.scss'

export default class SignDetail extends Component<{}, Partial<SignRecord>> {

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

  constructor() {
    super(...arguments)
    this.state = {
      outtertime: '',
      entertime: '',
      head: '',
      name: '',
      reason: '',
      stuid: ''
    }
  }
  componentDidMount () {
    this.initPage()
  }

  initPage() {
    const data = this.$router.preload
    if (data) {
      this.setState(data as Partial<SignRecord>)
    } else {
      Taro.navigateBack()
    }
  }

  genOutterTime(outtertime: string) {
    return !outtertime || outtertime === '1949-10-01 00:00:00'
      ? '尚未签退'
      : outtertime.substring(11, 18) === '00:00:0'
      ? '未签退 系统自动签退'
      : outtertime
  }

  render () {
    const {
      outtertime = '',
      entertime = '',
      head = '',
      name = '',
      reason = '',
      stuid = ''
    } = this.state
    return (
      <View className='index'>
        <YGHeader back title='签到详情' />
        <View className='main yg-background'>
          <YGCardWithTitleTip
            icon='user'
            title={`${name} 签到详情`}
            cardWidth='80%'
            tipsStyle={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
            itemStyle={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'center'
            }}
            activeItemStyle={{
              transform: 'rotate(45deg) translate(30%,60%)'
            }}
            cardStyle={{
              marginTop: '30rpx',
              padding: '50rpx',
              boxShadow: '2px 2px 3px rgba(0,0,0,0.4)',
              maxHeight: '50vh',
              overflow: 'auto'
            }}
          >
            <View className='at-row head-info'>
              <View className='at-col at-col-2'>
                <AtAvatar image={`${YGURL.asset_url}${head}`} size='small'></AtAvatar>
              </View>
              <View className='at-col'>
                <View className='at-row'>
                  {name}
                </View>
                <View className='at-row'>
                  {stuid}
                </View>
              </View>
            </View>
            <View>进站时间：{entertime}</View>
            <View>进站原因：{reason}</View>
            <View>离站时间：{this.genOutterTime(outtertime)}</View>
          </YGCardWithTitleTip>
        </View>
      </View>
    )
  }
}
