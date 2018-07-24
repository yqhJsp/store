const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    info:{},
    member:{},
    maninfo:{},
    pid:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var id=options.id;
    that.setData({
      pid:id
    })
    var maninfo = app.globalData.maninfo;
    that.setData({
      maninfo: maninfo,
    })
    app.common_util.setBarColor(maninfo.tone);

  },
  //获取优惠买单列表
 getData:function(e){
  var that=this;
  var id=that.data.pid;
  app.api_util.discountsorderid(id,'加载中..',function success(res){
    if (res.errcode==0){
      var data = res.result;
      if (data!=''){
        that.setData({
          info:data,
        })
      }else{
        that.setData({
          info: [],
        })
      }
    }
  },function fail(res){
    
  })
 },
 //返回首页
 goIndex:function(){
  wx.switchTab({
    url: '../index/index',
  })
 },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    that.getData();
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