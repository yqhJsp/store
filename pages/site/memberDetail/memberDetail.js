// pages/site/memberDetail/memberDetail.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maninfo: {},
    article: {},//详情

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var maninfo = app.globalData.maninfo;
    var article = maninfo.cardDesc;
        that.setData({
          maninfo: maninfo,
          article: app.WxParse.wxParse('article', 'html', article, that, 0)     
        });
        app.common_util.setBarColor(maninfo.tone);
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