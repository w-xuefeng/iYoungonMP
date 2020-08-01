import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { getUserByToken, modifyUtype } from '@/api'
import YGHeader from '@/components/YGHeader'
import { AtButton, AtInput, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import { LocalData, LDKey } from '@/utils/index'
import './index.scss'

export default class AddAdmin extends Component<{}, {
  isOpened: boolean;
  name: string;
  stuid: string;
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
    backgroundColor: '#1F3BA6'
  }

  constructor() {
    super(...arguments)
    this.state = {
      stuid: '',
      name: '',
      isOpened: false,
      btnloading: false
    }
  }

  handleChangeStuid(value: string) {
    this.setState({
      stuid: value
    })
    return value
  }

  close() {
    this.setState({
      isOpened: false,
      btnloading: false,
      name: '',
      stuid: '',
    })
  }

  open() {
    this.setState({
      isOpened: true
    })
  }

  isNotAdmin() {
    const { stuid } = this.state
    if (!stuid.trim()) {
      Taro.showToast({
        title: '学号不能为空',
        icon: 'none',
        duration: 2000
      })
      return Promise.resolve(false)
    }
    const { token } = LocalData.getItem(LDKey.USER)
    return getUserByToken(stuid, token).then(rs => {
      if (rs && rs.status) {
        if([4, 5].includes(rs.resdata.utype)){
          Taro.showToast({
            title: `学号为${stuid}的站员已经是管理员`,
            icon: 'none',
            duration: 2000
          })
          this.setState({ stuid: '' })
          return false
        }
        return rs.resdata
      }
      return false
    })
  }

  setAdmin() {
    this.setState({ btnloading: true })
    this.isNotAdmin().then(rs => {
      if (!rs) {
        this.setState({ btnloading: false })
        return
      }
      this.setState({ name: rs.name }, () => this.open())
    })
  }

  updateUtype(){
    modifyUtype(this.state.stuid, 4).then(rs => {
      if (rs && rs.status) {
        Taro.showToast({
          title: `设置成功`,
          icon: 'success',
          duration: 2000
        })
      } else {
        Taro.showToast({
          title: '设置失败',
          icon: 'none',
          duration: 2000
        })
      }
      this.close()
    })
  }


  render() {
    const { btnloading, stuid, name, isOpened } = this.state
    return (
      <View className='index'>
        <YGHeader back title='设置管理员' background='#1F3BA6' />
        <View className='main yg-background'>
          <View>
            <AtInput
              name='stuid'
              title='学号'
              type='text'
              placeholder='请输入站员学号'
              value={stuid}
              onChange={this.handleChangeStuid.bind(this)}
            />
            <AtButton
              type='primary'
              className='btn'
              loading={btnloading}
              disabled={btnloading}
              onClick={this.setAdmin.bind(this)}
            >
              设置为管理员
            </AtButton>
            <AtModal isOpened={isOpened}>
              <AtModalHeader>设置管理员</AtModalHeader>
              <AtModalContent>
                <View style='display:flex;flex-direction: column;padding: 20px'>
                  <Text>确定要将</Text>
                  <View style='display:flex;flex-direction: column;'>
                    <View style='display:flex;'> 学号：<Text style='color:skyblue'>{stuid}</Text></View>
                    <View style='display:flex;'> 姓名：<Text style='color:skyblue'>{name}</Text></View>
                  </View>
                  <Text>设为管理员吗?</Text>
                </View>
              </AtModalContent>
              <AtModalAction>
                <Button onClick={this.close.bind(this)}>取消</Button>
                <Button onClick={this.updateUtype.bind(this)}>确定</Button>
              </AtModalAction>
            </AtModal>
          </View>
        </View>
      </View>
    )
  }
}
