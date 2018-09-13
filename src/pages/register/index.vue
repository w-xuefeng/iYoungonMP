<template>
  <div>
    <p class="card gray-font font-12">系统检测到您是第一次打开此小程序，您可以进行以下操作</p>
    <div class="card userBind" :class="{'hideRegister': !isHideReg}">
      <h6 class="gray-font font-12" @click="isHideReg = !isHideReg">绑定iYoungon账号</h6>
      <div class="md-input-container">
        <input type="text" required="required" class="font-14" placeholder="学号" v-model="bdstuid">
      </div>
      <div class="md-input-container">
        <input type="password" required="required" class="font-14" placeholder="密码" v-model="bdpassword">
      </div>
      <button class="btn bluebcak bindUser" @click="updateWxid()">绑定账号</button>
    </div>
    <div class="card register" :class="{'hideRegister': isHideReg}">
      <h6 class="gray-font font-12" @click="isHideReg = !isHideReg">注册iYoungon账号</h6>      
      <div class="md-input-container">
        <input type="text" required="required" class="font-14" placeholder="学号" v-model="stuid">
      </div>
      <div class="md-input-container">
        <input type="text" required="required" class="font-14" placeholder="姓名" v-model="name">
      </div>
      <div class="md-input-container">
        <input type="password" required="required" class="font-14" placeholder="密码" v-model="password">
      </div>
      <div class="md-input-container">
        <input type="password" required="required" class="font-14" placeholder="重复密码" v-model="repassword">
      </div>
      <div class="md-input-container">
        <input type="email" required="required" class="font-14" placeholder="邮箱" v-model="email">
      </div>
      <div class="md-input-container">
        <picker class="weui-btn signpicker" @change="PickerChange" :value="utype" :range="utypeItem">        
          <p class="font-16 gray-font" style="margin:20px auto;border-bottom:1px solid gray;">
            选择用户类型: {{utypeItem[utype]}}
          </p>
        </picker>        
      </div>      
      <div class="md-input-container" style="flex-direction: column;" v-if="utype != 0 && utype !=1 ">
        <span class="gray-font font-16">请联系网站工作人员申请注册码</span>
        <input type="text" required="required" class="font-14" placeholder="注册码" v-model="rcode">
      </div>
      <button class="btn bluebcak bindUser" @click="register()">注册账号</button>
    </div>
  </div>
</template>

<script>
import { REQ_URL } from '@/utils'
export default {
  data () {
    return {
      stuid: '',
      bdstuid: '',
      bdpassword: '',
      name: '',
      password: '',
      repassword: '',
      email: '',
      utype: 0,
      rcode: '',
      openid: '',
      utypeItem: ['请选择', '普通用户', '实习站员', '正式站员', '往届站员'],
      isHideReg: true
    }
  },
  methods: {
    PickerChange (e) {
      this.utype = e.mp.detail.value
    },
    toast (title) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
    },
    updateWxid () {
      if (!this.checkVar([this.bdstuid, this.bdpassword], ['学号', '密码'])) {
        return false
      }
      try {
        const openid = wx.getStorageSync('openid')
        if (openid) {
          this.openid = openid
          wx.request({
            url: `${REQ_URL}/users/patch/wxid`,
            method: 'POST',
            data: {
              'stuid': this.bdstuid,
              'password': this.bdpassword,
              'wxid': this.openid
            },
            success: (res) => {
              if (res.data.status) {
                this.toast('绑定成功')
                wx.setStorage({
                  key: 'user',
                  data: res.data.resdata
                })
                wx.navigateBack()
              } else {
                this.toast(res.data.error)
              }
            }
          })
        } else {
          this.toast('没有读取到微信信息，请重启小程序')
        }
      } catch (e) {
        this.toast('没有读取到微信信息，请重启小程序')
      }
    },
    register () {
      if (!this.checkVar([this.stuid, this.name, this.password, this.repassword, this.email, this.utype], ['学号', '姓名', '密码', '重复密码', '邮箱', '用户类型'])) {
        return false
      }
      if ((Number(this.utype) !== 0 && Number(this.utype) !== 1) && !this.checkVar([this.rcode], ['注册码'])) {
        return false
      }
      if (Number(this.utype) === 0) {
        this.toast('请选择用户类型')
        return false
      }
      if (this.password !== this.repassword) {
        this.toast('两次密码不一致')
        return false
      }
      if (!this.isEmail(this.email)) {
        this.toast('邮箱不合法')
        return false
      }
      this.checkRegisterCode()
    },
    toRegister () {
      try {
        const openid = wx.getStorageSync('openid')
        if (openid) {
          this.openid = openid
          let data = {
            'stuid': this.stuid,
            'password': this.password,
            'name': this.name,
            'email': this.email,
            'utype': this.utype - 1,
            'wxid': this.openid
          }
          let req = {
            url: `${REQ_URL}/users`,
            method: 'POST',
            data: data,
            success: (res) => {
              if (res.data.status) {
                this.toast('注册成功')
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
                            wx.reLaunch({
                              url: '/pages/index/main'
                            })
                          } else {
                            this.toast('没有读取到微信信息，请重启小程序')
                          }
                        }
                      })
                    } else {
                      console.log('登录失败！' + res.errMsg)
                    }
                  }
                })
              } else {
                this.toast(res.data.error)
              }
            }
          }
          wx.request(req)
        } else {
          this.toast('没有读取到微信信息，请重启小程序')
        }
      } catch (e) {
        this.toast('没有读取到微信信息，请重启小程序')
      }
    },
    checkRegisterCode () {
      if (this.utype !== '0') {
        let req = {
          url: `${REQ_URL}/commonset/index/getrcode`,
          success: (res) => {
            if (this.rcode !== res.data.Rcode) {
              this.toast('注册码不正确')
            } else {
              this.toRegister()
            }
          }
        }
        wx.request(req)
      } else {
        this.toRegister()
      }
    },
    checkVar (x, name) {
      for (let i = 0; i < x.length; i++) {
        if (!x[i] || x[i] === '') {
          this.toast(name[i] + '不能为空')
          return false
        }
      }
      return true
    },
    isEmail (str) {
      let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      return reg.test(str)
    }
  },
  mounted () {}
}
</script>

<style>
.card {
  width: 88%;
  margin: 20px auto;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px rgba(0,0,0,.14),0 1px 14px rgba(0,0,0,.12);
  padding: 10px;
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
.font-14 {
  font-size: 12px!important;
}
.md-input-container {
    width: 100%;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
}
.md-input-container input {
  border-bottom: 1px solid gray;
  width: 80%;
  margin: 15px auto;
}
.bluebcak {
  background-color: rgb(18, 150, 219)!important;
  color: #ffffff!important;
}
.userBind,
.register {
  padding-top:15px;
  padding-bottom:15px;
  overflow: hidden;
  transition: all 300ms linear;
}
.hideRegister {
  height: 20px;
}
.btn {
    min-width: 88px;
    min-height: 36px;
    margin: 0 5px;
    padding: 0 16px;
    display: block;
    position: relative;
    overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    border: 0;
    transition: all .4s cubic-bezier(.25,.8,.25,1);
    font-family: inherit;
    font-size: 14px;
    font-style: inherit;
    font-variant: inherit;
    font-weight: 500;
    letter-spacing: inherit;
    line-height: 36px;
    text-align: center;
    text-transform: uppercase;
    text-decoration: none;
    white-space: nowrap;
}
.bindUser {
  width: 80%!important;
  margin: 0 auto!important;
}
</style>
