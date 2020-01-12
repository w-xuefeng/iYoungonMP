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
 * 用户信息标志转换为名称
 */
export const handelUserInfo = (user: User): User => {
  const userHandeled: User = {
    ...user,
    fullhead: `${YGURL.asset_url}${user.head}`,
    sexName: sex2Name(Number(user.sex)),
    utypeName: utype2Name(Number(user.utype)),
    positionName: position2Name(Number(user.position))
  }
  return userHandeled
}
