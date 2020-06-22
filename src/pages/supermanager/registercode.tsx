import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { getRegisterCode, setRegisterCode } from '@/api'
import YGHeader from '@/components/YGHeader'
import { AtButton, AtIcon, AtInput } from 'taro-ui'
import './index.scss'

export default class RegisterCode extends Component<{}, {
  regCode?: string;
  loading: boolean;
  btnloading: boolean;
}> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationStyle: 'custom',
    navigationBarTextStyle: 'white',
    backgroundColor: '#1F3BA6',
    enablePullDownRefresh: true
  }

  constructor() {
    super(...arguments)
    this.state = {
      regCode: '',
      loading: true,
      btnloading: false
    }
  }

  componentWillMount() {
    this.refreshPage()
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleChangeRegCode(value: string) {
    this.setState({
      regCode: value
    })
    return value
  }

  updateRegisterCode() {
    this.setState({ btnloading: true })
    const { regCode } = this.state
    if (!regCode) {
      Taro.showToast({
        title: '注册码不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    setRegisterCode(regCode).then(rs => {
      if (rs.status) {
        Taro.showToast({
          title: '注册码更新成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        Taro.showToast({
          title: '注册码未修改',
          icon: 'none',
          duration: 2000
        })
      }
      this.setState({ btnloading: false })
    })
  }

  refreshPage() {
    this.setState(
      {
        loading: true
      },
      () => {
        getRegisterCode().then(rs => {
          this.setState({ loading: false, regCode: rs.Rcode })
          Taro.stopPullDownRefresh()
        }).catch(() => {
          this.setState({ loading: false })
          Taro.stopPullDownRefresh()
        })
      }
    )
  }

  onPullDownRefresh() {
    this.refreshPage()
  }

  render() {
    const { loading, btnloading, regCode } = this.state
    return (
      <View className='index'>
        <YGHeader back title='设置站员注册码' background='#1F3BA6' />
        <View className='main yg-background'>
          {loading ? (
            <View className='loading'>
              <View style='display: flex;margin: 0 auto;align-items:center;'>
                <AtIcon value='loading-3' size='25' color='#333' className='span'></AtIcon>
                <View className='at-col ml-10'>加载中...</View>
              </View>
            </View>
          ) : (
              <View>
                <AtInput
                  name='regcode'
                  title='注册码'
                  type='text'
                  placeholder='请输入要设置的注册码'
                  value={regCode}
                  onChange={this.handleChangeRegCode.bind(this)}
                />
                <AtButton
                  type='primary'
                  className='btn'
                  loading={btnloading}
                  disabled={btnloading}
                  onClick={this.updateRegisterCode.bind(this)}
                >
                  更新注册码
              </AtButton>
              </View>
            )}
        </View>
      </View>
    )
  }
}
