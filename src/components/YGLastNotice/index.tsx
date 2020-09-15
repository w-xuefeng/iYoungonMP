import Taro, { Component } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import YGCardWithTitleTip from '@/components/YGCardWithTitleTip'
import { Notice } from '@/models';
import './index.scss'


export interface YGLastNoticePropsType {
  notice: Notice
}

export default class YGLastNotice extends Component<YGLastNoticePropsType> {

  static defaultProps: YGLastNoticePropsType = {
    notice: {
      nid: -1,
      opstuid: '',
      publishtime: '',
      content: '',
      publisher: ''
    }
  }

  constructor(props:YGLastNoticePropsType) {
    super(props)
  }

  render() {
    const { notice } = this.props
    return (
      <View className='page'>
        {
          notice.content ?
          (
            <YGCardWithTitleTip
              icon='alert-circle'
              title='最新公告'
              cardWidth='80%'
              cardStyle={{
                marginTop: '60rpx',
                boxShadow:  '1px 1px 1px rgba(0,0,0,0.4)',
              }}
              itemStyle={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
              activeItemStyle={{
                transform: 'rotate(90deg) translate(38%, 52vw)'
              }}
            >
              <RichText nodes={notice.content} space='nbsp'></RichText>
              <View className='footer'>
                {notice.publisher} 于 {notice.publishtime} 发布
              </View>
            </YGCardWithTitleTip>
          ) : ''
        }
      </View>
    )
  }
}
