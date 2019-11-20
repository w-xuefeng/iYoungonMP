import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtInput, AtButton } from 'taro-ui'
import { regAccount } from '@/api'
import { LocalData, LDKey, notEmpty, gotoIndex } from '@/utils/index'
import './index.scss'

export interface YGRegisterStateType {
  stuid: string | number
  name: string
  password: string
  repassword: string
  email: string
  utype: string | number
  vcode: string
  utypeSelector: {
    label: string
    value: number
  }[]
  utypeSelected: {
    label: string
    value: number
  }
  isloading: boolean
}

export default class YGRegister extends Component<any, YGRegisterStateType> {

  constructor() {
    super(...arguments)
    this.state = {
      stuid: '',
      name: '',
      password: '',
      repassword: '',
      email: '',
      utype: '0',
      vcode: '',
      utypeSelector: [
        {
          label: '普通用户',
          value: 0
        },
        {
          label: '实习站员',
          value: 1
        },
        {
          label: '正式站员',
          value: 2
        },
        {
          label: '往届站员',
          value: 3
        }
      ],
      utypeSelected: {
        label: '请选择',
        value: 0
      },
      isloading: false
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleChangeStuid(value: any) {
    this.setState({
      stuid: value
    })
    return value
  }

  handleChangeName(value: any) {
    this.setState({
      name: value
    })
    return value
  }

  handleChangePassword(value: any) {
    this.setState({
      password: value
    })
    return value
  }

  handleChangeRepassword(value: any) {
    this.setState({
      repassword: value
    })
    return value
  }

  handleChangeEmail(value: any) {
    this.setState({
      email: value
    })
    return value
  }

  handleChangeUtype = e => {
    this.setState({
      utypeSelected: this.state.utypeSelector[e.detail.value],
      utype: this.state.utypeSelector[e.detail.value].value
    })
  }

  handleChangeVcode(value: any) {
    this.setState({
      vcode: value
    })
    return value
  }

  regAccount() {
    if (notEmpty([
      {
        key: '学号',
        value: this.state.stuid
      },
      {
        key: '姓名',
        value: this.state.name
      },
      {
        key: '密码',
        value: this.state.password
      },
      {
        key: '邮箱',
        value: this.state.email
      },
      {
        key: '用户类型',
        value: this.state.utype
      }
    ])) {
      if (this.state.password !== this.state.repassword) {
        Taro.showToast({
          title: `两次密码不相同`,
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (!/[a-zA-Z0-9_-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/.test(this.state.email)) {
        Taro.showToast({
          title: `邮箱不合法`,
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.setState({ isloading: true })
      const wxid = LocalData.getItem(LDKey.OPENID)
      regAccount({
        stuid: this.state.stuid,
        password: this.state.password,
        name: this.state.name,
        email: this.state.email,
        utype: this.state.utype,
        wxid
      }).then(rs => {
        this.setState({ isloading: false })
        if (rs && rs.status) {
          Taro.showToast({
            title: `注册成功`,
            icon: 'success',
            duration: 2000
          })
          LocalData.setItem(LDKey.USER, rs.resdata)
          LocalData.setItem(LDKey.TIMESTAMP, new Date().getTime())
          gotoIndex()
        }
      })
    }
  }
  render() {
    return (
      <View className='register'>
        <AtInput
          name='stuid'
          title='学号'
          type='number'
          placeholder='请输入学号'
          value={this.state.stuid}
          maxLength={8}
          onChange={this.handleChangeStuid.bind(this)}
        />
        <AtInput
          name='name'
          title='姓名'
          type='text'
          placeholder='请输入姓名'
          value={this.state.name}
          onChange={this.handleChangeName.bind(this)}
        />
        <AtInput
          name='email'
          title='邮箱'
          type='email'
          placeholder='请输入邮箱'
          value={this.state.email}
          onChange={this.handleChangeEmail.bind(this)}
        />
        <AtInput
          name='password'
          title='密码'
          type='password'
          placeholder='请输入密码'
          value={this.state.password}
          maxLength={16}
          onChange={this.handleChangePassword.bind(this)}
        />
        <AtInput
          name='repassword'
          title='重复密码'
          type='password'
          placeholder='请重复输入密码'
          value={this.state.repassword}
          maxLength={16}
          onChange={this.handleChangeRepassword.bind(this)}
        />
        <View className="utype-picker">
          <Picker
            mode='selector'
            range={this.state.utypeSelector}
            rangeKey='label'
            value={0}
            onChange={this.handleChangeUtype}
          >
            <View className='picker'>
              用户类型：{this.state.utypeSelected.label}
            </View>
          </Picker>
        </View>
        <AtButton
          type='primary'
          size='small'
          loading={this.state.isloading}
          disabled={this.state.isloading}
          onClick={this.regAccount.bind(this)}
        >
          确定注册
        </AtButton>
      </View>
    )
  }
}
