import Taro, { Component, Config } from '@tarojs/taro'
import { View, RichText, Text, Image } from '@tarojs/components'
import YGMenu from '@/components/YGMenu'
import { AtAvatar } from 'taro-ui'
import { LocalData, LDKey, accountPagePath, transDepartMentColor } from '@/utils/index'
import menus from '@/pages/menus/menu.json'
import { User } from '@/models'
import QQlevel from 'qqlevel'
import './index.scss'

export interface HeaderInfo {
  fullhead: string;
  name: string;
  utype: string;
  ulevel: number;
}

export interface YGMyStateType {
  statusBarHeight: string;
  user: User;
}

export default class MenusPage extends Component<{}, YGMyStateType> {

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
    backgroundColor: '#1F3BA6',
  }

  headerConfig = {
    isImg: false,
    cover: 'rgba(56, 56, 56, 0.45)',
    img: ''
  }

  constructor() {
    super(...arguments)
    this.state = {
      statusBarHeight: '60px',
      user: new User
    }
  }
  componentWillMount () {
    this.getStatusBarHeight()
    this.getUser()
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getUser() {
    const user: User = LocalData.getItem(LDKey.USER)
    if (user) {
      this.setState({ user })
    } else {
      Taro.redirectTo({
        url: accountPagePath
      })
    }
  }

  getStatusBarHeight() {
    const { statusBarHeight } = Taro.getSystemInfoSync()
    this.setState({
      statusBarHeight: `${statusBarHeight + 65}px`
    })
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

  sex(sex: number) {
    if (sex === 0) return
    return (
      <Image
        style='width:15px;height:15px;'
        src={`https://pub.wangxuefeng.com.cn/asset/img/${sex === 1 ? 'boy' : 'girl'}.svg`}
      />
    )
  }

  genHeader() {
    const { headerConfig } = this
    const { statusBarHeight, user } = this.state
    const {
      fullhead,
      name,
      sex,
      positionName,
      department = '天商人',
      utypeName,
      signcount = 0,
      ulevel = 0
    } = user
    const level = this.initUlevel(ulevel)
    const extraInfo = [
      {
        title: '签到次数',
        value: signcount
      },
      {
        title: '所在部门',
        value: department
      },
      {
        title: '当前职位',
        value: positionName
      }
    ]
    return (
        <View
          className='header'
          style={
            headerConfig.isImg
            ? { backgroundImage: `url(${headerConfig.img})` }
            : {}
          }
        >
          <View
            className='cover'
            style={
              headerConfig.isImg
              ? { backgroundColor: headerConfig.cover }
              : {}
            }
          >
            <View
              className='header-content'
              style={{
                paddingTop: statusBarHeight
              }}
            >
              <View className='headimg'>
                <AtAvatar circle image={fullhead}></AtAvatar>
              </View>
              <View className='header-info ml-20'>
                <View className='name-level'>
                  <View style='display: flex;'>
                    <Text>{name}</Text>
                    <View style='margin: 0 5px'>{ this.sex(Number(sex)) }</View>
                  </View>
                  <View className='level-btn ml-20' style={{ background: transDepartMentColor(department)}}>
                    {department}
                  </View>
                  <View className='level-btn ml-20' style={{ background: '#1ED76D' }}>
                    {utypeName}
                  </View>
                </View>
                <View className='level-wrap'>
                  <View className='level-btn mr-20' style={
                    {
                      background: '#FFFFFF',
                      color: '#1F3BA6',
                      borderRadius: '2px'
                    }
                  }
                  >
                    YGLV {ulevel}
                  </View>
                  {
                    ulevel === 0 ? '' : <RichText nodes={level.outputLevelHTML()}></RichText>
                  }
                  </View>
              </View>
            </View>
            <View className='extra-content'>
              {
                extraInfo.map((item, i) => (
                  <View
                    key={item.title}
                    className={`item${ i === extraInfo.length - 1 ? '' : ' item-border' }`}
                  >
                    <View className='value'>{item.value}</View>
                    <View className='title'>{item.title}</View>
                  </View>
                ))
              }
            </View>
          </View>
        </View>
    )
  }

  render () {
    const { utype } = this.state.user
    return (
      <View className='index'>
        {this.genHeader()}
        <View className='main'>
          <YGMenu menus={menus} utype={utype}></YGMenu>
        </View>
      </View>
    )
  }
}
