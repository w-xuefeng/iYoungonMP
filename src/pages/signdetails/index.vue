<template>
  <div class="page">
    <div class="card">
      <div v-if="head" class="headstyle d-flex flex-justify-center flex-align-item-center" :style="{backgroundImage:'url(' + ASSET_URL + head + ')'}">
        <div class="cover">
          <img :src="ASSET_URL + head" class="headImg imgCircle">
          <span class="ulevels">
            YGLV {{ulevel}}
          </span>
          <div class="levelimg">
            <wxParse :content="levelimg" :noData="'YGLV' + ulevel"/>
          </div>
        </div>
      </div>
       <div class="weui-cells weui-cells_after-title">
        <div class="weui-cell">
          <div class="weui-cell__bd">姓名</div>
          <div class="weui-cell__ft">{{name}}</div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__bd">学号</div>
          <div class="weui-cell__ft">{{stuid}}</div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__bd">进站时间</div>
          <div class="weui-cell__ft">{{entertime}}</div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__bd">进站原因</div>
          <div class="weui-cell__ft">{{reason}}</div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__bd">离站时间</div>
          <div class="weui-cell__ft">{{outtertime}}</div>
        </div>
      </div>     
    </div>
  </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
import { REQ_URL, getLevelImg } from '@/utils'
export default {
  components: {
    wxParse
  },
  data () {
    return {
      ASSET_URL: `${REQ_URL}/static/assets`,
      name: '',
      stuid: '',
      head: '',
      ulevel: 0,
      levelimg: '',
      entertime: '',
      outtertime: '',
      reason: '',
      adminToken: '__token__d6a92024d88ab83cf14e67ae884caf19'
    }
  },
  methods: {
    setInfor (item) {
      this.stuid = item.stuid
      this.head = item.head
      this.entertime = item.entertime
      this.reason = item.reason
      this.outtertime = item.outtertime === '1949-10-01 00:00:00' ? '尚未签退' : (item.outtertime.substring(11, 18) === '00:00:0' ? '未签退 系统自动签退' : item.outtertime)
    },
    getUserLevel (stuid) {
      wx.request({
        url: `${REQ_URL}/users/get/stuid?stuid=${stuid}&&adminToken=${this.adminToken}`,
        success: res => {
          if (res.data) {
            this.ulevel = res.data.resdata.ulevel
            this.name = res.data.resdata.name
            this.levelimg = getLevelImg(res.data.resdata.ulevel)
          }
        },
        fail: () => {
          this.toast('迷失在茫茫网络中...')
        },
        complete: () => {
          wx.stopPullDownRefresh()
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
    refreshPage () {
      this.getUserLevel(this.$root.$mp.query['stuid'])
      this.setInfor(this.$root.$mp.query)
    }
  },
  onPullDownRefresh () {
    this.refreshPage()
  },
  mounted () {
    this.refreshPage()
  }
}
</script>

<style scoped>
@import url('~mpvue-wxparse/src/wxParse.css');

.imgCircle {
  border-radius: 50%;
  display: flex;
  align-items: center;
}

.text-center {
  text-align: center !important;
}
.d-flex {
  display: flex !important;
}
.flex-justify-center {
  justify-content: center !important;
}
.flex-justify-space-between {
  justify-content: space-between !important;
}
.flex-justify-space-around {
  justify-content: space-around !important;
}
.flex-align-item-center {
  align-items: center !important;
}
.gray-font {
  color: gray !important;
}
.font-16 {
  font-size: 16px !important;
}
.font-12 {
  font-size: 12px !important;
}
.size45 {
  width: 45px !important;
  height: 45px !important;
}
.marginTB10 {
  margin-top: 10px;
}
.card {
  width: 88%;
  margin: 20px auto;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px rgba(0, 0, 0, 0.14),
    0 1px 14px rgba(0, 0, 0, 0.12);
  padding: 10px;
}
.headstyle {
  flex-direction: column;
  text-align: center;
  background-position: 50% 50%;
  background-size: cover;
  max-height: 250px;
  overflow: hidden;
}
.headImg {
  object-fit: cover;
  border: 1px solid #fff;
  height: 90px;
  width: 90px;
  margin: 0 auto;
}
.cover {
  padding-top: 40px;
  padding-bottom: 30px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}
.ulevels {
  width: 80px;
  height: 20px;
  line-height: 20px;
  margin: 10px auto;
  display: inline-block;
  text-align: center;
  border: 1px solid rgb(208, 223, 226);
  border-radius: 20px;
  color: #fff;
  font-size: 12px;
  font-family: '微软雅黑';
}
</style>
<style>
.ulevel {
  width: 18px!important;
  height: 18px!important;
}
</style>
