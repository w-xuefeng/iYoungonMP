import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import { YGURL } from '@/api/url'
import { DutyInfo } from '@/models'
import { getDutyInfo } from '@/api'
import './index.scss'

type DutyDownloadState = {
  loading: boolean;
  btnloading: boolean;
  weekClass: string[][][];
  filePath: string;
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
      filePath: '',
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


  onPullDownRefresh() {
    this.initPage()
  }

  componentDidMount() {
    this.initPage()
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
        if (
          [1, 2, 3, 4, 5].includes(data[i].week[j])
          && [1, 2, 3, 4].includes(data[i].class[j])
        ) {
          const weekIndex = data[i].week[j] - 1
          const classIndex = data[i].class[j] - 1
          $weekClass[weekIndex][classIndex].push(data[i].name)
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
          this.setState({ filePath: res.tempFilePath })
          this.openFile(res.tempFilePath)
        }
      },
      fail: _ => {
        Taro.showToast({
          title: '网络请求错误',
          icon: 'none'
        })
        this.setState({ btnloading: false })
      }
    })
  }

  openFile(path: string) {
    if (!path) return
    Taro.openDocument({
      filePath: path,
      fileType: 'xlsx',
      showMenu: true,
      complete: _ => {
        this.setState({ btnloading: false })
      },
      fail: _ => {
        Taro.showToast({
          title: '文件打开失败',
          icon: 'none'
        })
      }
    })
  }

  genDownBtn() {
    const { btnloading, filePath } = this.state
    return (
      <View className='down-btn-wrap'>
        <View style='width: 100%;'>
          <AtButton
            loading={btnloading}
            disabled={btnloading}
            type='primary'
            onClick={this.downLoad.bind(this)}
            className='down-btn'
            full
          >
            {btnloading ? '导出中...' : '导出 Excel'}
          </AtButton>
        </View>
        <Text
          onClick={this.openFile.bind(this, filePath)}
          className='down-btn-text'
        >
          {filePath ? `文件已保存到 ${filePath}` : ''}
        </Text>
      </View>
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
