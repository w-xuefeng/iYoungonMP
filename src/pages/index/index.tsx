import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { LocalData, LDKey, accountPagePath } from '@/utils/index'
import { Notice, Online, Haskey, SignRecord } from '@/models'
import { getCurrentOnline, getLastNotice, getHaskey, getThisWeekSR, getLastWeekSR } from '@/api'
import YGHeader from '@/components/YGHeader'
import YGLastNotice from '@/components/YGLastNotice'
import YGCurrentOnline from '@/components/YGCurrentOnline'
import YGHaskey from '@/components/YGHaskey'
import YGSignRecord from '@/components/YGSignRecord'
import './index.scss'


interface IndexPageStateType {
  notice: Notice,
  currentOnline: Online[],
  haskey: Haskey[],
  thisweek: SignRecord[],
  lastweek: SignRecord[]
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
      currentOnline: [],
      haskey: [],
      thisweek: [],
      lastweek: [],
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
    return getLastNotice().then((rs: Notice) => {
      this.setState({ notice: rs})
    })
  }

  getHaskey() {
    return getHaskey().then((rs: { status: boolean; resdata: Haskey[] | null }) => {
      this.setState({ haskey: rs.resdata || [] })
    })
  }

  getThisWeekSR() {
    getThisWeekSR().then((rs: SignRecord[]) => {
      this.setState({ thisweek: rs})
    })
  }

  getLastWeekSR() {
    getLastWeekSR().then((rs: SignRecord[]) => {
      this.setState({ lastweek: rs})
    })
  }

  refreshPage() {
    Promise.all([
      this.getCurrentOnline(),
      this.getLastNotices(),
      this.getHaskey(),
      this.getThisWeekSR(),
      this.getLastWeekSR()
    ]).then(() => Taro.stopPullDownRefresh())
  }

  onPullDownRefresh() {
    this.refreshPage()
  }

  render () {
    const { notice, currentOnline, haskey, thisweek, lastweek } = this.state
    return (
      <View className='index'>
        <YGHeader index />
        <View className='main'>
          <YGLastNotice notice={notice} />
          <YGCurrentOnline currentOnline={currentOnline} />
          <YGHaskey haskey={haskey} />
          <YGSignRecord thisweek={thisweek} lastweek={lastweek} />
        </View>
      </View>
    )
  }
}
