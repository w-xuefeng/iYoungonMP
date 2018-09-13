<template>
  <div class="page">
    <div class="page__bd">
      <div class="weui-tab">
        <div class="weui-navbar">
          <block v-for="(item,index) in tabs" :key="index">
            <div :id="index" :class="{'weui-bar__item_on':activeIndex == index}" class="weui-navbar__item" @click="tabClick">
              <div class="weui-navbar__title">{{item}}</div>
            </div>
          </block>
          <div class="weui-navbar__slider" :class="navbarSliderClass"></div>
        </div>
        <div class="weui-tab__panel">
          <div class="weui-tab__content" :hidden="activeIndex != 0">
            <div class="weui-panel__bd">
              <div v-if="thisweek === null || thisweek.length === 0" class="text-center gray-font font-16 marginT15">暂无记录</div>
              <navigator v-if="thisweek && thisweek.length != 0" url="" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active" v-for="user in thisweek" :key="user.stuid">
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
          <div class="weui-tab__content" :hidden="activeIndex != 1">
            <div class="weui-panel__bd">
              <div v-if="lastweek === null || lastweek.length === 0" class="text-center gray-font font-16 marginT15">暂无记录</div>
              <navigator v-if="lastweek && lastweek.length != 0" url="" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active" v-for="user in lastweek" :key="user.stuid">
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
          <div class="weui-tab__content" :hidden="activeIndex != 2">
            <div class="weui-panel__bd">
              <div v-if="all === null || all.length === 0" class="text-center gray-font font-16 marginT15">暂无记录</div>
              <navigator v-if="all && all.length != 0" url="" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active" v-for="user in all" :key="user.stuid">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { REQ_URL } from '@/utils'
export default {
  data () {
    return {
      ASSET_URL: `${REQ_URL}/static/assets`,
      tabs: ['本周记录', '上周记录', '全部记录'],
      activeIndex: 0,
      fontSize: 30,
      thisweek: [],
      lastweek: [],
      all: []
    }
  },
  computed: {
    navbarSliderClass () {
      if (this.activeIndex === '0') {
        return 'weui-navbar__slider_0'
      }
      if (this.activeIndex === '1') {
        return 'weui-navbar__slider_1'
      }
      if (this.activeIndex === '2') {
        return 'weui-navbar__slider_2'
      }
    }
  },
  methods: {
    tabClick (e) {
      this.activeIndex = e.currentTarget.id
    },
    getRecord (x) {
      let config = {
        url: `${REQ_URL}/sign/record/${x}`,
        success: (ret) => {
          switch (x) {
            case 'thisweek': this.thisweek = ret.data
              break
            case 'lastweek': this.lastweek = ret.data
              break
            case 'all?page=0': this.all = ret.data
              break
            default : if (ret.data.length !== 0) {
              this.all.push.apply(this.all, ret.data)
            } else {
              this.toast('已加载所有签到记录')
            }
          }
        },
        complete: () => {
          wx.stopPullDownRefresh()
        }
      }
      wx.request(config)
    },
    toast (title) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
    },
    refreshPage () {
      this.getRecord('thisweek')
      this.getRecord('lastweek')
      this.getRecord('all?page=0')
    }
  },
  onPullDownRefresh () {
    this.refreshPage()
  },
  onReachBottom () {
    if (this.activeIndex === '2') {
      this.getRecord(`all?page=${this.all.length}`)
    }
  },
  mounted () {
    this.refreshPage()
  },
  onShow () {
    this.getRecord('thisweek')
  }
}
</script>

<style scoped>
page,
.page,
.page__bd {
  height: 100%;
}
.page__bd {
  padding-bottom: 0;
}
.weui-bar__item_on {
  color: #1296DB;
}
.weui-navbar__slider {
  background-color: #1296DB;
}
.weui-navbar__slider_0 {
  left: 29rpx;
  transform: translateX(0);
}
.weui-navbar__slider_1 {
  left: 29rpx;
  transform: translateX(250rpx);
}
.weui-navbar__slider_2 {
  left:29rpx;
  transform: translateX(500rpx);
}
.weui-panel:before,
.weui-panel:after,
.noborder {
  border: 0px solid transparent!important;
}
.imgCircle {
  border-radius: 50%;
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
.marginT15 {
  margin-top: 15px;
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