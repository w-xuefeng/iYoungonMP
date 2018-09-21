<template>
  <div class="page">
    <div class="page__bd">

    <div class="card">
      <div class="weui-panel">
        <div class="weui-panel__hd">最新公告</div>
        <div class="weui-panel__bd">
          <div class="weui-media-box weui-media-box_text">
            <div class="notice">
              <wxParse :content="notice.content"/>
            </div>
            <div class="weui-media-box__info noborder">
              <div class="weui-media-box__info__meta">{{notice.publisher}}</div>
              <div class="weui-media-box__info__meta">于 {{notice.publishtime}} 发布</div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- 图文组合列表  start -->
      <div class="card">
        <div class="weui-panel__hd">当前在站</div>
        <div class="weui-panel__bd">
          <div v-if="online === null || online.length === 0" class="text-center gray-font font-12">暂无站员在站</div>
          <navigator v-if="online && online.length != 0"  v-for="user in online" :key="user.stuid" :url="'/pages/signdetails/main?stuid=' + user.stuid + '&head=' + user.head + '&reason=' + user.reason + '&entertime=' + user.entertime + '&outtertime=' + user.outtertime" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active">
            <div class="weui-media-box__hd weui-media-box__hd_in-appmsg imgCircle">
              <image class="weui-media-box__thumb imgCircle size45" :src="ASSET_URL + user.head" />
            </div>
            <div class="weui-media-box__bd weui-media-box__bd_in-appmsg size45">
              <div class="weui-media-box__title">{{user.name}}</div>
              <div class="weui-media-box__desc">{{user.entertime}}</div>
            </div>
            <div class="online_reason">{{user.reason}}</div>
          </navigator>
        </div>
      </div>

      <div class="card">
        <div class="weui-panel__hd keyuser">钥匙携带者</div>
          <div v-if="ifkey === null || ifkey.length === 0" class="text-center gray-font font-12">暂无</div>
          <div v-if="ifkey && ifkey.length != 0" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active" v-for="user in ifkey" :key="user.stuid" @click="callUser(user.phone)">
            <div class="weui-media-box__hd weui-media-box__hd_in-appmsg imgCircle size45">
              <image class="weui-media-box__thumb imgCircle size45" :src="ASSET_URL + user.head" />
            </div>
            <div class="weui-media-box__bd weui-media-box__bd_in-appmsg">
              <div class="weui-media-box__title">{{user.name}}</div>
              <div class="weui-media-box__desc" v-if="user.phone !== null">{{user.phone}}</div>
            </div>
          </div>
          <div class="weui-media-box__info">
            <div class="weui-media-box__info__meta">小提示：点击对应的人可直接拨打电话哦</div>
          </div>        
      </div>
      <!-- 图文组合列表  end -->      
    </div>
  </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
import { REQ_URL } from '@/utils'
export default {
  components: {
    wxParse
  },
  data () {
    return {
      notice: {
        publishtime: ``,
        content: `loading...`,
        publisher: ``
      },
      ASSET_URL: `${REQ_URL}/static/assets`,
      online: [],
      ifkey: []
    }
  },
  methods: {
    getLastNotice () {
      let req = {
        url: `${REQ_URL}/notice/get`,
        success: (res) => {
          this.notice = res.data
        },
        complete: () => {
          wx.stopPullDownRefresh()
        }
      }
      wx.request(req)
    },
    getOnline () {
      let req = {
        url: `${REQ_URL}/users/get/online`,
        success: (res) => {
          this.online = res.data.resdata
          if (this.online) {
            for (let i = 0; i < res.data.resdata.length; i++) {
              this.online[i].outtertime = '1949-10-01 00:00:00'
            }
          }
        },
        complete: () => {
          wx.stopPullDownRefresh()
        }
      }
      wx.request(req)
    },
    getKey () {
      let req = {
        url: `${REQ_URL}/users/get/haskey`,
        success: (res) => {
          this.ifkey = res.data.resdata
        },
        complete: () => {
          wx.stopPullDownRefresh()
        }
      }
      wx.request(req)
    },
    getWXUserInfor () {
      wx.login({
        success: (res) => {
          if (res.code) {
            wx.request({
              url: `${REQ_URL}/users/get/wxlogin?code=${res.code}`,
              success: (res) => {
                if (res.data.status) {
                  wx.setStorage({
                    key: 'user',
                    data: res.data.resdata
                  })
                } else {
                  wx.setStorageSync('openid', res.data.openid)
                  wx.navigateTo({
                    url: '/pages/register/main'
                  })
                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },
    toast (title) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
    },
    callUser (phone) {
      if (phone) {
        wx.makePhoneCall({
          phoneNumber: phone
        })
      } else {
        this.toast('该站员尚未绑定手机号码')
      }
    },
    refreshPage () {
      this.getLastNotice()
      this.getOnline()
      this.getKey()
    }
  },
  onPullDownRefresh () {
    this.refreshPage()
  },
  mounted () {
    this.getWXUserInfor()
  },
  onShow () {
    this.refreshPage()
  }
}
</script>

<style>
@import url("~mpvue-wxparse/src/wxParse.css");
.weui-panel:before,
.weui-panel:after,
.noborder {
  border: 0px solid transparent!important;
}
.imgCircle {
  border-radius: 50%;
  display: flex;
  align-items: center;
}
.notice {
  padding-left: 15px;
}
.online_reason {
  font-size: 16px;
  color: #767d83;
}
.text-center {
  text-align: center!important;
}
.d-flex {
  display: flex!important;
}
.flex-justify-center {
  justify-content: center!important;
}
.flex-justify-space-between {
  justify-content: space-between!important;
}
.flex-justify-space-around {
  justify-content: space-around!important;
}
.flex-align-item-center {
  align-items: center!important;
}
.gray-font {
  color: gray!important;
}
.font-16 {
  font-size: 16px!important;
}
.font-12 {
  font-size: 12px!important;
}
.size45 {
  width: 45px!important;
  height: 45px!important;
}
.weui-media-box_appmsg {
  height: 50px;
  display: flex;
  align-items: center;
}
.marginTB10 {
  margin-top: 10px;
}
.card {
  width: 88%;
  margin: 20px auto;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px rgba(0,0,0,.14),0 1px 14px rgba(0,0,0,.12);
  padding: 10px;
}
.keyuser:after {
  border: none;
}
</style>