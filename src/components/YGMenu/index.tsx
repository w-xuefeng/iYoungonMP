import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.scss'

export interface Menu {
  name: string;
  url: string;
  icon: string;
  data?: any;
}

export interface YGMenuPropsType {
  menus: Menu[];
}

export default class YGMenu extends Component<YGMenuPropsType> {

  static defaultProps: YGMenuPropsType = {
    menus: []
  }

  constructor (props: YGMenuPropsType) {
    super(props)
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  gotoSomeWhere(url: string) {
    Taro.navigateTo({ url })
  }

  render () {
    const { menus } = this.props
    return (
      <View className='content'>
        {
          menus.map(e => (
            <View
              key={e.url}
              className='menu-item'
              hoverClass='menu-item-hover'
              onClick={() => this.gotoSomeWhere(e.url)}
            >
              <View className='menu-item-content'>
                <AtIcon value={e.icon} size='20' color='#3f536e'></AtIcon>
                <Text className='menu-item-name ml-30'>{e.name}</Text>
              </View>
              <AtIcon value='chevron-right' size='14' color='#3f536e'></AtIcon>
            </View>
          ))
        }
      </View>
    )
  }
}
