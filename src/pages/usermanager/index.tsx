import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { getAllUsersByToken, modifyUserInfo } from '@/api'
import { LocalData, LDKey, handelUserInfo } from '@/utils/index'
import YGHeader from '@/components/YGHeader'
import {
  AtAvatar,
  AtIcon,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtList,
  AtListItem,
  AtSlider,
  AtSearchBar,
  AtFloatLayout
} from 'taro-ui'
import { User } from '@/models'
import './index.scss'

type UserFilter = {
  k: keyof User,
  v: number | string | number[] | string[]
}

export default class UserManager extends Component<{}, {
  allUser: User[];
  currentStuid: string;
  currentName: string;
  currentUtype: number;
  currentHead?: string;
  currentDepartment?: string;
  currentPosition: number;
  currentUserTitle: string;
  keywords: string;
  rstUser: User[];
  isOpened: boolean;
  loading: boolean;
  btnloading: boolean;
  showRst: boolean;
}> {

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
    enablePullDownRefresh: true
  }

  utypenames = [
    '普通用户',
    '实习站员',
    '正式站员',
    '往届站员'
  ]

  noop = () => {}

  logo = 'https://pub.wangxuefeng.com.cn/asset/youngon_logo/logo-blue-small.png'

  menu = [
    [
      {
        color: '#2196F3',
        text: '普通用户',
        filter: {
          k: 'utype',
          v: 0
        }
      },
      {
        color: '#9C7DCF',
        text: '实习站员',
        filter: {
          k: 'utype',
          v: 1
        }
      },
      {
        color: '#FFA500',
        text: '正式站员',
        filter: {
          k: 'utype',
          v: 2
        }
      },
    ],
    [
      {
        color: '#4CAF50',
        text: '往届站员',
        filter: {
          k: 'utype',
          v: 3
        }
      },
      {
        color: '#008B8B',
        text: '当前站务',
        filter: [
          {
            k: 'position',
            v: [4, 5, 6]
          },
          {
            k: 'utype',
            v: [2, 4, 5]
          }
        ]
      },
      {
        color: '#2db7f5',
        text: '实习站务',
        filter: [
          {
            k: 'position',
            v: [1, 2, 3]
          },
          {
            k: 'utype',
            v: 2
          },
        ]
      }
    ]
  ]

  departments = [
    '天商人',
    '开发部',
    '企划部',
    '信息部',
    '运营部'
  ]

  positionnames = [
    '站员',
    '实习部长',
    '实习副站',
    '实习站长',
    '部长',
    '副站',
    '站长',
    '指导老师'
  ]

  constructor() {
    super(...arguments)
    this.state = {
      allUser: [],
      currentStuid: '',
      currentName: '',
      currentUtype: 0,
      currentHead: '',
      currentDepartment: '',
      currentPosition: 0,
      currentUserTitle: '',
      keywords: '',
      rstUser: [],
      isOpened: false,
      loading: true,
      btnloading: false,
      showRst: false,
    }
  }

  componentWillMount () {
    this.refreshPage()
  }

  componentDidMount () {}

  componentWillUnmount () {}

  componentDidShow () { }

  componentDidHide () {}

  close() {
    this.setState({
      isOpened: false
    }, () => {
      this.setState({
        currentStuid: '',
        currentUtype: 0,
        currentName: '',
        currentHead: '',
        currentDepartment: '',
        currentPosition: 0,
      })
    })
  }

  open(user: User) {
    this.setState({
      currentStuid: user.stuid,
      currentUtype: user.utype,
      currentName: user.name,
      currentHead: user.fullhead,
      currentDepartment: user.department,
      currentPosition: user.position || 0,
    }, () => {
      this.setState({
        isOpened: true,
      })
    })
  }

  keywordsChange(value: string) {
    this.setState({
      keywords: value
    })
  }

  genUserFilterCondiction(user: User, filter: UserFilter) {
    const { k, v } = filter
    if (Array.isArray(v)) {
      return v.includes(user[k] as never)
    }
    return user[k] === v
  }

  rstFilter(title: string, filterFunc: (v: User) => boolean, filter?: UserFilter | UserFilter[]) {
    const { allUser, btnloading } = this.state
    if (btnloading) return
    Taro.showLoading({ title: '拼命查询中...' })
    let myfilter = (u: User) => !!u
    if (filterFunc) {
      myfilter = filterFunc
    } else if (filter) {
      if (Array.isArray(filter)) {
        myfilter = (u: User) => {
          const condiction = filter.map(f => this.genUserFilterCondiction(u, f))
          return condiction.every(e => e)
        }
      } else {
        myfilter = (u: User) => this.genUserFilterCondiction(u, filter)
      }
    }
    this.setState({
      btnloading: true,
      currentUserTitle: title,
      rstUser: allUser.filter(myfilter)
    }, () => {
      Taro.hideLoading()
      this.setState({
        btnloading: false,
        showRst: true
      })
    })
  }

  hideRst() {
    this.setState({
      currentUserTitle: '',
      showRst: false
    }, () => {
      this.setState({
        rstUser: []
      })
    })
  }

  searchUser() {
    const { keywords } = this.state
    if (!keywords.trim()) {
      Taro.showToast({
        title: '请输入学号或姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.rstFilter(`${keywords}的搜索结果`, u => [u.name, u.stuid].some(e => String(e).includes(keywords)))
  }

  currentUtypeChange(value: number) {
    this.setState({
      currentUtype: value
    })
  }

  currentDepartmentChange(value: number) {
    this.setState({
      currentDepartment: this.departments[value]
    })
  }

  currentPositionChange(value: number) {
    this.setState({
      currentPosition: value
    })
  }

  updateInfo(){
    const {
      currentStuid: stuid,
      currentUtype: utype,
      currentDepartment: department,
      currentPosition: position
    } = this.state
    Promise.all([
      modifyUserInfo({ stuid, value: utype, info: 'utype'}),
      modifyUserInfo({ stuid, value: department!, info: 'department'}),
      modifyUserInfo({ stuid, value: position, info: 'position'})
    ]).then(rs => {
      if (rs.some(e => e.status)) {
        Taro.showToast({
          title: `修改成功`,
          icon: 'success',
          duration: 2000
        })
        this.close()
        this.refreshPage()
      } else {
        Taro.showToast({
          title: '没有修改',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

  getAllUsers() {
    const { token } = LocalData.getItem(LDKey.USER)
    return getAllUsersByToken(token).then(rs => {
      this.setState({
        allUser: rs.resdata.map((e: User) => handelUserInfo(e))
      })
    })
  }

  refreshPage() {
    this.setState(
      {
        loading: true
      },
      () => {
        this.getAllUsers().then(() => {
          this.setState({ loading: false })
          Taro.stopPullDownRefresh()
        }).catch(() => {
          this.setState({ loading: false })
          Taro.stopPullDownRefresh()
        })
      }
    )
  }

  onPullDownRefresh() {
    this.refreshPage()
  }

  genList() {
    const { rstUser } = this.state
    return (
      <AtList>
        {rstUser.length ?
          rstUser.map(e => (
            <AtListItem
              key={e.stuid}
              title={e.name}
              note={e.stuid}
              extraText={`${e.utypeName}`}
              arrow='right'
              thumb={e.fullhead}
              onClick={this.open.bind(this, e)}
            />
          )) : <View className='none'>没有结果</View>
        }
      </AtList>
    )
  }

  genAll() {
    const { showRst, currentUserTitle, keywords } = this.state
    return (
      <View className='useradmin'>
        <View className='logo' style={{backgroundImage: `url(${this.logo})`}}></View>
        <AtSearchBar
          className='search-bar'
          value={keywords}
          onChange={this.keywordsChange.bind(this)}
          placeholder='请输入学号或者姓名搜索'
          onActionClick={this.searchUser.bind(this)}
        />
        <View className='user-menu'>
          {
            this.menu.map((m, i) => (
              <View key={`menu-${i}`} className='user-menu-row'>
                {m.map(menu => (
                  <View
                    key={menu.text}
                    className='user-menu-row-item'
                    onClick={this.rstFilter.bind(this, menu.text, null, menu.filter)}
                  >
                    <AtIcon value='user' size='20' color={menu.color || '#000'}></AtIcon>
                    <Text>{menu.text}</Text>
                  </View>
                ))}
              </View>
            ))
          }
        </View>
        <AtFloatLayout
          isOpened={showRst}
          title={currentUserTitle}
          onClose={this.hideRst.bind(this)}
        >
          {this.genList()}
        </AtFloatLayout>
      </View>
    )
  }

  render () {
    const {
      currentStuid,
      currentHead,
      currentName,
      currentUtype,
      currentDepartment,
      currentPosition,
      loading,
      isOpened
    } = this.state
    return (
      <View className='index'>
        <YGHeader back title='用户管理' background='#1F3BA6' />
        <View className='main yg-background'>
          {loading ? (
            <View className='loading'>
              <View style='display: flex;margin: 0 auto;align-items:center;'>
                <AtIcon value='loading-3' size='25' color='#333' className='span'></AtIcon>
                <View className='at-col ml-10'>加载中...</View>
              </View>
            </View>
          ) : this.genAll()}
          <AtModal isOpened={isOpened} closeOnClickOverlay={false}>
            <AtModalHeader>修改用户信息</AtModalHeader>
            <AtModalContent>
              <View style='display:flex;flex-direction: column;padding: 20px'>
                <View className='line mb-20'>
                  <View className='line-left'>
                    <AtAvatar image={currentHead} size='small'></AtAvatar>
                    <View className='info'>
                      <Text>{currentName}</Text>
                      <Text className='stuid'>{currentStuid}</Text>
                    </View>
                  </View>
                  <View className='line-right'>
                    <Text className='utype'>{this.utypenames[currentUtype]}</Text>
                  </View>
                </View>
                <View className='flex-column'>
                  <Text>所在部门：{currentDepartment}</Text>
                  <AtSlider
                    step={1}
                    value={this.departments.findIndex(e => e === currentDepartment)}
                    max={4}
                    min={0}
                    activeColor='#007ACC'
                    backgroundColor='#BDBDBD'
                    blockColor='#007ACC'
                    blockSize={24}
                    onChange={this.currentDepartmentChange.bind(this)}
                  ></AtSlider>
                </View>
                {
                  [4, 5].includes(currentUtype) ? '' : (
                  <View className='flex-column'>
                    <Text>用户类型：{this.utypenames[currentUtype]}</Text>
                    <AtSlider
                      step={1}
                      value={currentUtype}
                      max={3}
                      min={0}
                      activeColor='#4285F4'
                      backgroundColor='#BDBDBD'
                      blockColor='#4285F4'
                      blockSize={24}
                      onChange={this.currentUtypeChange.bind(this)}
                    ></AtSlider>
                  </View>
                  )
                }
                <View className='flex-column'>
                  <Text>当前职位：{this.positionnames[currentPosition]}</Text>
                  <AtSlider
                    step={1}
                    value={currentPosition}
                    max={7}
                    min={0}
                    activeColor='#16C60C'
                    backgroundColor='#BDBDBD'
                    blockColor='#16C60C'
                    blockSize={24}
                    onChange={this.currentPositionChange.bind(this)}
                  ></AtSlider>
                </View>
              </View>
            </AtModalContent>
            <AtModalAction>
              <Button onClick={this.close.bind(this)}>取消</Button>
              <Button onClick={this.updateInfo.bind(this)}>确定</Button>
            </AtModalAction>
          </AtModal>
        </View>
      </View>
    )
  }
}
