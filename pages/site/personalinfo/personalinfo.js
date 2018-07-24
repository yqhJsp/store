// pages/site/personalinfo/personalinfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member:{},
    userInfo: {},
    name:'',
    mobile:'',
    sex:1,
    maninfo: {},
    date: ['2018', '04'],//日期
    bornYear: '',//年份
    bornMonth: '',//月份
    address: '',//住址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var member = app.globalData.member;
    var maninfo = app.globalData.maninfo;
    that.setData({
      member: member,
      maninfo: maninfo
    })
    app.common_util.setBarColor(maninfo.tone);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.setMember();
  },
  setMember:function(){
   var that=this;
   var userInfo = app.globalData.member;
   if (userInfo!=''){
     var us = userInfo;
     var date = [us.bornYear, us.bornMonth];
     that.setData({
       sex: us.gender,
       name: us.realName,
       mobile: us.mobile,
       address: us.address,
       date: date
     })
   }
  },
  //获取姓名
  nameInput: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      name: e.detail.value
    })
  },
  //手机
  phoneInput: function (e) {
    var that = this;
    that.setData({
      mobile: e.detail.value
    })
  },
  addressInput: function (e) {
    var that = this;
    that.setData({
      address: e.detail.value
    })
  },
  //性别
  checked: function (e) {
    var that = this;
    var selected = e.target.dataset.id;
    that.setData({
      sex: selected
    })
  },
  /*日期控件*/
  bindDateChange: function (e) {
    var that = this;
    var value = e.detail.value;
    if (value != '') {
      var date = value.split('-');
      console.log(date)
      that.setData({
        date: date
      })
    }
  },
//保存信息
  saveMember:function(){
  var that=this;
  var appid =app.globalData.appid;
  var createUserId = app.globalData.createUserId;
  var id = that.data.member.id;
  var realName=that.data.name;
  var mobile = that.data.mobile;
  var gender=that.data.sex;
  var date=that.data.date;
  if (that.data.sex==null){
    gender=1
    }
  var address=that.data.address;
  var bornYear=date[0];
  var bornMonth=date[1];
    
  if (realName == '') {
      app.toast.warn("请填写姓名", 1500);
      return false
    }
  if (mobile.length != 11) {
    app.toast.warn("请填写正确手机号码", 1500);
    return false
  }
var data={
  id: id,
  realName: realName,
  mobile: mobile,
  address: address,
  bornYear: bornYear,
  bornMonth: bornMonth,
  gender: gender,
  appid: appid,
  createUserId:createUserId
}
app.api_util.addmember(data,'',function success(res){
  if (res.errcode==0){
    app.toast.success("提交成功", 1000);
    setTimeout(() => {
      wx.redirectTo({
        url: '../member/member'
      })
    }, 1000)
  }

},function fail(res){

})
} , /**
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