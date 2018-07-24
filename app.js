//app.js
const static_data = require('./utils/static_data.js');
const request_util = require('./utils/request_util.js');
const api_util = require('./utils/api_util.js');
const toast = require('./utils/toast_util.js');
const common_util = require('./utils/util.js');
const WxParse = require('./plugin/wxParse/wxParse.js');
var loginStatus = true;
App({
  token: '',
  static_data: static_data,
  request_util: request_util,
  api_util: api_util,
  WxParse: WxParse,
  toast: toast,
  common_util: common_util,
  //获取会话失败的弹窗提醒
  getSessionError: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '获取用户会话失败,请重新进入',
      success: function (res) {
        if (res.confirm) {
          that.getUserInfo();
        }
      }
    })
  },
  onShow: function () {
    console.log("onShow")
  },
  /**
   * 同步服务器用户信息
   */
  synUserInfo: function (userInfo) {
    var that = this;
    var member = that.globalData.member;
    var memberData = {
      id: member.userInfo.id,
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      appid: member.appid,
      version: member.version,
      gender: userInfo.gender,
      city: userInfo.city,
      province: userInfo.province,
      country: userInfo.country,
      language: userInfo.language,
      openId: member.openId,
      createUserId: member.createUserId
    }
    that.globalData.member.userInfo = memberData;
    api_util.get_login(memberData, "", function success(data) {
      that.globalData.member.userInfo = memberData;
    }, function (data) {

    });
  },
  getUserInfo: function () {
    var that = this;
    var member = that.globalData.member;
    console.log("member");
    console.log(member);
    if (member.avatarUrl == '') {
      //获取用户信息
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo;
          that.globalData.userInfo = res.userInfo;
          that.synUserInfo(userInfo);
        },
        fail: function (res) {

        }
      })
    }
  },
  /**
   * 强制授权操作
   */
  getPromission: function () {
    var that = this;
    if (!loginStatus) {
      wx.openSetting({
        success: function (data) {
          if (data) {
            if (data.authSetting["scope.userInfo"] == true) {
              loginStatus = true;
              wx.getUserInfo({
                withCredentials: false,
                success: function (data) {
                  console.info("2成功获取用户返回数据");
                  console.info(data.userInfo);
                  that.synUserInfo(data.userInfo);
                },
                fail: function () {
                  console.info("2授权失败返回数据");
                }
              });
            }
          }
        },
        fail: function () {
          console.info("设置失败返回数据");
        }
      });
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              withCredentials: false,
              success: function (data) {
                console.info("1成功获取用户返回数据");
                console.info(data.userInfo);
                that.synUserInfo(data.userInfo);
              },
              fail: function () {
                console.info("1授权失败返回数据");
                loginStatus = false;
                // 显示提示弹窗
                wx.showModal({
                  title: '温馨提示',
                  content: '为了更好的体验，请允许授权',
                  showCancel: false,
                  success: function (res) {
                    wx.openSetting({
                      success: function (data) {
                        if (data) {
                          if (data.authSetting["scope.userInfo"] == true) {
                            loginStatus = true;
                            wx.getUserInfo({
                              withCredentials: false,
                              success: function (data) {
                                console.info("3成功获取用户返回数据");
                                console.info(data.userInfo);
                                that.synUserInfo(data.userInfo);
                              },
                              fail: function () {
                                console.info("3授权失败返回数据");
                              }
                            });
                          }
                        }
                      },
                      fail: function () {
                        console.info("设置失败返回数据");
                      }
                    });
                  }
                });
              }
            });
          }
        },
        fail: function () {
          console.info("登录失败返回数据");
        }
      });
    }
  },
  /**
   * 获取登录接口
   * */
  getSession: function (callback) {
    console.log("getSession")
    var that = this;
    wx.getExtConfig({
      success: function (res) {
        var appid = res.extConfig.appid;
        var createUserId = res.extConfig.createUserId;
        wx.login({
          success: function (res) {
            request_util.jscode2_session({
              appid: appid,
              js_code: res.code,
              createUserId: createUserId
            }, function success(result) {
              if (result.errcode == 0) {
                var openid = result.result.openid;
                var sessionkey = result.result.session_key;
                var token = result.result.token;
                var member = result.result.member;
                wx.setStorageSync('openid', openid);
                wx.setStorageSync('sessionkey', sessionkey)
                wx.setStorageSync('member', member);
                wx.setStorageSync('appid', appid);
                wx.setStorageSync('userid', member.id);
                wx.setStorage({
                  key: "token",
                  data: token
                })
                that.globalData.token = token;
                that.globalData.member = member;
                that.globalData.appid = appid;
                that.globalData.openid = openid;
                that.globalData.createUserId = createUserId;
                // that.getPromission();
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(res)
                }
              } else {
                that.getSessionError();

              }
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }

            }, function fail(result) {
              that.getSessionError();

            });
          }
        })
      }
    })

  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getSession();
  },
  globalData: {
    token: '',
    userInfo: null,
    createUserId: 0,
    member: null,
    maninfo: null,
    appid: null,
    openid: '',
  },
  //下拉刷新
  refresh: function () {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000)
  }
})