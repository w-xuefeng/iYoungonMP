<template>
  <div class="page">
    <div class="card signbox">
      <h3>{{online ? '签退' : '签到'}}</h3>
      <picker v-if="!online" class="weui-btn signpicker" @change="PickerChange" :value="indexPicker" :range="reason">
        <p class="reasonText">
          签到原因： {{reason[indexPicker]}}
        </p>
      </picker>
      <picker v-if="online" class="weui-btn signpicker" @change="PickerChange" :value="indexPicker" :range="ifkey">
        <p class="reasonText">
          携带钥匙 ： {{ifkey[indexPicker]}}
        </p>
      </picker>
      <button :type="online ? 'warn' : 'primary'" plain="true" :class="{'signInBtn': !online}" class="signbtn" @click="signOrOut">{{online ? '签退' : '签到'}}</button>
      <p class="wifi">当前wifi：{{wifi.curwifi}}</p>
      <p class="lcation">当前位置：{{location.locationname}}</p>
    </div>
  </div>
</template>

<script>
import { REQ_URL, inArray } from '@/utils'
export default {
  data () {
    return {
      user: {},
      online: false,
      indexPicker: 0,
      reason: ['请选择', '值班', '补值班', '例会', '临时进站', '自习', '其他'],
      ifkey: ['请选择', '否', '是'],
      location: {
        locationname: '正在定位中...'
      },
      allowloation: {},
      wifi: {
        curwifi: '正在检测中...',
        allow: []
      }
    }
  },
  methods: {
    PickerChange (e) {
      this.indexPicker = e.mp.detail.value
    },
    checkOnline () {
      let req = {
        url: `${REQ_URL}/users?token=${this.user.token}`,
        method: 'get',
        success: (res) => {
          this.setOnline(Number(res.data.resdata.online) === 1)
        }
      }
      wx.request(req)
    },
    signOrOut () {
      this.online ? this.signOut() : this.signIn()
    },
    signIn () {
      if (Number(this.indexPicker) === 0) {
        this.toast('请选择签到原因')
        return false
      }
      const islinkWifi = inArray(this.wifi.curwifi, this.wifi.allow)
      const islat = JSON.stringify(this.allowloation) !== '{}' && this.location.latitude < (this.allowloation.maxlat * 1) && this.location.latitude > (this.allowloation.minlat * 1)
      const islong = JSON.stringify(this.allowloation) !== '{}' && this.location.longitude < (this.allowloation.maxlong * 1) && this.location.longitude > (this.allowloation.minlong * 1)
      console.log(islinkWifi, islat, islong)
      if (islinkWifi || (islat && islong)) {
        if (islinkWifi) {
          this.toast('检测到已连接网站WIFI')
        }
        wx.request({
          url: `${REQ_URL}/sign/patch/in`,
          method: 'POST',
          data: {
            stuid: this.user.stuid,
            reason: this.reason[this.indexPicker]
          },
          success: (rs) => {
            if (rs.data.status) {
              if (this.reason[this.indexPicker] === '值班' || this.reason[this.indexPicker] === '补值班') {
                this.addDuty()
              }
              this.toast('签到成功')
              this.setOnline(true)
              this.indexPicker = 0
            } else {
              this.toast('签到失败')
            }
          },
          fail: () => {
            this.toast('迷失在茫茫网络中...')
          }
        })
      } else {
        this.toast('请在指定位置签到')
      }
    },
    addDuty () {
      wx.request({
        url: `${REQ_URL}/duty/index/updateduty`,
        method: 'POST',
        data: {
          stuid: this.user.stuid,
          dutydate: this.getNowTime()
        },
        success: (rs) => {
          if (rs.data.status) {
            this.toast('添加值班标记成功')
          } else {
            this.toast('添加值班标记失败')
          }
        }
      })
    },
    getAlloLocation () {
      wx.request({
        url: `${REQ_URL}/commonset/index/getlatlong`,
        success: (rs) => {
          this.allowloation.maxlat = rs.data.lat * 1 + rs.data.range * 1 * 0.00001
          this.allowloation.minlat = rs.data.lat * 1 - rs.data.range * 1 * 0.00001
          this.allowloation.maxlong = rs.data.long * 1 + rs.data.range * 1 * 0.00001
          this.allowloation.minlong = rs.data.long * 1 - rs.data.range * 1 * 0.00001
        }
      })
    },
    getAllowWifi () {
      wx.request({
        url: `${REQ_URL}/commonset/index/getwifi`,
        success: (rs) => {
          this.wifi.allow = rs.data.wifi
        }
      })
    },
    signOut () {
      if (Number(this.indexPicker) === 0) {
        this.toast('请选择是否携带钥匙')
        return false
      }
      wx.request({
        url: `${REQ_URL}/sign/patch/out`,
        method: 'POST',
        data: {
          stuid: this.user.stuid,
          ifkey: this.indexPicker - 1
        },
        success: (rs) => {
          if (rs && rs.data.status) {
            this.toast('签退成功')
            this.setOnline(false)
            this.indexPicker = 0
          } else {
            this.toast('签退失败')
          }
        },
        fail: () => {
          this.toast('迷失在茫茫网络中...')
        }
      })
    },
    setOnline (online) {
      this.online = online
      wx.setStorage({ key: 'online', data: this.online })
    },
    toast (title) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
    },
    getWifi () {
      wx.startWifi({
        success: res => {
          wx.getConnectedWifi({
            success: res => {
              this.wifi.curwifi = res.wifi.SSID
            },
            fail: e => {
              this.wifi.curwifi = '尚未检测到wifi'
            },
            complete: () => {
              wx.stopWifi()
              wx.stopPullDownRefresh()
            }
          })
        }
      })
    },
    getLocal (ret) {
      let location = {
        url: `${REQ_URL}/location/infor?latitude=${ret.latitude}&longitude=${ret.longitude}`,
        method: 'GET',
        success: rs => {
          if (rs.data) {
            this.location.locationname = `${
              rs.data.result['formatted_address']
            } ${rs.data.result['sematic_description']}`
          } else {
            this.toast('没有获取到位置信息')
          }
        },
        complete: () => {
          wx.stopPullDownRefresh()
        }
      }
      wx.request(location)
    },
    getLocation () {
      wx.getLocation({
        type: 'wgs84',
        success: res => {
          this.getLocal(res)
          this.location.latitude = res.latitude
          this.location.longitude = res.longitude
          this.location.speed = res.speed
          this.location.accuracy = res.accuracy
        }
      })
    },
    getUser () {
      try {
        const user = wx.getStorageSync('user')
        if (user) {
          this.user = user
          return true
        } else {
          this.toast('没有读取到微信信息，请重启小程序')
          return false
        }
      } catch (e) {
        this.toast('没有读取到微信信息，请重启小程序')
        return false
      }
    },
    getNowTime () {
      let today = new Date()
      let weekday = new Array(7)
      weekday[0] = '星期日'
      weekday[1] = '星期一'
      weekday[2] = '星期二'
      weekday[3] = '星期三'
      weekday[4] = '星期四'
      weekday[5] = '星期五'
      weekday[6] = '星期六'
      let year = today.getFullYear()
      let month = today.getMonth() + 1
      let day = today.getDate()
      let h = today.getHours()
      let m = today.getMinutes()
      let s = today.getSeconds()
      m = this.checkTime(m)
      s = this.checkTime(s)
      let currentdate = year + '年' + month + '月' + day + '日  ' + h + ':' + m + ':' + s + '  ' + weekday[today.getDay()]
      return currentdate
    },
    checkTime (i) {
      if (i < 10) {
        i = `0${i}`
      }
      return i
    },
    init () {
      this.getUser()
      this.getWifi()
      this.getAllowWifi()
      this.getLocation()
      this.getAlloLocation()
      this.checkOnline()
      this.indexPicker = 0
    }
  },
  onPullDownRefresh () {
    this.init()
  },
  mounted () {
    this.init()
  }
}
</script>

<style>
.card {
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px rgba(0, 0, 0, 0.14),
    0 1px 14px rgba(0, 0, 0, 0.12);
}

.signbox {
  width: 80%;
  min-height: 200px;
  margin: 20px auto;
  padding: 20px;
}

.reasonText {
  padding: 10px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.signbtn {
  font-size: 16px;
  height: 40px;
  line-height: 40px;
  margin: 20px auto;
}

.signInBtn {
  border: 1px solid #1296db !important;
  color: #1296db !important;
}

.wifi,
.lcation {
  font-size: 12px;
  color: gray;
}
</style>
