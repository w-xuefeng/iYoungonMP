import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtInput, AtButton  } from 'taro-ui'
import { bindAccount } from '@/api'
import { LocalData, LDKey, notEmpty, gotoIndex, handelUserInfo } from '@/utils/index';
import './index.scss'

export interface YGBindAccountStateType {
  stuid: string
  password: string
  isloading: boolean
}

export default class YGBindAccount extends Component<any, YGBindAccountStateType> {

  constructor() {
    super(...arguments)
    this.state = {
      stuid: '',
      password: '',
      isloading: false
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleChangeStuid(value: any) {
    this.setState({
      stuid: value
    })
    return value
  }

  handleChangePassword(value: any) {
    this.setState({
      password: value
    })
    return value
  }

  bindAccount() {
    const { stuid, password } = this.state
    if (notEmpty([
      {
        key: '学号',
        value: stuid
      },
      {
        key: '密码',
        value: password
      }
    ])) {
      this.setState({ isloading: true })
      const wxid = LocalData.getItem(LDKey.OPENID)
      bindAccount({ stuid, password, wxid }).then(rs => {
        this.setState({ isloading: false })
        if (rs && rs.status) {
          Taro.showToast({
            title: `绑定成功`,
            icon: 'success',
            duration: 2000
          })
          LocalData.setItem(LDKey.USER, handelUserInfo(rs.resdata))
          LocalData.setItem(LDKey.TIMESTAMP, new Date().getTime())
          gotoIndex()
        }
      })
    }
  }
  render () {
    const { stuid, password, isloading } = this.state
    return (
      <View className='page'>
        <AtInput
          name='stuid'
          title='学号'
          type='number'
          placeholder='请输入学号'
          value={stuid}
          maxLength={8}
          onChange={this.handleChangeStuid.bind(this)}
        />
        <AtInput
          name='password'
          title='密码'
          type='password'
          placeholder='请输入密码'
          value={password}
          maxLength={16}
          onChange={this.handleChangePassword.bind(this)}
        />
        <AtButton
          type='primary'
          size='small'
          loading={isloading}
          disabled={isloading}
          onClick={this.bindAccount.bind(this)}
        >
          确定
        </AtButton>
      </View>
    )
  }
}
