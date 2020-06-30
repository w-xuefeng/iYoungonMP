import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { User } from '@/models'
import {
  AtTabs,
  AtTabsPane,
  AtButton,
  AtSlider,
  AtTextarea,
  AtList,
  AtListItem
} from 'taro-ui'
import { LocalData, LDKey } from '@/utils/index'
import { postApply, sendEmailToAdmins } from '@/api'
import './index.scss'

type AddApplyListState = {
  btnloading: boolean;
  currentTabs: number;
  currentUser: User;
  appreason: string;
  appotherreason: string;
  apptime: string;
  appclass: number;
  appfixtime: string;
  appfixclass: number;
}

export default class AddApply extends Component<{}, AddApplyListState> {

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
    navigationBarTitleText: '提出申请',
    backgroundColor: '#1F3BA6',
    enablePullDownRefresh: true,
    onReachBottomDistance: 50
  }

  constructor() {
    super(...arguments)
    this.state = {
      currentUser: LocalData.getItem(LDKey.USER),
      btnloading: false,
      currentTabs: 0,
      appreason: '',
      appotherreason: '',
      apptime: '',
      appclass: 0,
      appfixtime: '',
      appfixclass: 0
    }
  }

  componentWillMount() {
    this.initPage()
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onPullDownRefresh() {
    this.initPage()
  }

  genMailContent(applyInfo: {
    stuid: string;
    reason: string;
    apptime: string;
    appclass: number;
    appfixtime: string;
    appfixclass: number;
  }) {
    const { currentUser, currentTabs } = this.state
    const content = currentTabs === 0
      ? `<br/>
        请假原因：${applyInfo.reason}<br/>
        请假时间：${applyInfo.apptime}<br/>
        请假课节：${applyInfo.appclass}<br/>
        补值班时间：${applyInfo.appfixtime}<br/>
        补值班课节：${applyInfo.appfixclass}<br/>
        请管理员尽快回复申请!<br/>
      `
      : `<br/>
        请假内容：${applyInfo.reason}<br/>
        请管理员尽快回复申请!<br/>
      `
    const title = `${currentUser.name}提出申请`
    return { content, title }
  }

  prePost() {
    const {
      currentTabs,
      appreason: reason,
      appotherreason: otherreason,
      apptime,
      appclass,
      appfixtime,
      appfixclass
    } = this.state
    if (currentTabs === 0) {
      if (!reason.trim() || !apptime || !appclass || !appfixtime || !appfixclass) {
        Taro.showToast({
          icon: 'none',
          title: '信息填写不完整'
        })
        return
      }
    } else if (currentTabs === 1) {
      if (!otherreason.trim()) {
        Taro.showToast({
          icon: 'none',
          title: '请填写申请内容'
        })
        return
      }
    }
    Taro.showModal({
      title: '提示',
      content: '确定要发布这条申请吗？',
      success: res => {
        if (res.confirm) {
          this.postApply()
        }
      }
    })
  }

  postApply() {
    this.setState({ btnloading: true })
    const {
      currentTabs,
      currentUser,
      appreason: reason,
      appotherreason: otherreason,
      apptime,
      appclass,
      appfixtime,
      appfixclass
    } = this.state
    const { stuid } = currentUser
    let applyInfo = { stuid, reason, apptime, appclass, appfixtime, appfixclass }
    if (currentTabs === 1)  {
      applyInfo = {
        stuid,
        reason: otherreason,
        apptime: '2017-01-01',
        appclass: 0,
        appfixtime: '2017-01-01',
        appfixclass: 0
      }
    }
    postApply(applyInfo).then(rs => {
      if (rs.status) {
        Taro.showToast({
          icon: 'success',
          title: '处理成功'
        })
        const { content, title } = this.genMailContent(applyInfo)
        this.sendEmail({ title, content }).then(() => {
          this.initPage()
        })
      } else {
        this.initPage()
      }
    })
  }

  sendEmail({ title, content }: {
    title: string;
    content: string;
  }) {
    return sendEmailToAdmins({ type: 2, title, content }).then(rs => {
      if (rs.status) {
        Taro.showToast({
          icon: 'none',
          title: '申请已提交，请等待管理员回复'
        })
      }
    })
  }

  initPage() {
    this.setState({
      btnloading: false,
      currentTabs: 0,
      appreason: '',
      apptime: '',
      appclass: 0,
      appfixtime: '',
      appfixclass: 0
    }, () => Taro.stopPullDownRefresh())
  }

  switchTabs(value: number) {
    this.setState({
      currentTabs: value
    })
  }
  handleAppotherreasonChange(value: string) {
    this.setState({ appotherreason: value })
  }

  handleAppreasonChange(value: string) {
    this.setState({ appreason: value })
  }

  handleAppclassChange(value: number) {
    this.setState({ appclass: value })
  }

  handleAppfixclassChange(value: number) {
    this.setState({ appfixclass: value })
  }

  onApptimeChange = e => {
    this.setState({
      apptime: e.detail.value
    })
  }

  onAppfixtimeChange = e => {
    this.setState({
      appfixtime: e.detail.value
    })
  }

  genDutyApply() {
    const {
      btnloading,
      appreason,
      apptime,
      appclass,
      appfixtime,
      appfixclass
    } = this.state
    return (
      <View className='flex-column'>
        <View className='flex-column' style='margin: 10px'>
          <Text>请假原因:</Text>
          <AtTextarea
            count={false}
            value={appreason}
            onChange={this.handleAppreasonChange.bind(this)}
            maxLength={1000}
            height={200}
            placeholder='请输入请假原因...'
          />
        </View>
        <View>
          <Picker mode='date' onChange={this.onApptimeChange} value={apptime}>
            <AtList>
              <AtListItem title='请选择请假日期' extraText={apptime} />
            </AtList>
          </Picker>
        </View>
        <View className='flex-column'
          style={{
            margin: '10px',
            padding: '25px',
            background: 'rgba(0,0,0,0.15)'
          }}
        >
          <Text>请假课节：{appfixclass}</Text>
          <AtSlider
            step={1}
            value={appfixclass}
            max={4}
            min={1}
            activeColor='#007ACC'
            backgroundColor='#BDBDBD'
            blockColor='#007ACC'
            blockSize={24}
            onChange={this.handleAppfixclassChange.bind(this)}
          ></AtSlider>
        </View>
        <View>
          <Picker mode='date' onChange={this.onAppfixtimeChange} value={appfixtime}>
            <AtList>
              <AtListItem title='请选择补值班日期' extraText={appfixtime} />
            </AtList>
          </Picker>
        </View>
        <View className='flex-column'
          style={{
            margin: '10px',
            padding: '25px',
            background: 'rgba(0,0,0,0.15)'
          }}
        >
          <Text>补值班课节：{appclass}</Text>
          <AtSlider
            step={1}
            value={appclass}
            max={4}
            min={1}
            activeColor='#007ACC'
            backgroundColor='#BDBDBD'
            blockColor='#007ACC'
            blockSize={24}
            onChange={this.handleAppclassChange.bind(this)}
          ></AtSlider>
        </View>
        <AtButton
          className='post-btn'
          disabled={btnloading}
          full
          onClick={this.prePost.bind(this)}
        >
          提出申请
        </AtButton>
      </View>
    )
  }

  genOtherApply() {
    const {
      btnloading,
      appotherreason,
    } = this.state
    return (
      <View className='flex-column'>
        <AtTextarea
          count={false}
          value={appotherreason}
          onChange={this.handleAppotherreasonChange.bind(this)}
          maxLength={1000}
          height={200}
          placeholder='请输入申请内容...'
        />
        <AtButton
          className='post-btn'
          disabled={btnloading}
          full
          onClick={this.prePost.bind(this)}
        >
          提出申请
        </AtButton>
      </View>
    )
  }

  render() {
    const { currentTabs } = this.state
    const tabList = [
      {
        title: '值班请假'
      },
      {
        title: '其他申请'
      }
    ]
    return (
      <View className='page-post-apply-list yg-background'>
        <AtTabs
          current={currentTabs}
          tabList={tabList}
          onClick={this.switchTabs.bind(this)}
        >
          <AtTabsPane current={currentTabs} index={0} >
            {this.genDutyApply()}
          </AtTabsPane>
          <AtTabsPane current={currentTabs} index={1} >
            {this.genOtherApply()}
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
