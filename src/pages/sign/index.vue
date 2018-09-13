<template>
  <div class="page">
    <div class="card signbox">
      <h3>{{title}}</h3>
      <picker class="weui-btn signpicker" @change="PickerChange" :value="indexPicker" :range="reason">        
        <p class="reasonText">
          签到原因： {{reason[indexPicker]}}
        </p>
      </picker>
      <button type="primary" plain="true" class="signbtn">签到</button>
      <p class="lcation">当前位置：{{location.locationname}}</p>      
    </div>
    <p class="wifi">当前wifi：{{wifi.curwifi}}</p>
  </div>
</template>

<script>

export default {
  data () {
    return {
      user: {},
      title: '签到',
      indexPicker: 0,
      reason: ['请选择', '值班', '补值班', '例会', '临时进站', '自习', '其他'],
      ifkey: ['请选择', '是', '否'],
      location: {
        locationname: '正在定位中...'
      },
      wifi: {
        curwifi: '正在检测中...'
      }
    }
  },
  methods: {
    PickerChange (e) {
      this.indexPicker = e.mp.detail.value
    },
    signIn () {
    },
    signOut () {
    },
    toast (title) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
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
    }
  },
  mounted () {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.location.latitude = res.latitude
        this.location.longitude = res.longitude
        this.location.speed = res.speed
        this.location.accuracy = res.accuracy
      }
    })
    console.dir(this.location)
    wx.getConnectedWifi({
      success: (res) => {
        console.dir(res)
        this.toast(JSON.stringify(res))
      },
      fail: () => {
        this.wifi.curwifi = '尚未检测到wifi'
      }
    })
  }
}
</script>

<style>
.card {  
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px rgba(0,0,0,.14),0 1px 14px rgba(0,0,0,.12);
}

.signbox {
  width: 80%;
  height: 200px;
  margin: 20px auto;
  padding: 20px;
}

.reasonText {
  padding: 10px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.signbtn {
  border: 1px solid #1296DB!important;
  color: #1296DB!important;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
  margin: 20px auto;
}

.lcation{
  font-size: 14px;
  color: gray;
}

.wifi {
  text-align: center;
  font-size: 14px;
  color: gray;
}
</style>
