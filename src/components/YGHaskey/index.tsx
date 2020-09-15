import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import YGCardWithTitleTip from '@/components/YGCardWithTitleTip'
import { Haskey } from '@/models';
import { YGURL } from '@/api/url'
import './index.scss'


export interface YGHaskeyPropsType {
  haskey: Haskey[]
}

export default class YGHaskey extends Component<YGHaskeyPropsType> {

  static defaultProps: YGHaskeyPropsType = {
    haskey: []
  }
  constructor(props: YGHaskeyPropsType) {
    super(props)
  }

  callPhone(phoneNumber: string) {
    if (phoneNumber) {
      Taro.makePhoneCall({ phoneNumber })
    } else {
      Taro.showToast({
        title: '该站员尚未绑定电话',
        icon: 'none',
        duration: 2000
      })
    }
  }

  render() {
    const { haskey } = this.props
    return (
      <View className='page'>
        <YGCardWithTitleTip
          icon='lock'
          title={`钥匙\n携带者${haskey && haskey.length ? `\n${haskey.length}人` : ''}`}
          cardWidth='80%'
          tipsStyle={{
            top: '50%',
            right: '0',
            transform: 'translateY(-50%)',
          }}
          tipsInnerStyle={{
            textAlign: 'center'
          }}
          itemStyle={{
            marginTop: '10px',
          }}
          cardStyle={{
            marginTop: '30rpx',
            padding: '30rpx',
            boxShadow:  '1px 1px 1px rgba(0,0,0,0.4)',
            maxHeight: '50vh',
            overflow: 'auto',
            display: 'flex',
            flexWrap: 'wrap'
          }}
          activeItemStyle={{
            transform: 'translateX(-75%)'
          }}
        >
          {
            haskey && haskey.length > 0 ?
              haskey.map((user, i) => (
                <View
                  onClick={() => this.callPhone(user.phone)}
                  className={`line ${
                    i === haskey.length - 1 && haskey.length % 2 !== 0
                    || [1, 2].includes(haskey.length) ? '' : 'border-bottom'
                  }`} key={user.stuid}
                >
                  <View className='line-left'>
                    <AtAvatar image={`${YGURL.asset_url}${user.head}`} size='small'></AtAvatar>
                    <View className='info'>
                      <Text>{user.name}</Text>
                      <Text className='stuid'>{user.phone || '尚未绑定电话'}</Text>
                    </View>
                  </View>
                </View>
              ))
            : <View className='none'>暂无</View>
          }
        </YGCardWithTitleTip>
      </View>
    )
  }
}
