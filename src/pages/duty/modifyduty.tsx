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
  AtFloatLayout,
  AtForm,
  AtSwitch
} from 'taro-ui'
import { User, Duty } from '@/models'
import './index.scss'

type UserFilter = {
  k: keyof User,
  v: number | string | number[] | string[]
}

export default class ModifyDuty extends Component<{}, {
  allUser: User[];
  currentStuid: string;
  currentName: string;
  currentHead?: string;
  currentUserTitle: string;
  currentUserDutyCount: number
  currentUserDutyState: 0 | 1;
  currentUserDutyWeek: number[];
  currentUserDutyClass: number[];
  currentUserDutyList?: string[];
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
    ],
    [
      {
        color: '#FFA500',
        text: '正式站员',
        filter: {
          k: 'utype',
          v: [2, 4, 5]
        }
      },
      {
        color: '#4CAF50',
        text: '往届站员',
        filter: {
          k: 'utype',
          v: 3
        }
      },
    ]
  ]

  departments = [
    '天商人',
    '开发部',
    '企划部',
    '信息部',
    '运营部'
  ]

  constructor() {
    super(...arguments)
    this.state = {
      allUser: [],
      currentStuid: '',
      currentName: '',
      currentHead: '',
      currentUserTitle: '',
      currentUserDutyCount: 0,
      currentUserDutyState:0,
      currentUserDutyWeek: [],
      currentUserDutyClass: [],
      currentUserDutyList: [],
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
        currentName: '',
        currentHead: '',
        currentUserDutyCount: 0,
        currentUserDutyState: 0,
        currentUserDutyWeek: [],
        currentUserDutyClass: [],
      })
    })
  }

  open(user: User) {
    const duty: {
      state: 0 | 1,
      week: number[],
      class: number[],
      dutydate?: string[]
    } = JSON.parse(user.duty);
    this.setState({
      currentStuid: user.stuid,
      currentName: user.name,
      currentHead: user.fullhead,
      currentUserDutyCount: duty.week.length,
      currentUserDutyState: duty.state,
      currentUserDutyWeek: duty.week,
      currentUserDutyClass: duty.class,
      currentUserDutyList: duty.dutydate
    }, () => {
      this.setState({ isOpened: true })
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
      this.setState({
        btnloading: false,
        showRst: true
      }, () => {
        Taro.hideLoading()
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

  currentUserDutyCountChange(value: number) {
    this.setState(state => {
      let { currentUserDutyWeek, currentUserDutyClass } = state
      const week: number[] = []
      const classs: number[] = []
      for (let i = 0; i < value; i++) {
        week[i] = currentUserDutyWeek[i] || 1
        classs[i] = currentUserDutyClass[i] || 1
      }
      currentUserDutyWeek = week
      currentUserDutyClass = classs
      return {
        currentUserDutyCount: value,
        currentUserDutyWeek,
        currentUserDutyClass
      }
    })
  }

  handlecurrentUserDutyStateChange(value: boolean) {
    this.setState({
      currentUserDutyState: value ? 1 : 0
    })
  }

  currentUserDutyWeekChange(value: number, index: number) {
    this.setState(state => {
      let { currentUserDutyWeek } = state
      currentUserDutyWeek[index] = value
      return { currentUserDutyWeek }
    })
  }

  currentUserDutyClassChange(value: number, index: number) {
    this.setState(state => {
      let { currentUserDutyClass } = state
      currentUserDutyClass[index] = value
      return { currentUserDutyClass }
    })
  }

  updateInfo(){
    const {
      currentStuid: stuid,
      currentUserDutyState: state,
      currentUserDutyWeek: week,
      currentUserDutyClass: classTime,
      currentUserDutyList: dutydate
    } = this.state
    const value = JSON.stringify(new Duty({ state, week, class: classTime, dutydate }))
    modifyUserInfo({
      stuid,
      value,
      info: 'duty'
    }).then(rs => {
      if (rs.status) {
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
              extraText={`${JSON.parse(e.duty).state === 1 ? '' : '不'}参与值班`}
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

  genDuty() {
    const {
      currentUserDutyWeek,
      currentUserDutyClass,
      currentUserDutyCount
    } = this.state
    return (
      <View>
        <View className='flex-column'>
          <Text>每周值班次数：{currentUserDutyCount}</Text>
          <AtSlider
            step={1}
            value={currentUserDutyCount}
            max={4}
            min={1}
            activeColor='#007ACC'
            backgroundColor='#BDBDBD'
            blockColor='#007ACC'
            blockSize={24}
            onChange={this.currentUserDutyCountChange.bind(this)}
          ></AtSlider>
        </View>
        {
          currentUserDutyWeek.map((week, i) => (
            <View key={`week-class-${i}`} style='background: #eee;margin: 10px 0;padding: 15px;'>
              <View className='flex-column'>
                <Text>星期: {week}</Text>
                <AtSlider
                  step={1}
                  value={Number(week)}
                  max={7}
                  min={1}
                  activeColor='#16C60C'
                  backgroundColor='#BDBDBD'
                  blockColor='#16C60C'
                  blockSize={24}
                  onChange={value => this.currentUserDutyWeekChange(value, i)}
                ></AtSlider>
              </View>
              <View className='flex-column'>
                <Text>课节：{currentUserDutyClass[i]}</Text>
                <AtSlider
                  step={1}
                  value={Number(currentUserDutyClass[i])}
                  max={4}
                  min={1}
                  activeColor='#007ACC'
                  backgroundColor='#BDBDBD'
                  blockColor='#007ACC'
                  blockSize={24}
                  onChange={value => this.currentUserDutyClassChange(value, i)}
                ></AtSlider>
              </View>
            </View>
          ))
        }
    </View>
   )
  }

  render () {
    const {
      currentStuid,
      currentHead,
      currentName,
      loading,
      isOpened,
      currentUserDutyState
    } = this.state
    return (
      <View className='index'>
        <YGHeader back title='安排值班' background='#1F3BA6' />
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
            <AtModalHeader>修改值班信息</AtModalHeader>
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
                    <Text
                      className='utype'
                      style={{
                        color: currentUserDutyState === 1 ? '#16C60C' : '#007ACC'
                      }}
                    >
                      {currentUserDutyState === 1 ? '参与值班': '不参与值班'}
                    </Text>
                  </View>
                </View>
                <View className='flex-column'>
                  <AtForm>
                    <AtSwitch
                      title='是否值班：'
                      border={false}
                      checked={currentUserDutyState === 1}
                      onChange={this.handlecurrentUserDutyStateChange.bind(this)}
                    />
                  </AtForm>
                </View>
                {currentUserDutyState === 1 ? this.genDuty() : undefined}
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
