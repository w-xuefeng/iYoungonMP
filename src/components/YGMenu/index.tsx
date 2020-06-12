import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtGrid } from 'taro-ui'
import { AtGridItem } from 'taro-ui/types/grid'
import './index.scss'

export interface Menu {
  name: string;
  url: string;
  icon: string;
  data?: any;
}

export interface MenuGroup {
  title: string;
  auth: string[] | number[];
  menus: Menu[];
}

export interface YGMenuPropsType {
  menus: MenuGroup[];
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

  genMenu(menugroup: MenuGroup): AtGridItem[] {
    const { menus } = menugroup
    return menus.map(e => (
      {
        value: e.name,
        iconInfo: {
          value: e.icon
        }
      }
    ))
  }

  render () {
    const { menus } = this.props
    return (
      <View className='content'>
        {
          menus.map(menu => (
            <View key={menu.title}>
              <View className='at-row menugroup-title'>
                {menu.title}
              </View>
              <View className='at-row'>
                <AtGrid
                  hasBorder={false}
                  data={this.genMenu(menu)}
                />
              </View>
            </View>
          ))
        }
      </View>
    )
  }
}
