import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.less'

export interface YGHeaderPropsType {
  title?: string;
  back?: boolean;
}

export interface YGHeaderStateType {
  statusBarHeight: string;
}

export default class YGHeader extends Component<YGHeaderPropsType, YGHeaderStateType> {

  static defaultProps: YGHeaderPropsType = {
    title: 'iYoungon',
    back: false
  }

  constructor(props: YGHeaderPropsType) {
    super(props)
    this.state = {
      statusBarHeight: '60px'
    }
  }

  getStatusBarHeight() {
    const { statusBarHeight } = Taro.getSystemInfoSync()
    this.setState({
      statusBarHeight: `${statusBarHeight + 5}px`
    })
  }
  
  componentWillMount() {
    this.getStatusBarHeight()
  }

  componentDidMount() { }

  componentWillUnmount() { }

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

  render() {
    const { title, back } = this.props
    const { statusBarHeight } = this.state
    return (
      <View className='header' style={{ paddingTop: statusBarHeight}}>
        {
          back ? this.backView() : ''
        }
        <View>{title}</View>
      </View>
    )
  }
}
