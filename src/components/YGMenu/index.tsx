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
  utype: number;
}

export default class YGMenu extends Component<YGMenuPropsType> {

  static defaultProps: YGMenuPropsType = {
    menus: [],
    utype: 0
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
        url: e.url,
        iconInfo: {
          value: e.icon
        }
      }
    ))
  }

  handleClick(item: Menu) {
    const { url } = item
    this.gotoSomeWhere(url)
  }

  render () {
    const { menus, utype } = this.props
    return (
      <View className='content'>
        {
          menus.map(menu => (
            menu.auth.includes(utype as never) ? (
              <View key={menu.title}>
                <View className='at-row menugroup-title'>
                  {menu.title}
                </View>
                <View className='at-row'>
                  <AtGrid
                    onClick={this.handleClick.bind(this)}
                    hasBorder={false}
                    data={this.genMenu(menu)}
                  />
                </View>
              </View>
            ) : ''
          ))
        }
      </View>
    )
  }
}
