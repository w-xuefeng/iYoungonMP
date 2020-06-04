import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { LocalData, LDKey, accountPagePath } from '@/utils/index'
import { Notice, User, Online } from '@/models'
import { getCurrentOnline, getLastNotice } from '@/api'
import YGHeader from '@/components/YGHeader'
import YGLastNotice from '@/components/YGLastNotice'
import YGCurrentOnline from '@/components/YGCurrentOnline'
import './index.scss'


interface IndexPageStateType {
  user: User,
  notice: Notice,
  currentOnline: Online[]
}
export default class Index extends Component<{}, IndexPageStateType> {

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

  openMenuPage = () => {
    Taro.navigateTo({
      url: '/pages/menus/index'
    })
  }

  constructor() {
    super(...arguments)
    this.state = {
      user: new User,
      currentOnline: [],
      notice: {
        nid: 0,
        opstuid: '',
        publishtime: '',
        content: '',
        publisher: ''
      }
    }
  }

  componentWillMount () {
    const user = LocalData.getItem(LDKey.USER)
    if (user) {
      this.setState({ user })
      this.refreshPage()
    } else {
      Taro.redirectTo({
        url: accountPagePath
      })
    }
  }

  componentDidMount () {}

  componentWillUnmount () {}

  componentDidShow () { }

  componentDidHide () {}

  getCurrentOnline() {
    return getCurrentOnline().then((rs: { status: boolean; resdata: Online[] | null }) => {
      this.setState({ currentOnline: rs.resdata || [] })
    })
  }

  getLastNotices() {
    return getLastNotice().then(rs => {
      this.setState({ notice: rs})
    })
  }

  refreshPage() {
    Promise.all([
      this.getCurrentOnline(),
      this.getLastNotices()
    ]).then(() => Taro.stopPullDownRefresh())
  }

  onPullDownRefresh() {
    this.refreshPage()
  }

  render () {
    const { user, notice, currentOnline } = this.state
    return (
      <View className='index'>
        <YGHeader index />
        <View className='main'>
          <YGLastNotice notice={notice} />
          <YGCurrentOnline currentOnline={currentOnline} />
          <View> {user.stuid} </View>
        </View>
      </View>
    )
  }
}
