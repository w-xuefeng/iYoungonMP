import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import { YGURL } from '@/api/url'
import { DutyInfo } from '@/models'
import { getDutyInfo } from '@/api'
import './index.scss'

type DutyDownloadState = {
  loading: boolean;
  btnloading: boolean;
  weekClass: string[][][];
}

export default class DutyDownload extends Component<{}, DutyDownloadState> {

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
    navigationBarTitleText: '值班表',
    backgroundColor: '#1F3BA6',
    enablePullDownRefresh: true,
  }

  constructor() {
    super(...arguments)
    this.state = {
      btnloading: false,
      loading: true,
      weekClass: [
        [
          [], [], [], []
        ],
        [
          [], [], [], []
        ],
        [
          [], [], [], []
        ],
        [
          [], [], [], []
        ],
        [
          [], [], [], []
        ],
      ]
    }
  }

  componentWillMount() {
    this.initPage()
  }

  onPullDownRefresh() {
    this.initPage()
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleClass(data: DutyInfo[], $weekClass: string[][][], week: number, i: number, j: number) {
    switch (data[i].class[j]) {
      case 1:
        $weekClass[week][0].push(data[i].name)
        break;
      case 2:
        $weekClass[week][1].push(data[i].name)
        break;
      case 3:
        $weekClass[week][2].push(data[i].name)
        break;
      case 4:
        $weekClass[week][3].push(data[i].name)
        break;
      default: break;
    }
    return $weekClass;
  }

  handleWeekClass(data: DutyInfo[]) {
    let $weekClass: string[][][] = [
      [
        [], [], [], []
      ],
      [
        [], [], [], []
      ],
      [
        [], [], [], []
      ],
      [
        [], [], [], []
      ],
      [
        [], [], [], []
      ],
    ];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].week.length; j++) {
        switch (data[i].week[j]) {
          case 1: //星期一
            $weekClass = this.handleClass(data, $weekClass, 0, i, j)
            break;
          case 2: //星期二
            $weekClass = this.handleClass(data, $weekClass, 1, i, j)
            break;
          case 3: //星期三
            $weekClass = this.handleClass(data, $weekClass, 2, i, j)
            break;
          case 4: //星期四
            $weekClass = this.handleClass(data, $weekClass, 3, i, j)
            break;
          case 5: //星期五
            $weekClass = this.handleClass(data, $weekClass, 4, i, j)
            break;
          default: break;
        }
      }
    }
    return $weekClass;
  }


  handleData(rs: DutyInfo[]) {
    const handle = (resolve: ((data: string[][][]) => void)) => {
      const weekClass = this.handleWeekClass(rs)
      this.setState({ weekClass })
      resolve(weekClass)
    }
    return new Promise(handle)
  }

  initPage() {
    this.setState({ loading: true })
    getDutyInfo().then((rs: DutyInfo[]) => {
      this.handleData(rs).then(() => {
        this.setState({ loading: false })
        Taro.stopPullDownRefresh()
      })
    })
  }

  downLoad() {
    const { btnloading } = this.state
    if (btnloading) return;
    this.setState({ btnloading: true })
    Taro.downloadFile({
      url: YGURL.get_duty_excel,
      success: res => {
        if (res.statusCode === 200) {
          Taro.openDocument({ filePath: res.tempFilePath, showMenu: true })
        }
      },
      complete: _ => {
        this.setState({ btnloading: false })
      }
    })
  }

  genDownBtn() {
    const { btnloading } = this.state
    return (
      <AtButton
        loading={btnloading}
        disabled={btnloading}
        type='primary'
        onClick={this.downLoad.bind(this)}
        full
        className='down-btn'
      >
        {btnloading ? '导出中...' : '导出 Excel'}
      </AtButton>
    )
  }
  genDutyInfo() {
    const week = ['星期一', '星期二', '星期三', '星期四', '星期五' ]
    const classTime = ['第一大节', '第二大节', '第三大节', '第四大节']
    const { weekClass } = this.state
    return (
      <View className='common-list' style={{
          display: 'flex',
          flexWrap: 'nowrap',
          width: '98%',
          margin: '0 auto',
          border: '2px solid #666'
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '15%'
          }}
        >
          <View className='cell-col-1'>
            星期/课节
          </View>
          {
            classTime.map((c, j) => (
              <View
                className='common-list duty-row-1'
                key={`class-xh-${j}`}
              >{c}</View>
            ))
          }
        </View>
        {
          week.map((w, i) => (
            <View key={`week-${i}`} className='duty-col'>
              <View className='common-list duty-col-1'>{w}</View>
              {
                classTime.map((_c, j) => (
                  <View className='common-list cell' key={`class-${j}`}>
                    {weekClass[i][j].join(' ')}
                  </View>
                ))
              }
            </View>
          ))
        }
      </View>
    )
  }

  render() {
    const { loading, weekClass } = this.state
    return (
      <View className='page-duty-down yg-background'>
        {
          loading
            ? (
              <View className='loading'>
                <View style='display: flex;margin: 0 auto;align-items:center;'>
                  <AtIcon value='loading-3' size='25' color='#333' className='span'></AtIcon>
                  <View className='at-col ml-10'>加载中...</View>
                </View>
              </View>
            )
            : (
              <View>
                {
                  weekClass
                    ? (
                      <View>
                        {this.genDutyInfo()}
                        {this.genDownBtn()}
                      </View>
                    )
                    : <View className='none'>请刷新重试...</View>
                }
              </View>
            )
        }
      </View>
    )
  }
}
