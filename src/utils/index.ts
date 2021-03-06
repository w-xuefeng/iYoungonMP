import Taro from '@tarojs/taro'
import { User } from '@/models'
import { YGURL } from '@/api/url'

/**
 * 本地数据存储生命周期 单位毫秒
 */
export const TTL = 1000 * 60 * 60 * 24 * 2 * 3

/**
 * 本地存储数据的key
*/
export class LDKey {

  /**
   * 本地存储数据 openid 的 key
  */
  static OPENID = '-_-'

  static TIMESTAMP = '-T-'

  /**
   * 本地存储数据 用户信息 的 key
  */
  static USER = '-U-'

  /**
   * 本地存储数据 用户是否在站 的 key
  */
  static ONLINE = '-OL-'

  /**
   * 本地存储数据 设备屏幕大小 的 key
  */
  static SCREEN = '-screen-'
}

/**
 * 本地数据存储
 * */
export class LocalData {
  /**
   * 获取本地存储的数据
   * */
  static getItem(key: string) {
    return Taro.getStorageSync(key)
  }

  /**
   * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容
   * */
  static setItem(key: string, data: any) {
    return Taro.setStorageSync(key, data)
  }

  /**
   * 从本地缓存中同步移除指定 key
   * */
  static removeItem(key: string) {
    return Taro.removeStorageSync(key)
  }

  /**
   * 同步清理本地数据缓存
   * */
  static clear() {
    return Taro.clearStorageSync()
  }
}

/**
 * 本地数据是否过期
 */
export const isDataTimeOut = () => {
  const localTimeStamp = LocalData.getItem(LDKey.TIMESTAMP)
  if (localTimeStamp) {
    const nowTime = new Date().getTime()
    const saveTimeStamp = Number(localTimeStamp)
    return nowTime - saveTimeStamp > TTL
  }
  return true
}

/**
 * 首页地址
 */
export const indexPagePath = '/pages/index/index'

/**
 * 账号设置页面地址
 */
export const accountPagePath = '/pages/account/index'

/**
 * 签到详情页面地址
 */
export const signDetailPagePath = '/pages/signdetail/index'

/**
 * 判断不为空
 */
export const notEmpty = (arrs: { key: string, value: string | number }[]) => {
  let rs = true
  for (let i = 0; i < arrs.length; i++) {
    if (!arrs[i].value) {
      Taro.showToast({
        title: `${arrs[i].key}不能为空`,
        icon: 'none',
        duration: 2000
      })
      rs = false
      break
    }
  }
  return rs
}

/**
 * 跳转到首页
 */
export const gotoIndex = () => {
  Taro.switchTab({
    url: indexPagePath
  })
}

/**
 * 用户类型标志转换为名称
 */
export const utype2Name = (utype: number): string => {
  let utypeName = '普通用户'
  switch (utype) {
    case 0:
      break;
    case 1:
      utypeName = '实习站员'
      break;
    case 2:
      utypeName = '正式站员'
      break;
    case 3:
      utypeName = '往届站员'
      break;
    case 4:
      utypeName = '管理员'
      break;
    case 5:
      utypeName = '超级管理员'
      break;
  }
  return utypeName
}

/**
 * 职位标志转换为名称
 */
export const position2Name = (position: number): string => {
  let positionName = '站员'
  switch (position) {
    case 0:
      break
    case 1:
      positionName = '实习部长'
      break
    case 2:
      positionName = '实习副站'
      break
    case 3:
      positionName = '实习站长'
      break
    case 4:
      positionName = '部长'
      break
    case 5:
      positionName = '副站'
      break
    case 6:
      positionName = '站长'
      break
    case 7:
      positionName = '指导老师'
      break
  }
  return positionName
}

/**
 * 性别标志转换为名称
 */
export const sex2Name = (sex: number): string => {
  return sex === 1 ? '男' : sex === 2 ? '女' : '保密'
}

/**
 * 性别 Map
 */
export const sexMap = [
  { text: '保密', value: 0 },
  { text: '男', value: 1 },
  { text: '女', value: 2 }
];

/**
 * 部门 Array
 */
export const departmentArray = [
  '开发部',
  '企划部',
  '信息部',
  '运营部'
]

/**
 * 用户信息标志转换为名称
 */
export const handelUserInfo = (user: User): User => {
  const userHandeled: User = {
    ...user,
    photo: user.photo && user.photo.replace(/\\/, '/'),
    department: user.department || '天商人',
    fullhead: `${YGURL.asset_url}${user.head}`,
    sexName: sex2Name(Number(user.sex)),
    utypeName: utype2Name(Number(user.utype)),
    positionName: position2Name(Number(user.position))
  };
  return userHandeled
}


/**
 * 部门颜色
 */
export const transDepartMentColor = (department: string) => {
  let color = '#2196F3'
  switch (department) {
    case '开发部': color = '#2196F3'
    break
    case '企划部': color = '#9C7DCF'
    break
    case '信息部': color = '#FFA500'
    break
    case '运营部': color = '#4CAF50'
    break
    case '实习站员': color = '#008B8B'
    break
    case '天商人': color = '#2db7f5'
    break
    default: color = '#2196F3'
  }
  return color
}

/**
 * 对象转 Query 字符串 并过滤空值
 */
export const toQuery = (data: Record<string, string | number | boolean>) =>
  Object.entries(data)
    .filter(e => String(e[1]).trim() !== '')
    .map(e => `${e[0]}=${e[1]}`)
    .join('&');

/**
 * 检测月、日、时、分、秒是否补零
 */
export function checkTime (i: number | string) {
  if (String(i).length < 2) {
    i = `0${i}`
  }
  return i
}

/**
 * 获取当前时间
 */
export function getNowTime () {
  const today = new Date()
  const weekday = new Array(7)
  weekday[0] = '星期日'
  weekday[1] = '星期一'
  weekday[2] = '星期二'
  weekday[3] = '星期三'
  weekday[4] = '星期四'
  weekday[5] = '星期五'
  weekday[6] = '星期六'
  const year = today.getFullYear()
  let month: number | string = today.getMonth() + 1
  let day: number | string = today.getDate()
  let h: number | string = today.getHours();
  let m: number | string = today.getMinutes()
  let s: number | string = today.getSeconds()
  month = checkTime(month)
  day = checkTime(day)
  h = checkTime(h)
  m = checkTime(m)
  s = checkTime(s)
  const cn = year + '年' + month + '月' + day + '日  ' + h + ':' + m + ':' + s + '  ' + weekday[today.getDay()]
  const en = `${year}-${month}-${day} ${h}:${m}:${s}`;
  const ymd = `${year}-${month}-${day}`;
  const hms = `${h}:${m}:${s}`;
  return {
    cn,
    en,
    ymd,
    hms
  }
}

/**
 * 函数防抖
 */
export function debounce(func: Function, wait: number, immediate?: boolean) {
  let timeout: any;
  return function () {
    const context = this;
    const args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    }
  }
}
