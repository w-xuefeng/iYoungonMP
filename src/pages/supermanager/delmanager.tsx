import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { getAllAdminByToken, modifyUtype } from '@/api'
import { LocalData, LDKey, handelUserInfo } from '@/utils/index'
import YGHeader from '@/components/YGHeader'
import {
  AtAvatar,
  AtIcon,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtList,
  AtListItem,
  AtSlider
} from 'taro-ui'
import { User } from '@/models'
import './index.scss'

export default class DelAdmin extends Component<{}, {
  allAdmin: User[];
  currentStuid: string;
  currentName: string;
  currentUtype: number;
  currentHead?: string;
  isOpened: boolean;
  loading: boolean;
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

  utypenames = [
    '普通用户',
    '实习站员',
    '正式站员',
    '往届站员',
    '管理员'
  ]

  constructor() {
    super(...arguments)
    this.state = {
      allAdmin: [],
      currentStuid: '',
      currentName: '',
      currentUtype: 0,
      currentHead: '',
      isOpened: false,
      loading: true,
    }
  }

  componentDidMount() {
    this.refreshPage()
  }

  close() {
    this.setState({
      isOpened: false
    }, () => {
      this.setState({
        currentStuid: '',
        currentUtype: 0,
        currentName: '',
        currentHead: '',
      })
    })
  }

  open(user: User) {
    this.setState({
      currentStuid: user.stuid,
      currentUtype: user.utype,
      currentName: user.name,
      currentHead: user.fullhead,
    }, () => {
      this.setState({
        isOpened: true,
      })
    })
  }

  currentUtypeChange(value: number) {
    this.setState({
      currentUtype: value
    })
  }

  updateUtype(){
    const { currentStuid: stuid, currentUtype: utype } = this.state
    modifyUtype(stuid, utype).then(rs => {
      if (rs && rs.status) {
        Taro.showToast({
          title: `修改成功`,
          icon: 'success',
          duration: 2000
        })
        this.close()
        this.refreshPage()
      } else {
        Taro.showToast({
          title: '修改失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

  getAllAdmin() {
    const { token } = LocalData.getItem(LDKey.USER)
    return getAllAdminByToken(token).then(rs => {
      this.setState({
        allAdmin: rs.resdata.filter((e: User) => Number(e.utype) !== 5).map((e: User) => handelUserInfo(e))
      })
    })
  }

  refreshPage() {
    this.setState(
      {
        loading: true
      },
      () => {
        this.getAllAdmin().then(() => {
          this.setState({ loading: false })
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

  genAdmin(allAdmin: User[]) {
    return (
      <View>
        <AtList>
        {
          allAdmin.map(e => (
            <AtListItem
              key={e.stuid}
              title={e.name}
              note={e.stuid}
              extraText={e.utypeName}
              arrow='right'
              thumb={e.fullhead}
              onClick={this.open.bind(this, e)}
            />
          ))
        }
        </AtList>
      </View>
    )
  }

  render () {
    const { allAdmin, currentStuid, currentHead, currentName, currentUtype, loading, isOpened } = this.state
    return (
      <View className='index'>
        <YGHeader back title='删除管理员' background='#1F3BA6' />
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
              <View className='curwifi'>
                当前管理员：
              </View>
              {this.genAdmin(allAdmin)}
            </View>
          )}
          <AtModal isOpened={isOpened}>
            <AtModalHeader>删除管理员</AtModalHeader>
            <AtModalContent>
              <View style='display:flex;flex-direction: column;padding: 20px'>
                <View className='line'>
                  <View className='line-left'>
                    <AtAvatar image={currentHead} size='small'></AtAvatar>
                    <View className='info'>
                      <Text>{currentName}</Text>
                      <Text className='stuid'>{currentStuid}</Text>
                    </View>
                  </View>
                  <View className='line-right'>
                    <Text className='utype'>{this.utypenames[currentUtype]}</Text>
                  </View>
                </View>
                <AtSlider
                  step={1}
                  value={currentUtype}
                  max={4}
                  min={0}
                  activeColor='#4285F4'
                  backgroundColor='#BDBDBD'
                  blockColor='#4285F4'
                  blockSize={24}
                  onChange={this.currentUtypeChange.bind(this)}
                ></AtSlider>
              </View>
            </AtModalContent>
            <AtModalAction>
              <Button onClick={this.close.bind(this)}>取消</Button>
              <Button onClick={this.updateUtype.bind(this)}>确定</Button>
            </AtModalAction>
          </AtModal>
        </View>
      </View>
    )
  }
}
