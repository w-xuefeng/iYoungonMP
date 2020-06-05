import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtIcon, AtTabs, AtTabsPane  } from 'taro-ui'
import YGCardWithTitleTip from '@/components/YGCardWithTitleTip'
import { SignRecord } from '@/models';
import { YGURL } from '@/api/url'
import './index.scss'


export interface YGSignRecordPropsType {
  thisweek: SignRecord[];
  lastweek: SignRecord[];
}

interface YGSignRecordStateType {
  currentTabs: number
}

export default class YGSignRecord extends Component<YGSignRecordPropsType, YGSignRecordStateType> {

  static defaultProps: YGSignRecordPropsType = {
    thisweek: [],
    lastweek: []
  }
  constructor(props: YGSignRecordPropsType) {
    super(props)
    this.state = {
      currentTabs: 0,
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleClick(value) {
    this.setState({
      currentTabs: value
    })
  }

  generateRecored(week: SignRecord[]) {
    return (
      <View>
        {
          week && week.length > 0 ?
            week.map((user, i) => (
              <View className={`line ${
                  i === week.length - 1 || week.length === 1 ? '' : 'border-bottom'
                }`} key={user.stuid}
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
            )
          )
          : <View className='none'>暂无签到记录</View>
        }
      </View>
    )
  }

  render() {
    const { thisweek, lastweek } = this.props
    const tabList = [{ title: '本周记录' }, { title: '上周记录' } ]
    return (
      <View className='page'>
        <YGCardWithTitleTip
          icon='edit'
          title='签到记录'
          cardWidth='80%'
          iconStyle={{
            margin: '15px 0'
          }}
          tipsStyle={{
            left: '5%',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
          tipsInnerStyle={{
            flexDirection: 'column',
            width: '10px'
          }}
          itemStyle={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          cardStyle={{
            marginTop: '30rpx',
            padding: '30rpx',
            maxHeight: '50vh',
            overflow: 'auto'
          }}
        >
        <AtTabs
          current={this.state.currentTabs}
          tabList={tabList}
          onClick={this.handleClick.bind(this)}
        >
          <AtTabsPane current={this.state.currentTabs} index={0} >
            {this.generateRecored(thisweek)}
          </AtTabsPane>
          <AtTabsPane current={this.state.currentTabs} index={1}>
            {this.generateRecored(lastweek)}
          </AtTabsPane>
        </AtTabs>
        </YGCardWithTitleTip>
      </View>
    )
  }
}
