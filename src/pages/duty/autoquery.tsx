import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { DutyInfo } from '@/models'
import { AtAvatar, AtSearchBar } from 'taro-ui'
import { YGURL } from '@/api/url'
import { getDutyInfo } from '@/api'
import YGHeader from '@/components/YGHeader'
import YGCardWithTitleTip from '@/components/YGCardWithTitleTip'
import './index.scss'

type AutoQueryDutyState = {
  loading: boolean;
  keywords: string;
  dutyInfo: DutyInfo[];
  rstDuty: DutyInfo[];
}

export default class AutoQueryDuty extends Component<{}, AutoQueryDutyState> {

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
      dutyInfo: [],
      keywords: '',
      rstDuty: [],
      loading: true
    }
  }

  componentDidMount () {
    this.initPage()
  }

  initPage() {
    this.setState({ loading: true })
    getDutyInfo().then((rs: DutyInfo[]) => {
      const duty: DutyInfo[] = rs.map(e => (
        {
          ...e,
          duty: e.week.map((week, i) => (
            {
              week,
              class: e.class[i]
            }
          ))
        }
      ))
      this.setState({
        rstDuty: duty,
        dutyInfo: duty,
        loading: false
      })
    })
  }

  keywordsChange(value: string) {
    this.setState({
      keywords: value
    })
    if (!value.trim()) {
      this.onClear()
    }
  }

  searchUser() {
    const { keywords, dutyInfo } = this.state
    if (!keywords.trim()) {
      Taro.showToast({
        title: '请输入学号或姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setState({
      loading: true,
      rstDuty: dutyInfo.filter(duty => [duty.name, duty.stuid].some(e => String(e).includes(keywords)))
    }, () => {
        this.setState({ loading: false })
    })
  }

  onClear() {
    const { dutyInfo } = this.state
    this.setState({ keywords: '', rstDuty: dutyInfo })
  }

  genDutyInfo(duty: DutyInfo) {
    return (
      <YGCardWithTitleTip
        icon='user'
        title={`${duty.name} 值班详情`}
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
            <AtAvatar image={`${YGURL.asset_url}${duty.head}`} size='small'></AtAvatar>
          </View>
          <View className='at-col'>
            <View className='at-row'>
              {duty.name}
            </View>
            <View className='at-row'>
              {duty.stuid}
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
          ): (<View className='none'>该站员无需值班</View>)
        }
      </YGCardWithTitleTip>
    )
  }

  render () {
    const { rstDuty, keywords, loading } = this.state
    return (
      <View className='auto-query'>
        <YGHeader back title='自动查值班' />
        <AtSearchBar
          className='search-bar-query-duty'
          value={keywords}
          onChange={this.keywordsChange.bind(this)}
          placeholder='请输入学号或者姓名搜索'
          onActionClick={this.searchUser.bind(this)}
          onClear={this.onClear.bind(this)}
        />
        <View className='main yg-background' style='padding-bottom: 30%;'>
          {
            loading
              ? <Text className='none'>加载中...</Text>
              : rstDuty.length
                ? rstDuty.map(duty => (
                  <View key={duty.stuid}>
                    {this.genDutyInfo(duty)}
                  </View>
                ))
                : <Text className='none'>暂无数据</Text>
          }
        </View>
      </View>
    )
  }
}
