// pages/site/distDetail/distDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    consult:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
  var consult = wx.getStorageSync('consult');
  that.setData({
    consult: consult
  })
  },
  //取消预约
  delConsult:function(e){
    var that=this;
    var id=e.currentTarget.dataset.id;
    app.api_util.delscribelist({id:id},'',function success(res){
      if (res.errcode==0){
        app.toast.success("取消成功",1500);
        wx.redirectTo({
          url: '../myconsult/myconsult',
        })
      }
    },function fail(res){

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