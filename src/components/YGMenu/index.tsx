import Taro, { Component } from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import { AtAvatar, AtIcon } from 'taro-ui'
import QQlevel from 'qqlevel';
import './index.scss'

export interface Menu {
  name: string;
  url: string;
  icon: string;
  data?: any;
}

export interface HeaderInfo {
  fullhead: string;
  name: string;
  utype: string;
  ulevel: number;
}

export interface YGMenuPropsType {
  menus: Menu[];
  headerInfor: HeaderInfo;
}

export default class YGMenu extends Component<YGMenuPropsType> {

  static defaultProps: YGMenuPropsType = {
    menus: [],
    headerInfor: {
      fullhead: 'https://api.wangxuefeng.com.cn/static/assets/default/defaulthead.jpg',
      name: '小可爱',
      utype: '正式站员',
      ulevel: 0,
    }
  }

  constructor (props: YGMenuPropsType) {
    super(props)
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  gotoSomeWhere(url: string) {
    Taro.navigateTo({ url })
  }

  initUlevel(mylevel?: number): QQlevel {
    const level = new QQlevel(mylevel)
    const icon = {
      crown: 'https://w-xuefeng.github.io/QQlevel/src/assets/crown.svg',
      sun: 'https://w-xuefeng.github.io/QQlevel/src/assets/sun.svg',
      moon: 'https://w-xuefeng.github.io/QQlevel/src/assets/moon.svg',
      star: 'https://w-xuefeng.github.io/QQlevel/src/assets/star.svg',
    }
    level.setIcon(icon)
    return level
  }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { menus, headerInfor } = this.props
    const { fullhead, name, ulevel} = headerInfor
    const level = this.initUlevel(ulevel)
    return (
      <View className='page'>
        <View className='header'>
          <View className='cover'>
            <View className='header-content'>
              <View className='headimg'>
                <AtAvatar circle image={fullhead}></AtAvatar>
              </View>
              <View className='header-info ml-20'>
                <View className='name-level'>
                  <Text>{name}</Text>
                  <View className='level-btn ml-20'>
                    YGLV {ulevel}
                  </View>
                </View>
                {
                  ulevel === 0 ? '' : <RichText nodes={level.outputLevelHTML()}></RichText>
                }
              </View>            
            </View>          
          </View>            
        </View>
        <View className='content'>
          {
            menus.map((e, i) => (
              <View
                key={i.toString()}
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
      </View>
    )
  }
}
