import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { LocalData, LDKey } from '@/utils/index'
import './index.scss'

export interface YGHeaderPropsType {
  title?: string;
  back?: boolean;
  index?: boolean;
}

export interface YGHeaderStateType {
  statusBarHeight: string;
}

export default class YGHeader extends Component<YGHeaderPropsType, YGHeaderStateType> {

  static defaultProps: YGHeaderPropsType = {
    title: '阳光网站',
    back: false,
    index: false
  }

  constructor(props: YGHeaderPropsType) {
    super(props)
    this.state = {
      statusBarHeight: '60px'
    }
  }

  componentWillMount() {
    this.getStatusBarHeight()
  }

  componentDidMount() { }

  componentWillUnmount() { }

  getStatusBarHeight() {
    const { statusBarHeight, screenHeight, screenWidth } = Taro.getSystemInfoSync()
    LocalData.setItem(LDKey.SCREEN, { screenHeight, screenWidth })
    this.setState({
      statusBarHeight: `${statusBarHeight + 5}px`
    })
  }

  componentDidShow() { }

  componentDidHide() { }

  backOrClosePage() {
    Taro.navigateBack().catch(() => {
      Taro.showToast({
        title: '不能再返回了',
        icon: 'none',
        duration: 2000
      })
    })
  }

  openMenuPage = () => {
    Taro.switchTab({
      url: '/pages/menus/index'
    })
  }

  backView() {
    return (
      <View
        className='back'
        onClick={this.backOrClosePage.bind(this)}
      >
        <AtIcon value='chevron-left' size='24' color='#FFF'></AtIcon>
      </View>
    )
  }

  indexHeaderTitleView(title?: string) {
    return (
      <View className='index-header-title'>
        <View className='index-header-title-left-wrap'>
          <View className='index-head-title-left'>
            <View className='index-head-title-left-top'></View>
            <View className='index-head-title-left-bottom'></View>
          </View>
          <View className='index-head-title-left-rectangle'>
          </View>
        </View>
        <View>{title}</View>
        <View className='index-header-title-right-wrap'>
          <View className='index-head-title-right-rectangle'>
          </View>
          <View className='index-head-title-right'>
            <View className='index-head-title-right-top'></View>
            <View className='index-head-title-right-bottom'></View>
          </View>
        </View>
      </View>
    )
  }

  indexHeaderView() {
    const { title } = this.props
    const { statusBarHeight } = this.state
    const { fullhead } = LocalData.getItem(LDKey.USER)
    return (
      <View className='index-header' style={{ paddingTop: statusBarHeight }}>
        <View className='headimg' style={{ backgroundImage: `url(${fullhead})` }} onClick={this.openMenuPage}></View>
        <View className='index-header-title-wrap'>
          {this.indexHeaderTitleView(title)}
        </View>
      </View>
    )
  }

  commonHeaderView() {
    const { title, back } = this.props
    const { statusBarHeight } = this.state
    return (
      <View className='header' style={{ paddingTop: statusBarHeight }}>
        {
          back ? this.backView() : ''
        }
        <View>{title}</View>
      </View>
    )
  }

  render() {
    const { index } = this.props
    return (
      <View>
        {index ? this.indexHeaderView() : this.commonHeaderView()}
      </View>
    )
  }
}
