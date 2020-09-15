import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtIcon } from 'taro-ui'
import { signDetailPagePath } from '@/utils'
import YGCardWithTitleTip from '@/components/YGCardWithTitleTip'
import { Online } from '@/models';
import { YGURL } from '@/api/url'
import './index.scss'


export interface YGCurrentOnlinePropsType {
  currentOnline: Online[]
}

export default class YGCurrentOnline extends Component<YGCurrentOnlinePropsType> {

  static defaultProps: YGCurrentOnlinePropsType = {
    currentOnline: []
  }
  constructor(props: YGCurrentOnlinePropsType) {
    super(props)
  }

  gotoSignDetail(detail: Online) {
    this.$preload(detail)
    Taro.navigateTo({ url: signDetailPagePath })
  }

  render() {
    const { currentOnline } = this.props
    return (
      <View className='page'>
        <YGCardWithTitleTip
          icon='user'
          title={`当前在站${currentOnline && currentOnline.length ? ` ${currentOnline.length}人` : ''}`}
          cardWidth='80%'
          tipsStyle={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
          itemStyle={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'center'
          }}
          activeItemStyle={{
            transform: 'rotate(-90deg) translateY(55vw)'
          }}
          cardStyle={{
            marginTop: '30rpx',
            padding: '30rpx',
            boxShadow:  '1px 1px 1px rgba(0,0,0,0.4)',
            maxHeight: '50vh',
            overflow: 'auto'
          }}
        >
          {
            currentOnline && currentOnline.length > 0 ?
              currentOnline.map((user, i) => (
                <View className={`line ${
                  i === currentOnline.length - 1 || currentOnline.length === 1 ? '' : 'border-bottom'
                }`} key={user.stuid}
                  onClick={this.gotoSignDetail.bind(this, user)}
                >
                  <View className='line-left'>
                    <AtAvatar image={`${YGURL.asset_url}${user.head}`} size='small'></AtAvatar>
                    <View className='info'>
                      <Text>{user.name}</Text>
                      <Text className='stuid'>{user.stuid}</Text>
                    </View>
                  </View>
                  <View className='line-right'>
                    <Text className='reason'>{user.reason}</Text>
                    <AtIcon value='chevron-right' size='20' color='#999'></AtIcon>
                  </View>
                </View>
              ))
            : <View className='none'>暂无在站人员</View>
          }
        </YGCardWithTitleTip>
      </View>
    )
  }
}
