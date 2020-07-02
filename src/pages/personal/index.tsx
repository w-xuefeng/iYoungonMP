import Taro, { Component, Config } from '@tarojs/taro'
import { View, RichText, Picker, Button } from '@tarojs/components'
import { User } from '@/models'
import {
  AtAvatar,
  AtInput,
  AtList,
  AtButton,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtListItem
} from 'taro-ui'
import {
  sexMap,
  LocalData,
  LDKey,
  accountPagePath,
  debounce,
  handelUserInfo,
  departmentArray
} from '@/utils/index'
import {
  getUserInfo,
  modifyUserInfo,
  bindAccount,
  uploadImage
} from '@/api'
import QQlevel from 'qqlevel'
import './index.scss'

interface PersonalCenterState extends User {
  changeLoading: boolean;
  isOpened: boolean;
  password: string;
}

export default class PersonalCenter extends Component<{}, PersonalCenterState> {

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
    navigationBarTitleText: '个人中心',
    backgroundColor: '#1F3BA6',
    enablePullDownRefresh: true
  }

  constructor() {
    super(...arguments)
    this.state = {
      ...LocalData.getItem(LDKey.USER),
      changeLoading: false,
      isOpened: false,
      password: ''
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
      ...curUser,
      changeLoading: false,
      isOpened: false,
      password: ''
    })
    this.setOnline(Number(user.online) === 1)
    LocalData.setItem(LDKey.USER, curUser)
    LocalData.setItem(LDKey.TIMESTAMP, new Date().getTime())
  }

  setOnline(online: boolean) {
    LocalData.setItem(LDKey.ONLINE, online)
  }

  noop = () => { }

  onPasswordChange(value: string)  {
    this.setState({ password: value })
  }

  initUlevel(mylevel?: number): QQlevel {
    const level = new QQlevel(mylevel)
    const icon = {
      crown: 'https://w-xuefeng.github.io/QQlevel/src/assets/crown.svg',
      sun: 'https://w-xuefeng.github.io/QQlevel/src/assets/sun.svg',
      moon: 'https://w-xuefeng.github.io/QQlevel/src/assets/moon.svg',
      star: 'https://w-xuefeng.github.io/QQlevel/src/assets/star.svg',
    }
    level.setIcon(icon)
    return level
  }

  handleOnChange<K extends keyof PersonalCenterState>(title: string, info: K, event: any ) {
    let value = event
    const userData = { [info]: event } as Pick<PersonalCenterState, K>
    if (info === 'sex') {
      const { text: sexName, value: sex } = sexMap[event.detail.value]
      this.setState({ sexName, sex: String(sex) })
      value = sex
    } else if (info === 'birthday') {
      const { value: birthday } = event.detail
      this.setState({ birthday })
      value = birthday
    } else if (info === 'department') {
      const department = departmentArray[event.detail.value]
      this.setState({ department })
      value = department
    } else {
      this.setState(userData)
    }
    this.updateUserInfo(title, info, value)
  }

  updateUserInfo<K extends keyof PersonalCenterState>(title: string, info: K, value: string | number){
    const { stuid, changeLoading } = this.state
    if (changeLoading || !String(value).trim()) {
      return
    }
    this.setState({ changeLoading: true })
    modifyUserInfo({ stuid, info, value }).then(rs => {
      if (rs.status) {
        const userData = { [info]: value } as Pick<PersonalCenterState, K>
        this.setLocalData(userData)
        Taro.showToast({ title: `${title}修改成功`, icon: 'success' })
      }
      this.setState({ changeLoading: false })
    })
  }

  setLocalData<K extends keyof PersonalCenterState>(userData: Pick<PersonalCenterState, K>) {
    const user: User = {
      ...LocalData.getItem(LDKey.USER),
      ...userData
    }
    LocalData.setItem(LDKey.USER, handelUserInfo(user))
  }

  switchUsher() {
    const { stuid } = this.state
    Taro.showModal({
      title: '提示',
      content: `确定要取消绑定 ${stuid} 吗？`,
      success: res => {
        if (res.confirm) {
          this.setState({
            isOpened: true
          })
        }
      }
    })
  }

  close() {
    this.setState({
      isOpened: false,
      password: ''
    })
  }

  logout() {
    const { stuid, password } = this.state
    if (!password.trim()) {
      Taro.showToast({ icon: 'none', title: '密码不能为空' })
      return
    }
    return bindAccount({ stuid, password, wxid: 'null' }).then(rs => {
      if (rs && rs.status) {
        Taro.showToast({ icon: 'success', title: '解绑成功' })
        LocalData.clear()
        this.setState({ isOpened: false, password: '' }, () => {
          Taro.reLaunch({
            url: accountPagePath
          })
        })
      }
    })
  }

  modifyHead() {
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        const headBase64 = Taro
          .getFileSystemManager()
          .readFileSync(tempFilePaths[0], 'base64') as string
        Taro.showLoading({ title: `头像上传中...` })
        uploadImage('head', `data:image/png;base64,${headBase64}`).then(rs => {
          if (rs.status && rs.head) {
            const { stuid } = this.state
            const info = 'head'
            const value = rs.head
            modifyUserInfo({ stuid, info, value }).then(data => {              
              if (data.status) {
                this.setLocalData({ head: value })
                Taro.eventCenter.trigger('refreshPage')
                this.refreshPage().then(() => {
                  Taro.hideLoading()
                  Taro.showToast({ title: `头像修改成功`, icon: 'success' })
                })                
              } else {
                Taro.hideLoading()
                Taro.showToast({ title: `网络错误`, icon: 'none' })
              }
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
    const {
      stuid,
      name,
      fullhead,
      ulevel,
      birthday,
      sexName,
      college,
      majorclass,
      department,
      sex,
      email,
      qq,
      phone,
      utypeName,
      positionName,
      isOpened,
      password
    } = this.state
    const level = this.initUlevel(ulevel)
    return (
      <View className='page-personal-center yg-background'>
        <View
          className='head-top'
          style={{ backgroundImage: `url(${fullhead})`}}
          onClick={this.modifyHead.bind(this)}
        >
          <View className='cover'>
            <View className='headimg'>
              <AtAvatar circle image={fullhead}></AtAvatar>
            </View>
            {
              ulevel === 0 ? '' : <RichText nodes={level.outputLevelHTML()}></RichText>
            }
          </View>
        </View>
        <View className='info-bottom'>
          <AtInput
            name='学号'
            title='学号'
            type='text'
            placeholder={stuid}
            value={stuid}
            disabled
            onChange={this.noop}
          />
          <AtInput
            name='姓名'
            title='姓名'
            type='text'
            placeholder={name}
            value={name}
            onChange={
              debounce(
                (title, info, value) => this.handleOnChange(title, info, value),
                3000
              ).bind(this, '姓名', 'name')
            }
          />
          <Picker
            mode='selector'
            range={sexMap}
            rangeKey='text'
            onChange={this.handleOnChange.bind(this, '性别', 'sex')}
            value={Number(sex || 0)}
          >
            <AtList>
              <AtListItem title='性别' extraText={sexName} />
            </AtList>
          </Picker>
          <AtInput
            name='学院'
            title='学院'
            type='text'
            placeholder={college}
            value={college}
            onChange={
              debounce(
                (title, info, value) => this.handleOnChange(title, info, value),
                3000
              ).bind(this, '学院', 'college')
            }
          />
          <AtInput
            name='班级'
            title='班级'
            type='text'
            placeholder={majorclass}
            value={majorclass}
            onChange={
              debounce(
                (title, info, value) => this.handleOnChange(title, info, value),
                3000
              ).bind(this, '班级', 'majorclass')
            }
          />
          <Picker
            mode='selector'
            range={departmentArray}
            onChange={this.handleOnChange.bind(this, '部门', 'department')}
            value={departmentArray.findIndex(e => e === department)}
          >
            <AtList>
              <AtListItem title='部门' extraText={department} />
            </AtList>
          </Picker>
          <AtInput
            name='邮箱'
            title='邮箱'
            type='text'
            placeholder={email}
            value={email}
            onChange={
              debounce(
                (title, info, value) => this.handleOnChange(title, info, value),
                3000
              ).bind(this, '邮箱', 'email')
            }
          />
          <AtInput
            name='QQ'
            title='QQ'
            type='text'
            placeholder={qq}
            value={qq}
            onChange={
              debounce(
                (title, info, value) => this.handleOnChange(title, info, value),
                3000
              ).bind(this, 'QQ', 'qq')
            }
          />
          <Picker mode='date'
            onChange={this.handleOnChange.bind(this, '生日', 'birthday')}
            value={String(birthday)}
          >
            <AtList>
              <AtListItem title='生日' extraText={birthday} />
            </AtList>
          </Picker>
          <AtInput
            name='手机号码'
            title='手机号码'
            type='text'
            placeholder={phone}
            value={phone}
            onChange={
              debounce(
                (title, info, value) => this.handleOnChange(title, info, value),
                3000
              ).bind(this, '手机号码', 'phone')
            }
          />
          <AtInput
            name='用户类型'
            title='用户类型'
            type='text'
            placeholder={utypeName}
            value={utypeName}
            disabled
            onChange={this.noop}
          />
          <AtInput
            name='当前职位'
            title='当前职位'
            type='text'
            placeholder={positionName}
            value={positionName}
            disabled
            onChange={this.noop}
          />
        </View>
        <AtButton
          className='logout-btn'
          full
          onClick={this.switchUsher.bind(this)}
        >
          切换用户
        </AtButton>
        <AtModal isOpened={isOpened} closeOnClickOverlay={false}>
          <AtModalHeader>请验证密码</AtModalHeader>
          <AtModalContent>
            <AtInput
              name='密码'
              title='密码'
              type='password'
              placeholder={password}
              value={password}
              onChange={this.onPasswordChange.bind(this)}
            />
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.close.bind(this)}>取消</Button>
            <Button onClick={this.logout.bind(this)}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
