import Taro, { Component, Config } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import { Notice } from '@/models'
import { AtIcon } from 'taro-ui'
import { getNoticeByPage } from '@/api'
import YGCardWithTitleTip from '@/components/YGCardWithTitleTip'
import './index.scss'



type NoticeRecentState = {
  loading: boolean;
  loadingMore: boolean;
  noticeList: Notice[]
}

export default class NoticeRecent extends Component<{}, NoticeRecentState> {

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
    navigationBarTitleText: '最近公告',
    backgroundColor: '#1F3BA6',
    enablePullDownRefresh: true,
    onReachBottomDistance: 50
  }

  constructor() {
    super(...arguments)
    this.state = {
      loading: true,
      loadingMore: false,
      noticeList: []
    }
  }

  componentDidMount() {
    this.initPage()
  }

  onPullDownRefresh() {
    this.initPage()
  }

  onReachBottom() {
    this.loadMore()
  }

  loadMore() {
    this.setState({ loadingMore: true })
    getNoticeByPage(this.state.noticeList.length).then((rs: Notice[]) => {
      this.setState(state => {
        const { noticeList } = state
        noticeList.push(...rs)
        return { noticeList }
      }, () => {
        this.setState({ loadingMore: false })
      })
    })
  }

  initPage() {
    this.setState({
      loading: true,
      loadingMore: false,
      noticeList: [],
    }, () => {
      getNoticeByPage(0).then((rs: Notice[]) => {
        this.setState({ noticeList: rs, loading: false })
        Taro.stopPullDownRefresh()
      })
    })
  }

  genNoticeItem(notice: Notice) {
    return (
      <YGCardWithTitleTip
        icon='tag'
        title={`公告ID: ${notice.nid}`}
        cardWidth='80%'
        tipsStyle={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start'
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
        <RichText nodes={notice.content} space='nbsp'></RichText>
        <View className='notice-footer'>
          {notice.publisher} 于 {notice.publishtime} 发布
        </View>
      </YGCardWithTitleTip>
    )
  }

  genNotice() {
    const {
      noticeList,
      loadingMore,
    } = this.state
    return (
      <View>
        {
          noticeList.length
            ? noticeList.map(notice => (
              <View key={notice.nid}>
                {this.genNoticeItem(notice)}
              </View>
            ))
            : <View className='none'>暂时没有啦 ♪(＾∀＾●)ﾉ</View>
        }
        {
          loadingMore
            ? <View className='none'>加载中...</View>
            : undefined
        }
      </View>
    )
  }

  render() {
    const { loading } = this.state
    return (
      <View className='page-notice yg-background'>
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
                {this.genNotice()}
              </View>
            )
        }
      </View>
    )
  }
}
