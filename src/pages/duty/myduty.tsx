import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { DutyInfo, User } from '@/models'
import { AtAvatar, AtIcon } from 'taro-ui'
import { YGURL } from '@/api/url'
import { getDutyByStuid } from '@/api'
import YGCardWithTitleTip from '@/components/YGCardWithTitleTip'
import { LocalData, LDKey } from '@/utils/index'
import './index.scss'



type MyDutyState = {
  loading: boolean;
  dutyInfo?: DutyInfo;
}

export default class MyDuty extends Component<{}, MyDutyState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationStyle: 'default',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#1F3BA6',
    navigationBarTitleText: '我的值班',
    backgroundColor: '#1F3BA6',
    enablePullDownRefresh: true,
  }

  constructor() {
    super(...arguments)
    this.state = {
      dutyInfo: undefined,
      loading: true
    }
  }

  onPullDownRefresh() {
    this.initPage()
  }

  componentDidMount () {
    this.initPage()
  }

  initPage() {
    this.setState({ loading: true })
    getDutyByStuid(LocalData.getItem(LDKey.USER).stuid).then((rs: DutyInfo) => {
      let duty: DutyInfo = {
        ...rs,
        duty: rs.week && rs.week.map((week, i) => ({ week, class: rs.class[i] }))
      }
      this.setState({
        dutyInfo: duty,
        loading: false
      })
      Taro.stopPullDownRefresh()
    })
  }

  genDutyInfo(duty: DutyInfo) {
    const user: User = LocalData.getItem(LDKey.USER)
    return (
      <YGCardWithTitleTip
        icon='user'
        title={`${duty.name || user.name} 值班详情`}
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
          height: '92px'
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
            <AtAvatar image={`${YGURL.asset_url}${duty.head || user.head}`} size='small'></AtAvatar>
          </View>
          <View className='at-col'>
            <View className='at-row'>
              {duty.name || user.name}
            </View>
            <View className='at-row'>
              {duty.stuid || user.stuid}
            </View>
          </View>
        </View>
        {
          duty.duty ? (
            <View>
              <View
                className='flex-column'
                style='background:rgba(0,0,0,0.10);margin: 10px auto;padding: 15px;'
              >
                <Text>应值班时间：</Text>
                {
                  duty.duty.map((e, i) => (
                    <Text
                      key={`${duty.stuid}-should-duty-${i}`}
                      style={{
                        padding: '5px 10px',
                        fontSize: '16px',
                        color: '#007ACC'
                      }}
                    >
                      星期{ e.week} 第{ e.class}大节
                    </Text>
                  ))
                }
              </View>
              <View
                className='flex-column'
                style='background:rgba(0,0,0,0.10);margin: 10px auto;padding: 15px;'
              >
                <Text>实际值班时间：</Text>
                {
                  duty.dutydate.length ? duty.dutydate.map((e, i) => (
                    <Text
                      key={`${duty.stuid}-real-duty-${i}`}
                      style={{
                        padding: '5px 10px',
                        fontSize: '16px',
                        color: '#16C60C'
                      }}
                    >
                      {e}
                    </Text>
                  )) : <Text className='none'>暂无数据</Text>
                }
              </View>
            </View>
          ) : (<View className='none'>您不需要值班哦♪(＾∀＾●)ﾉ</View>)
        }
      </YGCardWithTitleTip>
    )
  }

  render () {
    const { loading, dutyInfo } = this.state
    return (
      <View className='page-duty yg-background'>
        {
          loading
            ? (
              <View className='loading'>
                <View style='display: flex;margin: 0 auto;align-items:center;'>
                  <AtIcon value='loading-3' size='25' color='#333' className='span'></AtIcon>
                  <View className='at-col ml-10'>加载中...</View>
                </View>
              </View>
            )
            : (
              <View>
                {
                  dutyInfo
                    ? this.genDutyInfo(dutyInfo)
                    : <View className='none'>您不需要值班哦♪(＾∀＾●)ﾉ</View>
                }
              </View>
            )
        }
      </View>
    )
  }
}
