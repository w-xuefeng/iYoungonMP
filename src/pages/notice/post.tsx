import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { User } from '@/models'
import { AtButton, AtTextarea, AtForm, AtSwitch } from 'taro-ui'
import { LocalData, LDKey } from '@/utils/index'
import { postNotice, sendEmailToCurYoungoner } from '@/api'
import './index.scss'

type NoticePosterState = {
  currentUser: User;
  noticeContent: string;
  btnloading: boolean;
  isSendEmail: boolean;
}

export default class NoticePoster extends Component<{}, NoticePosterState> {

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
    navigationBarTitleText: '发布公告',
    backgroundColor: '#1F3BA6',
    enablePullDownRefresh: true,
    onReachBottomDistance: 50
  }

  constructor() {
    super(...arguments)
    this.state = {
      noticeContent: '',
      btnloading: false,
      isSendEmail: false,
      currentUser: LocalData.getItem(LDKey.USER)
    }
  }

  handleNoticeContentChange(value: string) {
    this.setState({
      noticeContent: value
    })
  }

  handleIsSendEmailChange(value: boolean) {
    this.setState({
      isSendEmail: value
    })
  }

  initPage() {
    this.setState({
      noticeContent: '',
      btnloading: false,
      isSendEmail: false,
    })
  }

  postNotice() {
    const { currentUser, noticeContent, isSendEmail } = this.state
    if (!noticeContent.trim()) {
      Taro.showToast({
        icon: 'none',
        title: '内容不能为空'
      })
      return
    }
    Taro.showModal({
      title: '提示',
      content: '您确定要发布这条公告吗？',
      success: res => {
        if (res.confirm) {
          this.setState({ btnloading: true })
          postNotice(currentUser.stuid, noticeContent).then(rs => {
            if (rs.status) {
              Taro.showToast({
                icon: 'success',
                title: '发布成功'
              })
              if (isSendEmail) {
                this.sendEmail({
                  title: '阳光网站发布公告',
                  content: noticeContent
                })
              }
              Taro.eventCenter.trigger('pubNoticeEvent')
            }
            this.initPage()
          })
        }
      }
    })
  }

  sendEmail({ title, content }: {
    title: string;
    content: string;
  }) {
    sendEmailToCurYoungoner({ type: 2, title, content }).then(rs => {
      if (rs.status) {
        Taro.showToast({
          icon: 'none',
          title: '已邮件通知站员'
        })
      }
    })
  }

  render() {
    const { btnloading, noticeContent, isSendEmail } = this.state
    return (
      <View className='page-notice yg-background'>
        <AtTextarea
          count={false}
          value={noticeContent}
          onChange={this.handleNoticeContentChange.bind(this)}
          maxLength={1000}
          height={200}
          placeholder='请输入公告内容...'
        />
        <AtForm>
          <AtSwitch
            border={false}
            title='邮件通知所有站员'
            checked={isSendEmail}
            onChange={this.handleIsSendEmailChange.bind(this)}
          />
        </AtForm>
        <AtButton
          className='post-btn'
          disabled={btnloading}
          full
          onClick={this.postNotice.bind(this)}
        >
          发布
        </AtButton>
      </View>
    )
  }
}
