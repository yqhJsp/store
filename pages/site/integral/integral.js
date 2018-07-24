// pages/marketing/integral/integral.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    list:[],
    size:10,
    number:1,
    way:'',
    getMember:{},
    intelSum:0//可用的积分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
   var member = app.globalData.member;
   var sum = member.integralSum - member.integralOut;
   that.setData({
     getMember: member,
     intelSum: sum
   });
   app.common_util.setBarColor(app.globalData.maninfo.tone);
  that.getIntegral();
  },
  //获取数据
  getIntegral:function(){
  var that=this;
  var memberId = app.globalData.member.id;
      var data={
        'memberId': memberId,
        'size':that.data.size,
        'number':that.data.number,
        // 'createUserId': app.globalData.createUserId
      }
      app.api_util.integralloglist(data, '加载中...', function success(res) {
        if (res.errcode == 0) {
          that.setData({
            list: res.result.content
          })
        }
        var list = that.data.list;
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          if (item.source==1){
            item.sw="优惠买单"
          }
          else if (item.source == 2){
            item.sw = "商城购物"
          }
          if (item.way == 1) {
            that.setData({
              way: '购物送积分'
            })
          } else if (item.way == 2) {
            that.setData({
              way: '积分抵现金'
            })
          } else if (item.way == 3) {
            that.setData({
              way: '退货返还'
            })
          }

        }
        that.setData({
          list:list
        })
      }, function fail(res) {
        app.toast.warn("网络异常", 1000);
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})