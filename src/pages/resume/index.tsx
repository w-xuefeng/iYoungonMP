import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Resume, User } from '@/models'
import { AtCard, AtTag, AtProgress } from 'taro-ui'
import { LocalData, LDKey, handelUserInfo } from '@/utils/index'
import { modifyUserPhoto, getUserInfo, modifyUserInfo } from '@/api'
import './index.scss'


/**
 * 默认1寸证件照
 */
const defaultPhoto = 'https://pub.wangxuefeng.com.cn/asset/defaultHead/1c.jpg'


const baseInfo = [
  {
    key: 'name',
    text: '姓名'
  },
  {
    key: 'sex',
    text: '性别'
  },
  {
    key: 'stuid',
    text: '学号'
  },
  {
    key: 'birthday',
    text: '出生日期'
  },
  {
    key: 'nation',
    text: '民族'
  },
  {
    key: 'nativeplace',
    text: '籍贯'
  },
  {
    key: 'email',
    text: '邮箱'
  },
  {
    key: 'phone',
    text: '电话'
  },
  {
    key: 'college',
    text: '学院'
  },
  {
    key: 'majorclass',
    text: '班级'
  }
]
const otherInfo = [
  {
    key: 'skill',
    text: '个人特长'
  },
  {
    key: 'computermaster',
    text: '计算机掌握情况'
  },
  {
    key: 'softlang',
    text: '了解的计算机软件及语言'
  },
  {
    key: 'selfcomment',
    text: '三个词概括自己'
  },
  {
    key: 'department',
    text: '意向部门'
  },
  {
    key: 'departmentreason',
    text: '为什么选择这个部门'
  },
  {
    key: 'demand',
    text: '你觉得你在这里能够得到什么'
  },
  {
    key: 'work',
    text: '作品'
  },
  {
    key: 'activityapply',
    text: '活动经历'
  }
]

type MyResumeState = {
  photo?: string | null;
  currentUser: User;
  resume: Resume;
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
      photo: user.photo,
      currentUser: user,
      resume: JSON.parse(user.interviewform || 'null') || new Resume({ ...user, sex: user.sexName })
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
      currentUser: curUser,
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
        const { currentUser } = this.state
        const { stuid } = currentUser
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

  modifyMyResume() {
    const { currentUser, resume } = this.state
    const { stuid } = currentUser
    const info = 'interviewform'
    const { str: value, obj } = this.genInterviewform(currentUser, resume)
    modifyUserInfo({ stuid, info, value }).then(data => {
      if (data.status) {
        this.refreshPage().then(() => {
          this.setLocalData({ interviewform: value })
          currentUser.interviewform = value
          this.setState({
            currentUser,
            resume: obj,
          })
          Taro.showToast({ title: `简历保存成功`, icon: 'success' })
        })
      }
    })
  }

  genInterviewform(user: User, resume: Resume) {
    Object.keys(new Resume()).map(key => {
      if (!resume[key] && user[key]) {
        resume[key] = user[key]
      }
    })
    if (user.sexName) {
      resume.sex = user.sexName
    }
    return {
      obj: resume,
      str: JSON.stringify(resume),
    }
  }

  genContent(resume: Resume, key: string) {
    if (['skill', 'softlang', 'selfcomment'].includes(key)) {
      return (
        <View style='display: flex;flex-wrap: wrap;'>
          {
            resume[key] && resume[key].length
              ? resume[key].map((k, i) => (
                  <AtTag
                    className='resume-mr-10'
                    name={`tag-${key}-${i}`}
                    key={`tag-${key}-${i}`}
                    size='small'
                    active
                  >
                    {k}
                  </AtTag>
                )) : '暂未填写'
          }
        </View>
      )
    }
    if (key === 'computermaster') {
      const value = [10, 66, 99]
      return (
        <AtProgress percent={value[resume[key]]} color='#007ACC' />
      )
    }
    if (key === 'department' && resume[key]) {
      return (
        <AtTag
          name={`tag-${key}`}
          size='small'
          active
        >
          {resume[key]}
        </AtTag>
      )
    }
    if (key === 'work') {
      return (
        <View style='display: flex;flex-direction: column;'>
          {
            resume[key] && resume[key].length
              ? resume[key].map((k, i) => (
                <View key={`work-${i}`} style='display: flex;flex-direction: column;margin: 5px 0'>
                  <Text>作品链接: {k.workurl || '暂未填写'}</Text>
                  <Text>作品描述: {k.workdesc || '暂未填写'}</Text>
                </View>
              )) : '暂未填写'
          }
        </View>
      )
    }
    if (key === 'activityapply') {
      return (
        <View style='display: flex;flex-direction: column;'>
          {
            resume[key] && resume[key].length
              ? resume[key].map((k, i) => (
                <View key={`work-${i}`} style='display: flex;flex-direction: column;margin: 5px 0'>
                  <Text>活动名称: {k.actname || '暂未填写'}</Text>
                  <Text>活动时间: {k.acttime || '暂未填写'}</Text>
                  <Text>担任的职责: {k.actrole || '暂未填写'}</Text>
                  <Text>活动具体描述: {k.actdesc || '暂未填写'}</Text>
                </View>
              )) : '暂未填写'
          }
        </View>
      )
    }
    return (
      <Text>{resume[key] || '暂未填写'}</Text>
    )
  }

  render() {
    const { resume, currentUser, photo } = this.state
    return (
      <View className='page-resume yg-background'>
        <AtCard
          note='可前往 https://join.youngon.work 完善简历'
          extra={currentUser.name}
          title='我的简历'
        >
          <View className='head-top'>
            <View
              className='photo'
              style={{ backgroundImage: `url(${photo || defaultPhoto})` }}
              onClick={this.modifyPhoto.bind(this)}
            ></View>
            <View className='right-info'>
              {
                baseInfo.map(e => (
                  <Text
                    className='right-info-item'
                    key={e.key}
                  >
                    <Text className='right-info-item-tips'>{e.text}</Text>：{
                      resume[e.key] || currentUser[e.key] || '暂未填写'
                    }
                  </Text>
                ))
              }
            </View>
          </View>
          <View className='info-bottom'>
            {
              otherInfo.map(e => (
                <View className='flex-column' key={e.key}>
                  <Text className='other-title'>{e.text}</Text>
                  <View className='other-content'>
                    {
                      this.genContent(resume, e.key)
                    }
                  </View>
                </View>
              ))
            }
          </View>
        </AtCard>
      </View>
    )
  }
}
