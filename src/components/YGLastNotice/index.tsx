import Taro, { Component } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import YGCardWithTitleTip from '@/components/YGCardWithTitleTip'
import { Notice } from '@/models';
import './index.scss'


export interface YGLastNoticePropsType {
  notice: Notice
}

export default class YGLastNotice extends Component<YGLastNoticePropsType> {

  constructor(props:YGLastNoticePropsType) {
    super(props)
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { notice } = this.props
    return (
      <View className='page'>
        <YGCardWithTitleTip
          icon='alert-circle'
          title='最新公告'
          cardWidth='80%'
          cardStyle={{
            marginTop: '60rpx'
          }}
          itemStyle={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <RichText nodes={notice.content} space='nbsp'></RichText>
        <View className='footer'>
          {notice.publisher} 于 {notice.publishtime} 发布
        </View>
        </YGCardWithTitleTip>
      </View>
    )
  }
}
