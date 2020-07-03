import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Resume, User } from '@/models'
// import {
// } from 'taro-ui'
import { LocalData, LDKey, handelUserInfo } from '@/utils/index'
import { modifyUserPhoto, getUserInfo } from '@/api'
import './index.scss'


/**
 * 默认1寸证件照
 */
const defaultPhoto = 'https://pub.wangxuefeng.com.cn/asset/defaultHead/1c.jpg'

type MyResumeState = {
  stuid: string | number;
  resume: Resume;
  photo: string | null | undefined;
}

export default class MyResume extends Component<{}, MyResumeState> {

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
    navigationBarTitleText: '我的简历',
    backgroundColor: '#1F3BA6',
    enablePullDownRefresh: true
  }

  constructor() {
    super(...arguments)
    const user: User = LocalData.getItem(LDKey.USER)
    this.state = {
      stuid: user.stuid,
      photo: user.photo,
      resume: JSON.parse(user.interviewform || 'null') || new Resume()
    }
  }

  componentWillMount() {
    this.refreshPage()
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onPullDownRefresh() {
    this.refreshPage()
  }

  refreshPage() {
    return this.checkOnline().then(_ => Taro.stopPullDownRefresh())
  }

  checkOnline() {
    return getUserInfo().then(rs => this.updateUserInfoAndCheckOnline(rs.resdata))
  }

  updateUserInfoAndCheckOnline(user: User) {
    const curUser: User = handelUserInfo(user)
    this.setState({
      stuid: curUser.stuid,
      photo: curUser.photo,
      resume: JSON.parse(curUser.interviewform || 'null'),
    })
    this.setOnline(Number(user.online) === 1)
    LocalData.setItem(LDKey.USER, curUser)
    LocalData.setItem(LDKey.TIMESTAMP, new Date().getTime())
    Taro.eventCenter.trigger('refreshPage')
  }

  setOnline(online: boolean) {
    LocalData.setItem(LDKey.ONLINE, online)
  }

  setLocalData<K extends keyof User>(userData: Pick<User, K>) {
    const user: User = {
      ...LocalData.getItem(LDKey.USER),
      ...userData
    }
    LocalData.setItem(LDKey.USER, user)
  }

  modifyPhoto() {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const { stuid } = this.state
        const tempFilePaths = res.tempFilePaths
        const photoBase64 = Taro
          .getFileSystemManager()
          .readFileSync(tempFilePaths[0], 'base64') as string
        Taro.showLoading({ title: `证件照上传中...` })
        modifyUserPhoto({ stuid, photo: `data:image/png;base64,${photoBase64}` }).then(data => {
          if (data.status) {
            this.setLocalData({ photo: data.resdata.url })
            this.refreshPage().then(() => {
              Taro.hideLoading()
              Taro.showToast({ title: `证件照上传成功`, icon: 'success' })
            })
          } else {
            Taro.hideLoading()
            Taro.showToast({ title: `网络错误`, icon: 'none' })
          }
        })
      }
    })
  }

  render() {
    const { resume, photo } = this.state
    return (
      <View className='page-resume yg-background'>
        <View className='head-top'>
          <View
            className='photo'
            style={{ backgroundImage: `url(${photo || defaultPhoto})` }}
            onClick={this.modifyPhoto.bind(this)}
          ></View>
        </View>
        <View className='info-bottom'>
          {resume}
        </View>
      </View>
    )
  }
}
