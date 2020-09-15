import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { Apply, User } from '@/models'
import {
  AtAvatar,
  AtTabs,
  AtButton,
  AtIcon,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction
} from 'taro-ui'
import { YGURL } from '@/api/url'
import { LocalData, LDKey } from '@/utils/index'
import {
  getApplyByType,
  getApprovalApply,
  handleApply,
  sendEmail
} from '@/api'
import YGCardWithTitleTip from '@/components/YGCardWithTitleTip'
import './index.scss'



type ApplyListState = {
  isOpened: boolean;
  loading: boolean;
  loadingMore: boolean;
  btnloading: boolean;
  currentTabs: number;
  currentUser: User;
  currentApply: Apply;
  currentApplyState: 0 | 1 | 2;
  applayInfoUndo: Apply[];
  applayInfoAgree: Apply[];
  applayInfoRefuse: Apply[];
}

export default class ApplyList extends Component<{}, ApplyListState> {

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
    navigationBarTitleText: '申请列表',
    backgroundColor: '#1F3BA6',
    enablePullDownRefresh: true,
    onReachBottomDistance: 50
  }

  constructor() {
    super(...arguments)
    this.state = {
      isOpened: false,
      applayInfoUndo: [],
      applayInfoAgree: [],
      applayInfoRefuse: [],
      currentApply: new Apply(),
      currentApplyState: 0,
      currentUser: LocalData.getItem(LDKey.USER),
      loading: true,
      loadingMore: false,
      btnloading: false,
      currentTabs: 0
    }
  }

  componentDidMount() {
    this.initPage()
  }

  onPullDownRefresh() {
    this.initPage()
  }

  onReachBottom() {
    const { currentTabs } = this.state
    if (currentTabs === 1) {
      this.loadMore()
    }
  }

  close() {
    this.setState({
      isOpened: false
    }, () => {
      this.setState({
        currentApply: new Apply(),
        currentApplyState: 0
      })
    })
  }

  open(apply: Apply, state: 1 | 2) {
    this.setState({
      currentApply: apply,
      currentApplyState: state
    }, () => {
      this.setState({ isOpened: true })
    })
  }

  genMailContent(apply: Apply, state: 1 | 2) {
    const status = state === 1 ? '已经' : '未'
    const content = `您于${apply.appdate}提出的申请${status}被批准！具体申请内容如下<br>
      ${
        apply.appclass === 0 ? `申请内容: ${apply.appreason}`
          : `
              请假原因：${apply.appreason}<br/>
              请假时间：${apply.apptime}<br/>
              请假课节：${apply.appclass}<br/>
              补值班时间：${apply.appfixtime}<br/>
              补值班课节：${apply.appfixclass}<br/>
            `
      }`
    const title = `您的申请${status}被批准`
    return { content, title }
  }

  handleApply(stuid: string | number, apply: Apply, state: 1 | 2) {
    this.setState({ btnloading: true })
    handleApply({ stuid, aid: apply.aid, state }).then(rs => {
      if (rs.status) {
        Taro.showToast({
          icon: 'success',
          title: '处理成功'
        })
        const { content, title } = this.genMailContent(apply, state)
        this.sendEmail({
          tomail: apply.applicantstuid,
          title,
          content
        }).then(() => {
          this.initPage()
        })
      } else {
        this.initPage()
      }
    })
  }

  sendEmail({ tomail, title, content }: {
    tomail: string | number;
    title: string;
    content: string;
  }) {
    return sendEmail({ tomail, type: 2, title, content }).then(rs => {
      if (rs.status) {
        Taro.showToast({
          icon: 'none',
          title: '已邮件告知该站员'
        })
      }
    })
  }

  loadMore() {
    this.setState({ loadingMore: true })
    getApprovalApply(this.state.applayInfoAgree.length).then(rs => {
      this.setState(state => {
        const { applayInfoAgree } = state
        applayInfoAgree.push(...rs)
        return { applayInfoAgree }
      }, () => {
          this.setState({ loadingMore: false})
      })
    })
  }

  initPage() {
    this.setState({
      isOpened: false,
      loading: true,
      btnloading: false,
      loadingMore: false,
      currentApplyState: 0,
      currentApply: new Apply(),
    })
    Promise.all([
      getApplyByType('unapproved'),
      getApprovalApply(0),
      getApplyByType('refuse'),
    ]).then((rs: (Apply[])[]) => {
      this.setState({
        applayInfoUndo: rs[0],
        applayInfoAgree: rs[1],
        applayInfoRefuse: rs[2],
        loading: false
      })
      Taro.stopPullDownRefresh()
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
    const { btnloading } = this.state
    return (
      <YGCardWithTitleTip
        icon='user'
        title={`${apply.applicantname} 于 ${apply.appdate} 提出申请`}
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
            <AtAvatar image={`${YGURL.asset_url}${apply.applicanthead}`} size='small'></AtAvatar>
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
            ? (
              <View className='at-row' style='margin: 10px auto;'>
                <View className='at-col at-col-6'>
                  <AtButton
                    className='agree-btn'
                    disabled={btnloading}
                    size='small'
                    onClick={this.open.bind(this, apply, 1)}
                  >
                    批准
                  </AtButton>
                </View>
                <View className='at-col at-col-6'>
                  <AtButton
                    className='refuse-btn'
                    disabled={btnloading}
                    size='small'
                    onClick={this.open.bind(this, apply, 2)}
                  >
                    拒绝
                  </AtButton>
                </View>
              </View>
            )
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
      applayInfoRefuse,
      loadingMore,
      currentTabs
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
            : <View className='none'>暂时没有啦 ♪(＾∀＾●)ﾉ</View>
        }
        {
          type === 1 && currentTabs === 1 && loadingMore
            ? <View className='none'>加载中...</View>
            : undefined
        }
      </View>
    )
  }

  render() {
    const {
      isOpened,
      loading,
      currentTabs,
      currentApplyState,
      currentApply,
      currentUser
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
        <AtModal isOpened={isOpened}>
          <AtModalHeader>处理请求</AtModalHeader>
          <AtModalContent>
            <Text style='display: flex'>
              <Text>确定要</Text>
              {
                currentApplyState === 1
                  ? <Text style='color:#007ACC'>批准这条申请吗 o(*￣▽￣*)ブ?</Text>
                  : <Text style='color:#E64949'>拒绝这条申请吗 ◔ ‸◔?</Text>
              }
            </Text>
            <View className='flex-column' style={{
                margin: '10px 0',
                padding: '10px',
                background: 'rgba(0,0,0,0.15)'
              }}
            >
              {
                currentApply.appclass === 0 ? undefined : (
                  <View className='flex-column'>
                    <Text>请假时间: {currentApply.apptime} 第{currentApply.appclass}大节</Text>
                    <Text>补值班时间: {currentApply.appfixtime} 第{currentApply.appfixclass}大节</Text>
                  </View>
                )
              }
              <Text>申请 {currentApply.appclass === 0 ? '内容' : '原因'}: {currentApply.appreason}</Text>
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.close.bind(this)}>取消</Button>
            <Button onClick={this.handleApply.bind(this, currentUser.stuid, currentApply, currentApplyState)}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
