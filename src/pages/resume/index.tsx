import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Resume } from '@/models'
// import {
//   AtAvatar,
//   AtTabs,
//   AtIcon
// } from 'taro-ui'
import { LocalData, LDKey } from '@/utils/index'
// import { getApplyByStuid } from '@/api'
import './index.scss'


export default class MyResume extends Component<{}, { resume: Resume | null, state: 'preview' | 'edit'; }> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationStyle: 'default',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#1F3BA6',
    navigationBarTitleText: '我的简历',
    backgroundColor: '#1F3BA6'
  }

  constructor() {
    super(...arguments)
    this.state = {
      resume: JSON.parse(LocalData.getItem(LDKey.USER).interviewform),
      state: 'preview'
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { resume, state } = this.state
    if (!resume || state === 'edit') {
      return (
        <View className='page-resume yg-background'>

        </View>
      )
    }

    return (
      <View className='page-resume yg-background'>
        {resume.stuid}
        {resume.name}
      </View>
    )
  }
}
