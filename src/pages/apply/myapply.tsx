import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Apply } from '@/models'
import {
  AtAvatar,
  AtTabs,
  AtIcon
} from 'taro-ui'
import { LocalData, LDKey } from '@/utils/index'
import { getApplyByStuid } from '@/api'
import YGCardWithTitleTip from '@/components/YGCardWithTitleTip'
import './index.scss'

type MyApplyListState = {
  loading: boolean;
  currentTabs: number;
  applayInfoUndo: Apply[];
  applayInfoAgree: Apply[];
  applayInfoRefuse: Apply[];
}

export default class MyApplyList extends Component<{}, MyApplyListState> {

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
    navigationBarTitleText: '我的申请',
    backgroundColor: '#1F3BA6',
    enablePullDownRefresh: true,
    onReachBottomDistance: 50
  }

  constructor() {
    super(...arguments)
    this.state = {
      applayInfoUndo: [],
      applayInfoAgree: [],
      applayInfoRefuse: [],
      loading: true,
      currentTabs: 0
    }
  }

  componentDidMount() {
    this.initPage()
  }

  onPullDownRefresh() {
    this.initPage()
  }

  initPage() {
    this.setState({ loading: true })
    getApplyByStuid(LocalData.getItem(LDKey.USER).stuid)
      .then((rs: Apply[]) => {
        this.setState({
          applayInfoUndo: rs.filter(e => e.state === 0),
          applayInfoAgree: rs.filter(e => e.state === 1),
          applayInfoRefuse: rs.filter(e => e.state === 2),
          loading: false
        }, () => Taro.stopPullDownRefresh())
    })
  }

  switchTabs(value: number) {
    Taro.showLoading({
      title: '拼命切换中...'
    })
    this.setState({
      currentTabs: value
    }, () => Taro.hideLoading())
  }

  genApplyItem(apply: Apply) {
    return (
      <YGCardWithTitleTip
        icon='user'
        title={`我于 ${apply.appdate} 提出申请`}
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
          boxShadow:  '1px 1px 1px rgba(0,0,0,0.4)',
          maxHeight: '50vh',
          overflow: 'auto'
        }}
      >
        <View className='at-row head-info'>
          <View className='at-col at-col-2'>
            <AtAvatar image={LocalData.getItem(LDKey.USER).fullhead} size='small'></AtAvatar>
          </View>
          <View className='at-col'>
            <View className='at-row'>
              {apply.applicantname}
            </View>
            <View className='at-row'>
              {apply.applicantstuid}
            </View>
          </View>
        </View>
        <View className='flex-column'>
          {
            apply.appclass === 0 ? undefined : (
              <View className='flex-column'>
                <Text>请假时间: {apply.apptime} 第{apply.appclass}大节</Text>
                <Text>补值班时间: {apply.appfixtime} 第{apply.appfixclass}大节</Text>
              </View>
            )
          }
          <Text>申请{apply.appclass === 0 ? '内容' : '原因'}: {apply.appreason}</Text>
          {
            apply.state === 0
              ? <Text className='handled' style='color:#009688;'>待处理</Text>
              : apply.state === 1
                ? <Text className='handled' style='color:dodgerblue;'>已批准 处理人:{apply.handlername}</Text>
                : <Text className='handled' style='color:red;'>已拒绝 处理人:{apply.handlername}</Text>
          }
        </View>
      </YGCardWithTitleTip>
    )
  }

  genApply(type: 0 | 1 | 2) {
    const {
      applayInfoUndo,
      applayInfoAgree,
      applayInfoRefuse
    } = this.state
    const map = [
      applayInfoUndo,
      applayInfoAgree,
      applayInfoRefuse
    ]
    return (
      <View>
        {
          map[type].length
            ? map[type].map(apply => (
              <View key={apply.aid}>
                {this.genApplyItem(apply)}
              </View>
            ))
            : <View className='none'>太棒了，暂时没有申请哦 ♪(＾∀＾●)ﾉ</View>
        }
      </View>
    )
  }

  render() {
    const {
      loading,
      currentTabs
    } = this.state
    const tabList = [
      {
        title: '待处理申请'
      },
      {
        title: '已同意申请'
      },
      {
        title: '已拒绝申请'
      }
    ]
    return (
      <View className='page-apply-list yg-background'>
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
              <View className='height100'>
                <AtTabs
                  className='fixedTab'
                  current={currentTabs}
                  tabList={tabList}
                  onClick={this.switchTabs.bind(this)}
                >
                </AtTabs>
                <View className='height100'>
                  {this.genApply(currentTabs as (0 | 1 | 2))}
                </View>
              </View>
            )
        }
      </View>
    )
  }
}
