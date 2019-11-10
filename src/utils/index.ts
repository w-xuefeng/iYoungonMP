import Taro from '@tarojs/taro'

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
  if (LocalData.getItem(LDKey.TIMESTAMP)) {
    const nowTime = new Date().getTime()
    const saveTimeStamp = Number(LocalData.getItem(LDKey.TIMESTAMP))
    return nowTime - saveTimeStamp > TTL
  }
  return true
}