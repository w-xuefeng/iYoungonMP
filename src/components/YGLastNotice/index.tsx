import Taro, { Component } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import YGCardWithTitleTip from '@/components/YGCardWithTitleTip'
import { getLastNotice } from '@/api'
import { Notice } from '@/models';
import './index.scss'


export interface YGLastNoticeStateType {
  notice: Notice
}

export default class YGLastNotice extends Component<any, YGLastNoticeStateType> {

  constructor() {
    super(...arguments)
    this.state = {
      notice: {
        nid: 0,
        opstuid: '',
        publishtime: '',
        content: '',
        publisher: ''
      }
    }
  }

  componentWillMount() { }

  componentDidMount() {
    this.getLastNotices()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  getLastNotices() {
    getLastNotice().then(rs => {
      this.setState({ notice: rs})
    })
  }

  render() {
    const { notice } = this.state
    return (
      <View className='page'>
        <YGCardWithTitleTip icon='alert-circle' title='最新公告'>
          <RichText nodes={notice.content}></RichText>
        </YGCardWithTitleTip>
      </View>
    )
  }
}
